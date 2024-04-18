import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { knexService } from "../services/knex-service";
import type { Audit, FilterObject } from "~/types/AuditTrail";
import moment from "moment";

const generateQueryString = (filter: FilterObject, loginWebId: string) => {
  let queryString = "";
  if (Object.keys(filter).length !== 0) {
    for (const key of Object.keys(filter)) {
      if (filter[key] && filter[key] !== "") {
        queryString += `${queryString.length === 0 ? "" : " AND "}${key} ILIKE '%${filter[key]}%'`;
      }
    }

    if (queryString.includes("actioner")) {
      queryString += ` AND actionee = '${loginWebId}'`;
    } else {
      queryString += ` AND actioner = '${loginWebId}'`;
    }
  } else {
    queryString += `actioner='${loginWebId}' OR actionee='${loginWebId}'`;
  }

  return queryString;
};

// const generateSortString = (sort: SortingProps[]) => {
//   let sortString = "";

//   for (const item of sort) {
//     if (sortString.length === 0) {
//       sortString += `${item.column} ${item.order}`;
//     } else {
//       sortString += `, ${item.column} ${item.order}`;
//     }
//   }

//   return sortString;
// };

const accessEnums: string[] = ["GRANT ACCESS", "CHANGE ACCESS", "REVOKE ACCESS"];
export const auditRouter = createTRPCRouter({
  getMyAuditTrails: publicProcedure
    .input(
      z.object({
        filter: z.record(z.string(), z.string()),
        sort: z.array(z.object({ column: z.string(), order: z.enum(["asc", "desc"]), nulls: z.enum(["first", "last"]) })),
        loginWebId: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { filter, sort, loginWebId } = input;

      const queryString = generateQueryString(filter, loginWebId);
      // const sortString = generateSortString(sort);

      const data = await knexService("audit").select("*").whereRaw(queryString).orderBy(sort);
      return data as Audit[];
    }),

  createAuditTrail: publicProcedure
    .input(
      z.object({
        auditValue: z.object({
          action_type: z.enum([
            "CREATE FOLDER",
            "DELETE FOLDER",
            "UPLOAD RESOURCE",
            "DOWNLOAD RESOURCE",
            "DELETE RESOURCE",
            "GRANT ACCESS",
            "CHANGE ACCESS",
            "REVOKE ACCESS",
            "ADD CONTACT",
            "DELETE CONTACT",
          ]),
          actionee: z.string(),
          resource_url: z.string(),
          new_value: z.enum(["VIEWER", "EDITOR"]).optional(),
        }),
        loginWebId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { auditValue, loginWebId } = input;

      const insertingInput: Partial<Audit> = {
        action_type: auditValue.action_type,
        actioner: loginWebId,
        actionee: auditValue.actionee,
        resource_url: auditValue.resource_url,
      };

      if (auditValue.action_type === "CHANGE ACCESS" || auditValue.action_type === "REVOKE ACCESS") {
        //to get the latest access value that the shared user owns
        const previousRecord = await knexService<Audit>("audit")
          .where("actioner", loginWebId)
          .where("actionee", auditValue.actionee)
          .where("resource_url", auditValue.resource_url)
          .whereIn("action_type", accessEnums)
          .orderBy("created_at", "desc")
          .first();

        if (previousRecord) {
          insertingInput.old_value = previousRecord.new_value;
        }
      }

      if (auditValue.action_type === "GRANT ACCESS" || auditValue.action_type === "CHANGE ACCESS") {
        insertingInput.new_value = auditValue.new_value;
      }

      const data = await knexService("audit").insert(insertingInput);

      return data;
    }),

  findSharedResourcesToMe: publicProcedure.input(z.string()).query(async ({ input }) => {
    const sharedAccessRecords = await knexService<Audit>("audit")
      .whereNot("actioner", input)
      .where("actionee", input)
      .whereIn("action_type", accessEnums)
      .orderBy("created_at", "desc");
    const resourceUrls = [...new Set(sharedAccessRecords.map((item) => item.resource_url))];
    const sharedResources: Audit[] = [];

    const allResourcesRecords = await knexService<Audit>("audit").whereIn("resource_url", resourceUrls).orderBy("created_at", "desc");

    for (const resourceUrl of resourceUrls) {
      const latestSharedAccessRecord = sharedAccessRecords.find((item) => item.resource_url === resourceUrl);
      const latestResourceRecord = allResourcesRecords.find((item) => item.resource_url === resourceUrl);

      if (!latestSharedAccessRecord) {
        continue;
      }

      //if latest audit trail for current resource to me is revoke, filter out
      if (latestSharedAccessRecord?.action_type === "REVOKE ACCESS") {
        continue;
      }

      //if latest audit trail for current resource is delete, filter out
      if (latestResourceRecord && latestResourceRecord.action_type.includes("DELETE")) {
        continue;
      }

      //if there is a delete after the latest access grant, filter out
      const latestDeleteAfterGrant = allResourcesRecords.find(
        (item) =>
          item.resource_url === resourceUrl &&
          item.action_type.includes("DELETE") &&
          moment(item.created_at).format("yyyy-MM-DD HH:mm:ss") > moment(latestSharedAccessRecord.created_at).format("yyyy-MM-DD HH:mm:ss")
      );

      if (latestDeleteAfterGrant) {
        continue;
      }

      sharedResources.push(latestSharedAccessRecord);
    }
    return sharedResources;
  }),
  findAnAuditTrail: publicProcedure
    .input(
      z.object({
        action_type: z.enum([
          "CREATE FOLDER",
          "DELETE FOLDER",
          "UPLOAD RESOURCE",
          "DOWNLOAD RESOURCE",
          "DELETE RESOURCE",
          "GRANT ACCESS",
          "CHANGE ACCESS",
          "REVOKE ACCESS",
        ]),
        resource_url: z.string(),
      })
    )
    .query(async ({ input }) => {
      const auditRecord = await knexService<Audit>("audit").where("resource_url", input.resource_url).where("action_type", input.action_type).first();
      return auditRecord;
    }),
});
