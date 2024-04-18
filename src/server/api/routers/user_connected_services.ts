import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { knexService } from "../services/knex-service";

interface UserConnectedService {
  id: number;
  web_id: string;
  service_name: string;
  access_token: string;
  refresh_token: string;
  expires_at: string;
  created_at: Date;
  updated_at: Date;
}

export const userConnectedServiceRouter = createTRPCRouter({
  getMyConnectedServices: publicProcedure.input(z.string()).query(async ({ input }) => {
    const data = await knexService<UserConnectedService>("user_connected_services").where("web_id", input);
    return data;
  }),

  updateOrCreateMyConnectedService: publicProcedure
    .input(
      z.object({
        web_id: z.string(),
        service_name: z.string(),
        access_token: z.string(),
        refresh_token: z.string(),
        expires_at: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const currentConnectedService = await knexService<UserConnectedService>("user_connected_services")
        .where("web_id", input.web_id)
        .where("service_name", input.service_name)
        .first();
      if (currentConnectedService) {
        const updatedCurrentConnectedService = await knexService<UserConnectedService>("user_connected_services")
          .update({
            access_token: input.access_token,
            refresh_token: input.refresh_token,
            expires_at: input.expires_at,
          })
          .where("id", currentConnectedService.id);
        return updatedCurrentConnectedService;
      }
      const data = await knexService("user_connected_services").insert(input);

      return data;
    }),
  deleteMyConnectedService: publicProcedure
    .input(
      z.object({
        web_id: z.string(),
        service_name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const data = await knexService<UserConnectedService>("user_connected_services")
        .where("web_id", input.web_id)
        .where("service_name", input.service_name)
        .delete();
      return data;
    }),
});
