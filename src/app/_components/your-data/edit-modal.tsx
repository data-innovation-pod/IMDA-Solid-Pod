"use client";

import styles from "./your-data-styles.module.css";
import globalStyles from "~/styles/global-styles.module.css";

import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import {
  getAgentAccessAll,
  getSolidDatasetWithAcl,
  type SolidDataset,
  type WithAcl,
  type WithServerResourceInfo,
  getFileWithAcl,
} from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";

import { CrossIcon, EditUserIcon } from "~/app/_assets/svg";
import { useGlobalContext } from "~/app/_context/store";
import EditModalTableRow from "./edit-modal-table-row";
import { getContactsForDisplay, getNameEmailFromOriginalWebId, getProfileImage, updateDatasetAccess } from "~/app/_utils/wrangle-pods";
import { type User } from "./detail-column";
import Chevron from "~/app/_assets/svg/chevron";

interface Option {
  value: string;
  label: string;
}

interface InputWithSelectProps {
  options: Option[];
  setInputWebId: React.Dispatch<React.SetStateAction<string>>;
  setErrorMsg: React.Dispatch<React.SetStateAction<string | null | undefined>>;
  inputDisplayValue: string;
  setInputDisplayValue: React.Dispatch<React.SetStateAction<string>>;
  isOptionsOpen: boolean;
  setIsOptionsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface EditModalProps {
  folderName: string;
  isFolder?: boolean;
  onSaveCallback: () => Promise<void>;
  resourceUrl?: string;
}

export interface EditModalHandle {
  isShowing: () => boolean;
  show: () => void;
  hide: () => void;
  updateRole: (role: "Editor" | "Viewer") => void;
}

const EditModal = forwardRef<EditModalHandle, EditModalProps>(function EditModal(props, ref) {
  const { folderName, isFolder, onSaveCallback, resourceUrl } = props;
  const { podUrl, webId } = useGlobalContext();

  const [isShowing, setIsShowing] = useState<boolean>(false);
  const [role, setRole] = useState<"Editor" | "Viewer">();
  const [webIdsToBeAdded, setWebIdsToBeAdded] = useState<Set<string>>(new Set());
  const [webIdsToBeRemoved, setWebIdsToBeRemoved] = useState<Set<string>>(new Set());
  const [editors, setEditors] = useState<User[]>([]);
  const [viewers, setViewers] = useState<User[]>([]);

  const [selectOptions, setSelectOptions] = useState<Option[]>([]);
  const [isOptionsOpen, setIsOptionsOpen] = useState<boolean>(false);
  const [inputWebId, setInputWebId] = useState<string>("");
  const [inputDisplayValue, setInputDisplayValue] = useState<string>("");
  const [selectedWebIds, setSelectedWebIds] = useState<string[]>([]);

  const [errorMsg, setErrorMsg] = useState<string | null>();

  const boxRef = useRef<HTMLDivElement>(null);
  const type = isFolder ? "folder" : "resource";
  const roleDesc = role === "Editor" ? `Can view, edit, and delete this ${type}` : `Can view but cannot edit or delete this ${type}`;

  useImperativeHandle(
    ref,
    () => {
      return {
        isShowing() {
          return isShowing;
        },
        show() {
          setIsShowing(true);
        },
        hide() {
          setIsShowing(false);
        },
        updateRole(role: "Editor" | "Viewer") {
          setRole(role);
        },
      };
    },
    [isShowing]
  );

  async function setInitialEditors() {
    if (!resourceUrl) return;

    let solidDataset: (SolidDataset | Blob) & WithServerResourceInfo & WithAcl;
    if (resourceUrl.endsWith("/")) {
      solidDataset = await getSolidDatasetWithAcl(resourceUrl, { fetch });
    } else {
      solidDataset = await getFileWithAcl(resourceUrl, { fetch });
    }
    const authorisedUsers = getAgentAccessAll(solidDataset);

    if (!authorisedUsers) throw new Error("authorisedUsers object is empty");

    const currentEditors: string[] = [];

    // Include currently authorised editors
    for (const [currentWebId, access] of Object.entries(authorisedUsers)) {
      if (currentWebId === webId) continue;

      if (access.write) {
        currentEditors.push(currentWebId);
      }
    }

    const promises = currentEditors.map(async (webId) => {
      const [name] = await getNameEmailFromOriginalWebId(webId);
      const profileImage = await getProfileImage(webId);
      const profileImageUrl = profileImage ? profileImage.internal_resourceInfo.sourceIri : null;
      return { name, webId, profileImageUrl };
    });

    const processedEditors = await Promise.all(promises);

    setEditors(processedEditors);
  }

  async function updateEditors() {
    // Include soon to be added editors
    const newEditors = [...webIdsToBeAdded];

    // Exclude soon to be removed editors
    const filteredEditors = newEditors.filter((webId) => !webIdsToBeRemoved.has(webId));

    const promises = filteredEditors.map(async (webId) => {
      const [name] = await getNameEmailFromOriginalWebId(webId);
      const profileImage = await getProfileImage(webId);
      const profileImageUrl = profileImage ? profileImage.internal_resourceInfo.sourceIri : null;
      return { name, webId, profileImageUrl };
    });

    const processedEditors = await Promise.all(promises);
    const removeDuplicateEditors = editors.filter((editor) => !webIdsToBeAdded.has(editor.webId));
    const combinedEditors = [...removeDuplicateEditors, ...processedEditors];
    const processedCombinedEditors = combinedEditors.filter((editor) => !webIdsToBeRemoved.has(editor.webId));
    setEditors(processedCombinedEditors);
  }

  async function setInitialViewers() {
    if (!resourceUrl) return;

    let solidDataset: (SolidDataset | Blob) & WithServerResourceInfo & WithAcl;
    if (resourceUrl.endsWith("/")) {
      solidDataset = await getSolidDatasetWithAcl(resourceUrl, { fetch });
    } else {
      solidDataset = await getFileWithAcl(resourceUrl, { fetch });
    }
    const authorisedUsers = getAgentAccessAll(solidDataset);

    if (!authorisedUsers) throw new Error("authorisedUsers object is empty");

    const currentViewers: string[] = [];

    // Include currently authorised viewers
    for (const [currentWebId, access] of Object.entries(authorisedUsers)) {
      if (currentWebId === webId) continue;

      if (access.read && !access.write) {
        currentViewers.push(currentWebId);
      }
    }

    const promises = currentViewers.map(async (webId) => {
      const [name] = await getNameEmailFromOriginalWebId(webId);
      const profileImage = await getProfileImage(webId);
      const profileImageUrl = profileImage ? profileImage.internal_resourceInfo.sourceIri : null;
      return { name, webId, profileImageUrl };
    });

    const processedViewers = await Promise.all(promises);
    setViewers(processedViewers);
  }

  async function updateViewers() {
    // Include soon to be added viewers
    const newViewers = [...webIdsToBeAdded];

    // Exclude soon to be removed viewers
    const filteredViewers = newViewers.filter((webId) => !webIdsToBeRemoved.has(webId));

    const promises = filteredViewers.map(async (webId) => {
      const [name] = await getNameEmailFromOriginalWebId(webId);
      const profileImage = await getProfileImage(webId);
      const profileImageUrl = profileImage ? profileImage.internal_resourceInfo.sourceIri : null;
      return { name, webId, profileImageUrl };
    });

    const processedViewers = await Promise.all(promises);
    const removeDuplicateViewers = viewers.filter((viewer) => !webIdsToBeAdded.has(viewer.webId));
    const combinedViewers = [...removeDuplicateViewers, ...processedViewers];
    const processedCombinedViewers = combinedViewers.filter((viewer) => !webIdsToBeRemoved.has(viewer.webId));
    setViewers(processedCombinedViewers);
  }

  async function handleAddWebId() {
    setIsOptionsOpen(false);
    // remove all inputs from the 4th '/' onwards b4 joining w "/profile/card#me" to form a full webId url
    const processedWebId = inputWebId?.split("/").slice(0, 4).join("/") + "/profile/card#me";
    if (!inputWebId) {
      setErrorMsg("Please fill in the field");
      return;
    }

    try {
      const result = await fetch(processedWebId);
      if (result.status !== 200) {
        setErrorMsg("Unable to locate WebID. Please check the WebID entered and try again.");
        return;
      }
    } catch (error) {
      setErrorMsg("Unable to locate WebID. Please check the WebID entered and try again.");
      return;
    }

    if (processedWebId === webId) {
      setErrorMsg("You have entered your own WebID. Please enter another person’s WebID.");
      return;
    }

    if (role === "Editor" && editors.map((editor) => editor.webId).includes(processedWebId)) {
      setErrorMsg("This WebID already has access.");
      return;
    }

    if (role === "Viewer" && viewers.map((viewer) => viewer.webId).includes(processedWebId)) {
      setErrorMsg("This WebID already has access.");
      return;
    }

    setErrorMsg(null);
    setInputDisplayValue("");
    setInputWebId("");
    setWebIdsToBeRemoved((prevState) => {
      const newState = new Set([...prevState]);
      newState.delete(processedWebId);
      return newState;
    });
    setWebIdsToBeAdded((prevState) => {
      const newState = new Set([...prevState]);
      newState.add(processedWebId);
      return newState;
    });
  }

  function handleDelete() {
    if (selectedWebIds.length === 0) return;

    setWebIdsToBeAdded((prevState) => {
      const newState = new Set([...prevState]);
      selectedWebIds.forEach((selectedWebId) => {
        newState.delete(selectedWebId);
      });
      return newState;
    });
    setWebIdsToBeRemoved((prevState) => {
      const newState = new Set([...prevState]);
      selectedWebIds.forEach((selectedWebId) => {
        newState.add(selectedWebId);
      });
      return newState;
    });
    setSelectedWebIds([]);
  }

  async function handleSaveChanges() {
    const loginWebId = webId ?? "";
    if (!resourceUrl) return;

    let solidDatasetWithAcl: (SolidDataset | Blob) & WithServerResourceInfo & WithAcl;
    if (resourceUrl.endsWith("/")) {
      solidDatasetWithAcl = await getSolidDatasetWithAcl(resourceUrl, { fetch });
    } else {
      solidDatasetWithAcl = await getFileWithAcl(resourceUrl, { fetch });
    }
    // Revoke access
    const promises: Promise<void>[] = [...webIdsToBeRemoved].map((webId) => updateDatasetAccess(webId, solidDatasetWithAcl, "revoke", loginWebId));
    try {
      await Promise.all(promises);
    } catch {
      console.log("failed");
    }

    // Add users
    if (role === "Editor") {
      const promises: Promise<void>[] = [...webIdsToBeAdded].map((webId) =>
        updateDatasetAccess(webId, solidDatasetWithAcl, "addAsEditor", loginWebId)
      );
      await Promise.all(promises);
    } else {
      const promises: Promise<void>[] = [...webIdsToBeAdded].map((webId) =>
        updateDatasetAccess(webId, solidDatasetWithAcl, "addAsViewer", loginWebId)
      );
      await Promise.all(promises);
    }

    await onSaveCallback();

    setWebIdsToBeAdded(new Set());
    setWebIdsToBeRemoved(new Set());
    setIsShowing(false);
  }

  function handleOutsideClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (boxRef.current?.contains(event.target as Node)) return;
    setWebIdsToBeAdded(new Set());
    setWebIdsToBeRemoved(new Set());
    setIsShowing(false);
    setErrorMsg("");
  }

  function handleCancel() {
    setWebIdsToBeAdded(new Set());
    setWebIdsToBeRemoved(new Set());
    setIsShowing(false);
  }

  function createHandleSelectWebId(webId: string) {
    return () => {
      if (selectedWebIds.includes(webId)) {
        setSelectedWebIds((prevState) => {
          return prevState.filter((item) => item !== webId);
        });
      } else {
        setSelectedWebIds((prevState) => {
          return [...prevState, webId];
        });
      }
    };
  }

  useEffect(() => {
    if (role === "Editor") {
      void setInitialEditors();
    } else {
      void setInitialViewers();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowing, role, resourceUrl]);

  useEffect(() => {
    if (role === "Editor") {
      void updateEditors();
    } else {
      void updateViewers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [webIdsToBeAdded, webIdsToBeRemoved]);

  useEffect(() => {
    if (!podUrl) return;

    const contactsSolidDataUrl = `${podUrl}contacts/`;
    getContactsForDisplay(contactsSolidDataUrl)
      .then((result) => {
        const options: Option[] = [];
        for (const { name, webIdUrl } of Object.values(result)) {
          if (!webIdUrl) continue;

          options.push({
            label: name ?? webIdUrl,
            value: webIdUrl,
          });
        }
        setSelectOptions(options);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [podUrl]);

  return (
    <div
      onClick={handleOutsideClick}
      className={`${styles.editModalBackground} ${isShowing ? "flex" : "hidden"}`}>
      <div
        ref={boxRef}
        className={styles.editModalContainer}>
        <div className={styles.titleContainer}>
          <p className={styles.title}>{`Allow access for "${decodeURIComponent(folderName)}"`}</p>
          <button onClick={handleCancel}>
            <CrossIcon />
          </button>
        </div>
        <div className={styles.roleContainer}>
          <div className={styles.iconContainer}>
            <EditUserIcon />
          </div>
          <div>
            {role === "Editor" ? <p className="font-semibold">Allow Read and Edit</p> : <p className="font-semibold">Allow Read Only</p>}
            <p className="text-sm">{roleDesc}</p>
          </div>
        </div>

        <InputWithSelect
          options={selectOptions}
          setErrorMsg={setErrorMsg}
          setInputWebId={setInputWebId}
          inputDisplayValue={inputDisplayValue}
          setInputDisplayValue={setInputDisplayValue}
          isOptionsOpen={isOptionsOpen}
          setIsOptionsOpen={setIsOptionsOpen}
        />
        {errorMsg && <span className={globalStyles.errorMsg}>{errorMsg}</span>}

        <div className="flex justify-end">
          <button
            onClick={handleAddWebId}
            className={styles.secondaryButton}>
            + Add WebID
          </button>
        </div>

        <table className={styles.tableContainer}>
          <thead>
            <tr className={styles.tableRow}>
              <td className={styles.selectionColHeader}></td>
              <td className={styles.nameColHeader}>Name</td>
              <td className={styles.webIdColHeader}>WebID</td>
            </tr>
            <tr className="h-px bg-grey-light" />
          </thead>
          <tbody className={styles.tableBody}>
            {role === "Editor"
              ? editors.map((user) => (
                  <EditModalTableRow
                    key={webId}
                    handleClick={createHandleSelectWebId(user.webId)}
                    selectedWebIds={selectedWebIds}
                    user={user}
                  />
                ))
              : viewers.map((user) => (
                  <EditModalTableRow
                    key={webId}
                    handleClick={createHandleSelectWebId(user.webId)}
                    selectedWebIds={selectedWebIds}
                    user={user}
                  />
                ))}
          </tbody>
        </table>

        <div className="flex justify-between">
          <button
            disabled={selectedWebIds.length === 0}
            onClick={handleDelete}
            className={selectedWebIds.length !== 0 ? styles.secondaryButton : styles.disabledButton}>
            Delete
          </button>
          <div className="flex gap-2">
            <button
              disabled={webIdsToBeAdded.size === 0 && webIdsToBeRemoved.size === 0}
              onClick={handleSaveChanges}
              className={webIdsToBeAdded.size > 0 || webIdsToBeRemoved.size > 0 ? styles.primaryButton : styles.disabledButton}>
              Save
            </button>
            <button
              onClick={handleCancel}
              className={styles.secondaryButton}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditModal;

const InputWithSelect: React.FC<InputWithSelectProps> = ({
  options,
  setInputWebId,
  setErrorMsg,
  inputDisplayValue,
  setInputDisplayValue,
  isOptionsOpen,
  setIsOptionsOpen,
}) => {
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = evt.target.value;
    setInputWebId(inputValue);
    setInputDisplayValue(inputValue);

    setIsOptionsOpen(true);
    setErrorMsg("");
  };

  const handleOptionClick = (option: Option) => {
    setInputWebId(option.value);
    setInputDisplayValue(option.label);
    setIsOptionsOpen(false);
  };

  useEffect(() => {
    // Update filtered options when input value changes
    if (inputDisplayValue.length > 0) {
      const filteredOptions = options.filter((option) => option.label.toLowerCase().startsWith(inputDisplayValue.toLowerCase()));
      setFilteredOptions(filteredOptions);
    } else {
      // If the input is empty, show the full options list
      setFilteredOptions(options);
    }
  }, [inputDisplayValue, options]);

  return (
    <>
      <div
        className={styles.editPermissionInputContainer}
        onClick={() => {
          setIsOptionsOpen((prev) => !prev);
          setErrorMsg("");
        }}>
        <input
          className={styles.input}
          type="text"
          value={inputDisplayValue}
          onChange={handleInputChange}
          placeholder="Search for name or WebID"
        />
        <div className={styles.inputIcon}>
          <Chevron direction="down" />
        </div>
      </div>
      {isOptionsOpen && filteredOptions.length > 0 && (
        <ul className={styles.selectOptionsList}>
          {filteredOptions.map((option, index) => (
            <li
              className={styles.listItem}
              key={index}
              onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </>
  );
};
