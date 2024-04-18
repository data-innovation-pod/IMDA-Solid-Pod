"use client";

import { api } from "~/trpc/react";
import { useMemo } from "react";
import { cloneDeep } from "lodash";
import { type UserSharedResources } from "~/types/SharedResources";
import Accordion from "../_components/accordion/accordion";
import { useGlobalContext } from "~/app/_context/store";

export default function SharedResourcesPage() {
  const { webId } = useGlobalContext();

  const response = api.audit.findSharedResourcesToMe.useQuery(webId ?? "");

  const sharedResourcesGroupByUser = useMemo(() => {
    const temp: UserSharedResources[] = [];
    const data = cloneDeep(response.data);
    const users = [...new Set(data?.map((item) => item.actioner))];
    for (const user of users) {
      const currentUserSharedResources = data?.filter((item) => item.actioner === user) ?? [];
      temp.push({
        user: user,
        resources: currentUserSharedResources,
      });
    }
    return temp;
  }, [response.data]);

  return (
    <>
      <p className="pb-6 text-grey-default">Data Shared with Me</p>
      {sharedResourcesGroupByUser.map((item) => (
        <div
          className="mb-6"
          key={item.user}>
          <Accordion {...item} />
        </div>
      ))}
    </>
  );
}
