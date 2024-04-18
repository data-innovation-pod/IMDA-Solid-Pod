import React, { useState, useRef, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./accordion-styles.module.css";
import AccordionArrow from "~/app/_assets/svg/accordion-arrow";
import { type UserSharedResources } from "~/types/SharedResources";
import SharedResourcesTable from "../shared-resources-table/shared-resources-table";
import { getNameEmailFromOriginalWebId } from "~/app/_utils/wrangle-pods";

export default function Accordion({ user, resources }: Readonly<UserSharedResources>) {
  const [isExpand, setIsExpand] = useState(false);
  const [name, setName] = useState<string>();
  const nodeRef = useRef(null);

  useEffect(() => {
    void (async function fetchName() {
      const [fetchedName] = await getNameEmailFromOriginalWebId(user);
      setName(fetchedName ?? "");
    })();
  }, [user]);

  return (
    <>
      <button
        className={styles.accordionTitleDiv}
        onClick={() => setIsExpand((prev) => !prev)}
        type="button">
        <div className={styles.iconContainer}>
          <AccordionArrow direction={isExpand ? "up" : "down"} />
        </div>
        <div className="text-left">
          <p className={styles.accordionUserName}>{name}</p>
          <p className={styles.accordionUserWebId}>{user}</p>
        </div>
      </button>
      <CSSTransition
        in={isExpand}
        timeout={0}
        unmountOnExit
        nodeRef={nodeRef}>
        <div ref={nodeRef}>
          <SharedResourcesTable
            resources={resources}
            user={user}
          />
        </div>
      </CSSTransition>
    </>
  );
}
