"use client";
import styles from "./layout-styles.module.css";
import globalStyles from "../../../styles/global-styles.module.css";
import { CreateFolderIcon, UploadFileIcon, AddIcon } from "~/app/_assets/svg";
import { type ComandBarProps } from "~/types/JsxComponents";
import {
  getCurrentLocation,
  createFolder,
  createSharedFolder,
  uploadResource,
  uploadAndOverwriteResource,
  addContact,
} from "~/app/_utils/wrangle-pods";
import { useState, useRef, type ChangeEvent, useEffect } from "react";
import { useGlobalContext } from "~/app/_context/store";
import { usePathname } from "next/navigation";
import { mergeClassnames } from "~/app/_utils";
import { forbiddenFoldernameChars } from "~/app/_utils/forbiddenChars";
import { getSolidDataset } from "@inrupt/solid-client";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { type SharedResourceStructure } from "~/types/SharedResources";
import { CommonModal, type CommonModalHandle } from "../common";

const errorMsgs = {
  sharedUploading: "Uploading failed. Please check with the owner of this folder if you have access, before trying again.",
  resourceExists: "Uploading failed as there is an existing resource or folder with the same name.",
  createSharedFolder: "Creating folder failed. Please check with the owner of this folder if you have access, before trying again.",
};

/*
- makes use of both rootPodUrl + app location bar url to get the correct CSS url to create folder/upload file
*/
export default function CommandBar({ structure, setStructure, variant }: ComandBarProps) {
  return (
    <div className={styles.commandBarContainer}>
      {(variant === "pod" || variant === "shared") && (
        <NormalPodCommandBar
          structure={structure}
          setStructure={setStructure}
          variant={variant}
        />
      )}
      {variant === "contacts" && <ContactsCommandBar setStructure={setStructure} />}
    </div>
  );
}

function NormalPodCommandBar({ variant }: ComandBarProps) {
  const { podUrl, webId, sharedResourcesStructure } = useGlobalContext();
  let currentLocation = usePathname();
  if (variant === "pod") {
    currentLocation = getCurrentLocation(podUrl) ?? "";
  }
  const fileUploadInput = useRef<HTMLInputElement | null>(null);
  const folderUploadInput = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [isShowingDropdown, setIsShowingDropdown] = useState(false);
  const [invalidFolderNameMsg, setInvalidFolderNameMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<{ error: boolean; errorMsg?: string }>({ error: false, errorMsg: "" });
  const [inputStates, setInputStates] = useState<{ value?: string; error?: boolean; disabled?: boolean } | undefined>({
    value: "",
    error: false,
    disabled: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const uploadFolderModalRef = useRef<CommonModalHandle>(null);
  const uploadFolderErrorModalRef = useRef<CommonModalHandle>(null);

  function handleClick() {
    setIsShowingDropdown((prev) => !prev);
  }

  function getSharedResourceUrl() {
    // need to draw data either from state or local storage cos state is lost once page refreshes
    const sharedResourcesStructureFromLocalStorage = JSON.parse(
      localStorage.getItem("shared_resources_structure") ?? "{}"
    ) as SharedResourceStructure;
    console.log("sharedResourcesStructureFromLocalStorage", sharedResourcesStructureFromLocalStorage);
    const sharerWebId = sharedResourcesStructure?.sharerWebId ?? sharedResourcesStructureFromLocalStorage?.sharerWebId;
    const sharedBaseUrl = sharedResourcesStructure?.sharerBaseUrl ?? sharedResourcesStructureFromLocalStorage?.sharerBaseUrl;
    const currentLocationUrl = new URL(`${window.location.origin}${currentLocation}`);
    const segments = currentLocationUrl?.pathname?.split("/").slice(2);
    let resourceUrl;
    if (segments.length > 1) {
      resourceUrl = `${sharedBaseUrl}${segments.slice(1).join("/")}/`;
    } else {
      resourceUrl = sharedBaseUrl;
    }
    return [resourceUrl, sharerWebId];
  }

  async function handleCreateFolder() {
    const hasForbiddenChars = forbiddenFoldernameChars.test(inputStates?.value ?? "");
    if (hasForbiddenChars) {
      setInvalidFolderNameMsg('The following characters are not allowed: @#$%*=[]|\\:";<>,?');
      return;
    }

    const podData = await getSolidDataset(currentLocation, { fetch });
    const existingUrls = Object.keys(podData.graphs.default);
    const existingNames = existingUrls.map((url) => url.split("/").at(-2));
    if (existingNames.includes(inputStates?.value)) {
      setInvalidFolderNameMsg(`The name "${inputStates?.value}" is already taken. Please choose a different name.`);
      return;
    }

    const result = await createFolder(currentLocation ?? "", inputStates?.value ?? "", webId ?? "");
    if (result.success) {
      setInputStates((prev) => ({ ...prev, value: "" }));
      window.location.reload();
    }
    if (result.error instanceof Error && result.error.message.toString().includes("409")) {
      setInvalidFolderNameMsg(`Folder cannot have the same name as an existing resource.`);
    }
  }

  async function handleSharedCreateFolder() {
    const [resourceUrl, sharerWebId] = getSharedResourceUrl();
    const result = await createSharedFolder(resourceUrl ?? "", inputStates?.value ?? "", webId ?? "", sharerWebId ?? "");
    setInputStates((prev) => ({ ...prev, value: "" }));
    if (result instanceof Error && result.message.includes("403")) {
      uploadFolderErrorModalRef.current?.show();
      setErrorMsg((prev) => ({
        ...prev,
        error: true,
        errorMsg: errorMsgs.createSharedFolder,
      }));
    } else {
      window.location.reload();
    }
  }

  async function handleUploadMultipleFiles(evt: ChangeEvent<HTMLInputElement>) {
    const chosenFiles = evt?.target?.files;

    if (!chosenFiles) return;

    if (variant === "pod") {
      const errorFiles: string[] = [];
      try {
        for (const chosenFile of chosenFiles) {
          const result = await uploadAndOverwriteResource(currentLocation ?? "", chosenFile, webId ?? "");
          if (result instanceof Error && result.message.includes("[500]")) {
            errorFiles.push(chosenFile.name);
          }
        }
        if (errorFiles.length > 0) {
          uploadFolderErrorModalRef.current?.show();
          setErrorMsg((prev) => ({ ...prev, error: true, errorMsg: `${errorFiles.join(",")} already exists.` }));
        } else {
          window.location.reload();
        }
      } catch (error) {
        throw error;
      }
    }

    if (variant === "shared") {
      try {
        const [resourceUrl, sharerWebId] = getSharedResourceUrl();
        let nilErrors = true;
        for (const chosenFile of chosenFiles) {
          const result = await uploadResource(resourceUrl ?? "", chosenFile, webId ?? "", sharerWebId);
          if (result instanceof Error) {
            nilErrors = false;
            uploadFolderErrorModalRef.current?.show();
            setErrorMsg((prev) => ({
              ...prev,
              error: true,
              errorMsg: errorMsgs.sharedUploading,
            }));
          }
        }
        if (nilErrors) window.location.reload();
      } catch (error) {
        throw error;
      }
    }
    fileUploadInput.current?.form?.reset();
  }

  async function handleUploadFolder(evt: ChangeEvent<HTMLInputElement>) {
    const chosenFiles = evt?.target?.files;
    if (!chosenFiles) return;

    for (const chosenFile of chosenFiles) {
      const relativePath = chosenFile.webkitRelativePath;
      const lastSlashIndex = relativePath.lastIndexOf("/");
      // Replace all forbidden characters with "-"
      const folderName = relativePath.slice(0, lastSlashIndex).replaceAll(forbiddenFoldernameChars, "-");

      // Create a new folder if it doesn't exist
      const folderLocation = currentLocation + folderName + "/";
      try {
        await getSolidDataset(folderLocation, { fetch });
      } catch {
        await createFolder(currentLocation ?? "", folderName, webId ?? "");
      }

      if (chosenFile.type === "") continue;

      const uploadResult = await uploadResource(folderLocation, chosenFile, webId ?? "");
      if (uploadResult instanceof Error && uploadResult.message.includes("[500]")) {
        uploadFolderErrorModalRef.current?.show();
        setErrorMsg((prev) => ({
          ...prev,
          error: true,
          errorMsg: errorMsgs.resourceExists,
        }));
        return;
      } else if (uploadResult instanceof Error) {
        uploadFolderErrorModalRef.current?.show();
        setErrorMsg((prev) => ({
          ...prev,
          error: true,
          errorMsg: errorMsgs.sharedUploading,
        }));
        return;
      }
    }
    window.location.reload();
  }

  useEffect(() => {
    if (isShowingDropdown) folderInputRef.current?.focus();
  }, [isShowingDropdown]);

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsShowingDropdown(false);
    }
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <>
      <div ref={dropdownRef}>
        <button
          onClick={handleClick}
          className={styles.buttonContainer}
          type="button">
          <div>
            <CreateFolderIcon />
          </div>
          <p>Create folder</p>
        </button>
        <div
          data-testid="cy-create-folder-popup"
          className={mergeClassnames(styles.createFolderModalContainer, isShowingDropdown ? "block" : "hidden")}>
          <div className={styles.inner}>
            <input
              data-testid="cy-create-folder-input"
              ref={folderInputRef}
              type="text"
              placeholder="Please key in folder name."
              onChange={(evt) => {
                setInputStates((prev) => ({ ...prev, value: evt.target.value }));
                setErrorMsg((prev) => ({
                  ...prev,
                  error: false,
                  errorMsg: "",
                }));
                setInvalidFolderNameMsg("");
              }}
              value={inputStates?.value}
              className={globalStyles.textInput}
            />
            {invalidFolderNameMsg && <p className={globalStyles.errorMsg}>{invalidFolderNameMsg}</p>}
            {variant === "pod" && (
              <button
                data-testid="cy-create-folder-btn"
                onClick={() => handleCreateFolder()}
                className={globalStyles.primaryButton}>
                Create folder
              </button>
            )}
            {variant === "shared" && (
              <button
                onClick={() => handleSharedCreateFolder()}
                className={globalStyles.primaryButton}>
                Create folder
              </button>
            )}
          </div>
        </div>
      </div>
      <button
        className={styles.buttonContainer}
        onClick={() => fileUploadInput?.current?.click()}
        type="button">
        <div>
          <UploadFileIcon />
        </div>
        <p>Upload file</p>
      </button>
      <button
        className={styles.buttonContainer}
        onClick={() => uploadFolderModalRef.current?.show()}
        type="button">
        <div>
          <UploadFileIcon />
        </div>
        <p>Upload folder</p>
      </button>

      <form className="hidden">
        <input
          ref={fileUploadInput}
          onChange={(evt) => handleUploadMultipleFiles(evt)}
          type="file"
          multiple
        />
      </form>

      <form className="hidden">
        <input
          ref={folderUploadInput}
          onChange={(evt) => handleUploadFolder(evt)}
          // @ts-expect-error, As of now webkit syntax is not recognized by typescript
          directory=""
          webkitdirectory=""
          type="file"
        />
      </form>

      <CommonModal
        ref={uploadFolderModalRef}
        text="Please note if you choose an empty folder, nothing will happen."
        onClose={() => folderUploadInput?.current?.click()}
      />

      <CommonModal
        ref={uploadFolderErrorModalRef}
        text={errorMsg.errorMsg ?? ""}
        classNames="text-red-600"
      />
    </>
  );
}

function ContactsCommandBar({}: ComandBarProps) {
  const { podUrl, webId } = useGlobalContext();
  let currentLocation = getCurrentLocation(podUrl);
  const [isShowingDropdown, setIsShowingDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const addContactInputRef = useRef<HTMLInputElement | null>(null);
  const [inputStates, setInputStates] = useState<{ value?: string; error?: boolean; errorMsg?: string; disabled?: boolean } | undefined>({
    value: "",
    error: false,
    errorMsg: "",
    disabled: false,
  });

  function handleClick() {
    setIsShowingDropdown((prev) => !prev);
  }

  async function handleAddContact() {
    try {
      // remove all inputs from the 4th '/' onwards b4 joining w "/profile/card#me" to form a full webId url
      const processedWebId = inputStates?.value?.split("/").slice(0, 4).join("/") + "/profile/card#me";

      const result = await fetch(processedWebId);
      if (processedWebId === webId) {
        setInputStates((prev) => ({ ...prev, error: true, errorMsg: "Adding your own WebID is not allowed. Please try again." }));
        return;
      }
      if (result.status !== 200 || processedWebId === webId) {
        setInputStates((prev) => ({ ...prev, error: true }));
        return;
      }
      currentLocation = `${currentLocation}contacts/`;
      setInputStates((prev) => ({ ...prev, disabled: true }));
      await addContact(webId ?? "", currentLocation, processedWebId);
      setInputStates((prev) => ({ ...prev, value: "", disabled: false }));
      window.location.reload();
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes("412")) {
        setInputStates((prev) => ({ ...prev, error: true, errorMsg: "WebID has already been added as a contact.", disabled: false }));
      } else if (inputStates?.value?.length === 0) {
        setInputStates((prev) => ({ ...prev, error: true, errorMsg: "Please enter the WebID of your contact.", disabled: false }));
      } else {
        setInputStates((prev) => ({ ...prev, error: true, errorMsg: "Invalid WebID entered.", disabled: false }));
      }
    }
  }

  useEffect(() => {
    isShowingDropdown && addContactInputRef?.current?.focus();
  }, [isShowingDropdown]);

  useEffect(() => {
    function handler(event: MouseEvent) {
      if (dropdownRef.current?.contains(event.target as Node)) return;
      setIsShowingDropdown(false);
      setInputStates((prev) => ({ ...prev, error: false, errorMsg: "" }));
    }
    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  return (
    <div ref={dropdownRef}>
      <button
        onClick={handleClick}
        className={styles.buttonContainer}>
        <AddIcon />
        <p>Add new contact</p>
      </button>
      <div
        data-testid="cy-contact-dropdown"
        className={mergeClassnames(styles.addContactModalContainer, isShowingDropdown ? "block" : "hidden")}>
        <div className={styles.inner}>
          <input
            data-testid="cy-contact-input"
            ref={addContactInputRef}
            type="text"
            placeholder="Please key webId."
            onChange={(evt) => setInputStates((prev) => ({ ...prev, value: evt.target.value, error: false, errorMsg: "" }))}
            value={inputStates?.value}
            className={globalStyles.textInput}
          />
          {inputStates?.error && (
            <p
              data-testid="cy-contact-err-msg"
              className={globalStyles.errorMsg}>
              {inputStates.errorMsg}
            </p>
          )}
          <button
            data-testid="cy-add-contact-btn"
            disabled={inputStates?.disabled}
            onClick={() => handleAddContact()}
            className={inputStates?.disabled ? globalStyles.primaryButtonInactive : globalStyles.primaryButton}>
            Add WebID
          </button>
        </div>
      </div>
    </div>
  );
}
