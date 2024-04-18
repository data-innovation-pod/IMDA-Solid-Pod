import moment from "moment";
import { fetch } from "@inrupt/solid-client-authn-browser";
import { type RDFObject, type DocumentObject } from "~/types/SolidData";
import {
  getSolidDataset,
  saveFileInContainer,
  getFile,
  getThing,
  getStringNoLocale,
  saveSolidDatasetAt,
  setThing,
  createContainerAt,
  deleteContainer,
  deleteSolidDataset,
  createAclFromFallbackAcl,
  createAcl,
  getWebIdDataset,
  setStringNoLocale,
  hasResourceAcl,
  hasAccessibleAcl,
  hasFallbackAcl,
  getResourceAcl,
  setPublicResourceAccess,
  saveAclFor,
  type Access,
  type SolidDataset,
  type WithAcl,
  type WithServerResourceInfo,
  setAgentResourceAccess,
  setAgentDefaultAccess,
  createContainerInContainer,
  getFileWithAcl,
  overwriteFile,
  getSolidDatasetWithAcl,
} from "@inrupt/solid-client";
import { DCTERMS, POSIX, VCARD } from "@inrupt/vocab-common-rdf";
import { filesize } from "filesize";
import { api } from "~/trpc/client";
import { forbiddenFilenameChars } from "./forbiddenChars";
import { ActionTypes } from "~/types/AuditTrail";

const accessControls = {
  none: { read: false, append: false, write: false, control: false },
  read: { read: true, append: false, write: false, control: false },
  write: { read: true, append: true, write: true, control: true },
};

async function checkForContactsFolder(contactsFolderUrl: string) {
  try {
    await getSolidDataset(contactsFolderUrl, { fetch });
  } catch (err) {
    console.log("contacts folder not found, creating one", err);
    await createContainerAt(contactsFolderUrl, { fetch: fetch });
  }
}

export async function getNameEmailFromOriginalWebId(webIdUrl: string) {
  const webIdDataset = await getWebIdDataset(webIdUrl);
  const webIdThing = getThing(webIdDataset, webIdUrl);

  if (webIdThing) {
    const webIdName = getStringNoLocale(webIdThing, VCARD.hasName);
    const webIdEmail = getStringNoLocale(webIdThing, VCARD.hasEmail);
    return [webIdName, webIdEmail];
  }
  return [null, null];
}

function getAttributesAndPath(data: RDFObject | undefined, item: string) {
  // theoretically shld be able to retrieve using getStringNoLocale(podDataContents?.[item], DCTERMS.modified). however becos obj structure has an additional 'predicates' key which is not standard rdf,  getStringNoLocale() returns null rather than the modified value

  const lastModifiedString = data?.predicates?.[DCTERMS.modified]?.literals?.["http://www.w3.org/2001/XMLSchema#dateTime"]?.[0];
  const lastModifiedDate = typeof lastModifiedString === "string" ? new Date(lastModifiedString) : undefined;
  const formattedLastModifiedDate = lastModifiedDate !== undefined ? moment(lastModifiedDate).format("yyyy-MM-DD HH:mm:ss") : undefined;
  const fileSizeString = Number(data?.predicates?.[POSIX.size]?.literals?.["http://www.w3.org/2001/XMLSchema#integer"]?.[0]);
  const formattedfileSize = fileSizeString ? filesize(fileSizeString, { standard: "jedec" }) : undefined;

  const rawlastSegmentPath = item.match(/([^/]+\/?)$/)?.[0];
  const cleanedLastSegmentPath = decodeURIComponent(rawlastSegmentPath ?? "");

  return [formattedLastModifiedDate, formattedfileSize, cleanedLastSegmentPath];
}

export async function getPodDataForDisplay(podUrl: string) {
  try {
    const podData = await getSolidDataset(podUrl, { fetch });
    const podDataContents = podData.graphs.default;
    // the very first item in podData.graphs.default will be the current container
    const podDataKeys = Object.keys(podDataContents).slice(1);
    // try creating contacts folder
    if (podDataKeys[0]) {
      const urlToExtractOriginFrom = new URL(podDataKeys[0]);
      const podDomain = podDataKeys[0]?.split("/")[3];
      const contactsFolderUrl = `${urlToExtractOriginFrom?.origin}/${podDomain}/contacts/`;
      await checkForContactsFolder(contactsFolderUrl);
    }

    const documentsObj: DocumentObject = {};
    podDataKeys.forEach((item) => {
      const [formattedLastModifiedDate, formattedfileSize, cleanedLastSegmentPath] = getAttributesAndPath(podDataContents?.[item], item);

      // dun want /contacts to be shown in normal pod display
      if (cleanedLastSegmentPath !== "contacts/") {
        documentsObj[cleanedLastSegmentPath ?? "default"] = {
          url: item,
          lastModified: formattedLastModifiedDate,
          fileSize: formattedfileSize,
        };
      }
    });
    // so if there is nothing inside a container, will return an empty object
    return documentsObj;
  } catch (err) {
    console.error(`Error retrieving pod data for ${podUrl}: `, err);
    return {};
  }
}

export async function getContactsForDisplay(podUrl: string) {
  await checkForContactsFolder(podUrl);
  const documentsObj: DocumentObject = {};
  try {
    const contactsData = await getSolidDataset(podUrl, { fetch });
    const contactsDataContents = contactsData.graphs.default;
    // the very first item in contactsData.graphs.default will be the current container
    const contactsDataKeys = Object.keys(contactsDataContents).slice(1);

    for (const contact of contactsDataKeys) {
      try {
        const contactItemDataset = await getSolidDataset(contact, { fetch });
        const webIdUrl = Object.keys(contactItemDataset.graphs.default).slice(-1).toString();

        // get name/email from original webId Thing if any
        const [webIdName] = await getNameEmailFromOriginalWebId(webIdUrl);

        const [formattedLastModifiedDate, formattedfileSize, cleanedLastSegmentPath] = getAttributesAndPath(contactsDataContents?.[contact], contact);

        documentsObj[cleanedLastSegmentPath ?? "default"] = {
          url: contact,
          lastModified: formattedLastModifiedDate,
          fileSize: formattedfileSize,
          webIdUrl: webIdUrl,
          name: webIdName,
        };
      } catch (err) {
        console.error(`Error processing ${contact}: `, err);
      }
    }

    // so if there is nothing inside a container, will return an empty object
    return documentsObj;
  } catch (err) {
    console.error(`Error retrieving contacts data for ${podUrl}: `, err);
    return {};
  }
}

export async function getSharedPodDataForDisplay(podUrl: string) {
  try {
    const podData = await getSolidDataset(podUrl, { fetch });
    // console.log('podData in getSharedPodDataForDisplay', podData)
    const podDataContents = podData.graphs.default;
    // the very first item in podData.graphs.default will be the current container
    const podDataKeys = Object.keys(podDataContents).slice(1);

    const documentsObj: DocumentObject = {};
    podDataKeys.forEach((item) => {
      const [formattedLastModifiedDate, formattedfileSize, cleanedLastSegmentPath] = getAttributesAndPath(podDataContents?.[item], item);

      documentsObj[cleanedLastSegmentPath ?? "default"] = {
        url: item,
        lastModified: formattedLastModifiedDate,
        fileSize: formattedfileSize,
      };
    });
    // so if there is nothing inside a container, will return an empty object
    return documentsObj;
  } catch (err) {
    console.error(`Error retrieving pod data for ${podUrl}: `, err);
    return {};
  }
}

export async function deleteResource(urlToDelete: string, webId: string, sharerWebId?: string) {
  if (urlToDelete.endsWith("/")) {
    try {
      await deleteContainer(urlToDelete, { fetch });

      await api.audit.createAuditTrail.mutate({
        loginWebId: webId,
        auditValue: {
          action_type: "DELETE FOLDER",
          actionee: sharerWebId ?? webId,
          resource_url: decodeURIComponent(urlToDelete),
        },
      });
      return "deleted";
    } catch (err) {
      console.error("error deleting container: ", err);
      return "error";
    }
  } else {
    try {
      await deleteSolidDataset(urlToDelete, { fetch });
      let actionType: ActionTypes = ActionTypes.DELETE_RESOURCE; // Default value
      if (urlToDelete.includes("/contacts/")) {
        actionType = ActionTypes.DELETE_CONTACT;
      }
      await api.audit.createAuditTrail.mutate({
        loginWebId: webId,
        auditValue: {
          action_type: actionType,
          actionee: sharerWebId ?? webId,
          resource_url: decodeURIComponent(urlToDelete),
        },
      });
      return "deleted";
    } catch (err) {
      console.error("error deleting Thing: ", err);
      return "error";
    }
  }
}

export async function recursiveDeleteResource(urlToDelete: string, webId: string, sharerWebId?: string) {
  const isFolder = urlToDelete.endsWith("/");

  // Base case: document is a file
  if (!isFolder) {
    try {
      console.log("execute delete file on", urlToDelete);
      await deleteSolidDataset(urlToDelete, { fetch });
      await api.audit.createAuditTrail.mutate({
        loginWebId: webId,
        auditValue: {
          action_type: "DELETE RESOURCE",
          actionee: sharerWebId ?? webId,
          resource_url: decodeURIComponent(urlToDelete),
        },
      });
      return "deleted";
    } catch (error) {
      return "error";
    }
  }

  // Recursion
  const podData = await getSolidDataset(urlToDelete, { fetch });
  const podDataContents = podData.graphs.default; // the very first item in podData.graphs.default will be the current container
  const childUrls = Object.keys(podDataContents).slice(1);

  // Recursion
  for (const childUrl of childUrls) {
    const result = await recursiveDeleteResource(childUrl, webId, sharerWebId);
    if (result === "error") return "error";
  }

  try {
    console.log("execute delete container on", urlToDelete);
    await deleteContainer(urlToDelete, { fetch });

    await api.audit.createAuditTrail.mutate({
      loginWebId: webId,
      auditValue: {
        action_type: "DELETE FOLDER",
        actionee: sharerWebId ?? webId,
        resource_url: decodeURIComponent(urlToDelete),
      },
    });
  } catch (error) {
    console.error("error deleting container: ", error);
    return "error";
  }

  return "deleted";
}

export async function downloadResource(urlToDownload: string, resourceName: string, webId: string, ownerWebId?: string) {
  try {
    const result = await getFile(urlToDownload, { fetch });
    if (result instanceof Blob) {
      const downloadUrl = URL.createObjectURL(result);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = resourceName;
      downloadLink.click();
      URL.revokeObjectURL(downloadUrl);
      await api.audit.createAuditTrail.mutate({
        loginWebId: webId,
        auditValue: {
          action_type: "DOWNLOAD RESOURCE",
          actionee: ownerWebId ?? webId,
          resource_url: decodeURIComponent(urlToDownload),
        },
      });
    }
  } catch (err) {
    console.error("Error downloading resource: ", err);
  }
}
export async function createFolder(currentLocation: string, folderName: string, webId: string) {
  const createdFolderUrl = `${currentLocation}${folderName}/`;
  try {
    await createContainerAt(createdFolderUrl, { fetch: fetch });

    await api.audit.createAuditTrail.mutate({
      loginWebId: webId,
      auditValue: {
        action_type: "CREATE FOLDER",
        actionee: webId,
        resource_url: decodeURIComponent(createdFolderUrl),
      },
    });
    return { success: true };
  } catch (err) {
    console.error("Error creating folder: ", err);
    return { success: false, error: err };
  }
}

export async function createSharedFolder(currentLocation: string, folderName: string, webId: string, sharerWebId: string) {
  const createdFolderUrl = `${currentLocation}${folderName}/`;
  try {
    await createContainerInContainer(currentLocation, { slugSuggestion: encodeURIComponent(folderName), fetch: fetch });

    await api.audit.createAuditTrail.mutate({
      loginWebId: webId,
      auditValue: {
        action_type: "CREATE FOLDER",
        // actionee is diff from other audit trail functions cos this is user creating folders on others' pods
        actionee: sharerWebId,
        resource_url: decodeURIComponent(createdFolderUrl),
      },
    });
    return "folder created";
  } catch (err) {
    return err;
  }
}

// this is only useful when want to ignore the very first segment path
export function getCurrentLocation(rootPodUrl: string | undefined) {
  const locationBarUrl = new URL(window.location.href);
  const locationBarSegments = locationBarUrl.pathname.split("/");
  const editedSegment = locationBarSegments.slice(2).join("/");
  const currentLocation = editedSegment ? `${rootPodUrl}${editedSegment}/` : rootPodUrl;
  return currentLocation;
}

export async function uploadResource(currentLocation: string, uploadedFile: File, webId: string, sharerWebId?: string) {
  try {
    const processedName = uploadedFile.name.replaceAll(forbiddenFilenameChars, "-");
    const result = await saveFileInContainer(currentLocation, uploadedFile, {
      slug: encodeURIComponent(processedName),
      contentType: uploadedFile.type || "multipart/form-data",
      fetch: fetch,
    });
    await api.audit.createAuditTrail.mutate({
      loginWebId: webId,
      auditValue: {
        action_type: "UPLOAD RESOURCE",
        // actionee is diff from other audit trail functions cos this is user creating folders on others' pods
        actionee: sharerWebId ?? webId,
        resource_url: decodeURIComponent(result.internal_resourceInfo.sourceIri),
      },
    });
    return "uploaded";
  } catch (err) {
    return err;
  }
}

export async function uploadAndOverwriteResource(currentLocation: string, uploadedFile: File, webId: string, sharerWebId?: string) {
  try {
    const processedName = uploadedFile.name.replaceAll(forbiddenFilenameChars, "-");
    const result = await overwriteFile(`${currentLocation}${encodeURIComponent(processedName)}`, uploadedFile, {
      contentType: uploadedFile.type || "multipart/form-data",
      fetch: fetch,
    });
    await api.audit.createAuditTrail.mutate({
      loginWebId: webId,
      auditValue: {
        action_type: "UPLOAD RESOURCE",
        // actionee is diff from other audit trail functions cos this is user creating folders on others' pods
        actionee: sharerWebId ?? webId,
        resource_url: decodeURIComponent(result.internal_resourceInfo.sourceIri),
      },
    });
    return "uploaded";
  } catch (err) {
    return err;
  }
}

export async function addContact(webId: string, currentLocation: string, contactUrl: string) {
  /*
  get current contactsSolidDataset
  */
  let contactsSolidDataset = await getSolidDataset(currentLocation, { fetch });
  /*
  this section is to get CSS domain + webId url so can save webId to this url
  */
  const webIdDataset = await getWebIdDataset(contactUrl);
  let webIdThing = getThing(webIdDataset, contactUrl);
  if (webIdThing) webIdThing = setStringNoLocale(webIdThing, VCARD.hasURL, webIdThing?.url);
  // eg. webIdThing.url = [ "http:", "", "localhost:3000", "test2pod1", "profile","card#me"]
  const rawWebIdUrlSegments = webIdThing?.url.split("/").slice(2);
  // for dev env use only. in pdt env, this shld not run
  if (rawWebIdUrlSegments?.[0]?.includes("localhost:")) rawWebIdUrlSegments[0] = rawWebIdUrlSegments?.[0]?.replace("localhost:", "") ?? "";
  const urlToSaveContact = `${currentLocation}${rawWebIdUrlSegments?.join("_")}`.replace("#me", "");
  /*
  updated contactsSolidDataset
  */
  if (webIdThing) {
    contactsSolidDataset = setThing(contactsSolidDataset, webIdThing);
    /*
  save updated contactsSolidDataset. watever is in the url will be overwritten
  */
    await saveSolidDatasetAt(urlToSaveContact, contactsSolidDataset, { fetch });
    await api.audit.createAuditTrail.mutate({
      loginWebId: webId,
      auditValue: {
        action_type: "ADD CONTACT",
        actionee: webId,
        resource_url: decodeURIComponent(urlToSaveContact),
      },
    });

    // let wedIdDatasetThing = null;
    // // CSS actually takes a while to return an updated data set... not sure why...
    // while (wedIdDatasetThing === null) {
    //   contactsSolidDataset = await getSolidDataset(currentLocation, { fetch });
    //   wedIdDatasetThing = getThing(contactsSolidDataset, urlToSaveContact);
    // }
  }
}

export async function viewContactProfile(webIdUrl: string | undefined): Promise<[string | null | undefined, string | null | undefined]> {
  if (webIdUrl) {
    const [webIdName, webIdEmail] = await getNameEmailFromOriginalWebId(webIdUrl);
    return [webIdName, webIdEmail];
  }
  return [null, null];
}

export async function getProfileImage(webId?: string) {
  if (!webId) return null;

  const profileImageFolderUrl = webId.replace("card#me", "profile-picture/");
  const result = await fetch(profileImageFolderUrl);
  if (result.status !== 200) return null;

  try {
    const profileImageFolder = await getSolidDataset(profileImageFolderUrl, { fetch });
    const profileImageUrl = Object.keys(profileImageFolder.graphs.default)[1];
    if (!profileImageUrl) {
      return null;
    } else {
      const image = await getFile(profileImageUrl ?? "", { fetch });
      return image;
    }
  } catch (error) {
    console.log("error", error);
    return null;
  }
}

export async function editContactProfile(
  resourceUrl: string | undefined,
  webIdUrl: string | undefined,
  name: string,
  email: string,
  profileImageFile?: File
) {
  if (!resourceUrl) {
    return false;
  }

  let thingDataset = await getSolidDataset(resourceUrl, { fetch });
  let webIdThing = getThing(thingDataset, webIdUrl ?? "");

  if (!webIdThing) return false;

  // Save name and email
  webIdThing = setStringNoLocale(webIdThing, VCARD.hasName, name);
  webIdThing = setStringNoLocale(webIdThing, VCARD.hasEmail, email);

  thingDataset = setThing(thingDataset, webIdThing);
  try {
    await saveSolidDatasetAt(resourceUrl ?? "", thingDataset, { fetch });
  } catch (err) {
    return false;
  }
  if (!profileImageFile) return true;

  const pictureFolderUrl = resourceUrl.replace("/card", "") + "/profile-picture/";
  // only want to delete the previous image if there is a new image chosen
  if (profileImageFile) {
    try {
      const currentProfilePicFolder = await getSolidDataset(pictureFolderUrl, { fetch });
      const currentProfilePic = Object.keys(currentProfilePicFolder.graphs.default)[1];
      // only delete if there was an actual previous profile pic uploaded
      if (currentProfilePic) await deleteSolidDataset(currentProfilePic ?? "", { fetch });
    } catch (err) {
      console.log(err);
    }
    // Save imageFile
    try {
      const processedName = profileImageFile.name.replaceAll(forbiddenFilenameChars, "-");
      await overwriteFile(`${pictureFolderUrl}${encodeURIComponent(processedName)}`, profileImageFile, {
        contentType: profileImageFile.type || "multipart/form-data",
        fetch: fetch,
      });
      // set access for both /profile-picture and the actual image file
      const folderWithAcl = await getSolidDatasetWithAcl(pictureFolderUrl, { fetch });
      await editPublicAccess(folderWithAcl, "read");

      const fileWithAcl = await getFileWithAcl(`${pictureFolderUrl}${encodeURIComponent(processedName)}`, { fetch });
      await editPublicAccess(fileWithAcl, "read");
    } catch (err) {
      console.error("this is error saving acl for profile image:", err);
      // return false;
    }
  }
  return true;
}

export async function editPublicAccess(
  solidDatasetWithAcl: (SolidDataset | Blob) & WithServerResourceInfo & WithAcl,
  access: "read" | "write" | "none"
) {
  let resourceAcl;
  if (!hasResourceAcl(solidDatasetWithAcl)) {
    if (!hasAccessibleAcl(solidDatasetWithAcl)) {
      throw new Error("The current user does not have permission to change access rights to this Resource.");
    }
    if (!hasFallbackAcl(solidDatasetWithAcl)) {
      resourceAcl = createAcl(solidDatasetWithAcl);
      throw new Error("The current user does not have permission to see who currently has access to this Resource.");
    }
    resourceAcl = createAclFromFallbackAcl(solidDatasetWithAcl);
  } else {
    resourceAcl = getResourceAcl(solidDatasetWithAcl);
  }

  const updatedAcl = setPublicResourceAccess(resourceAcl, accessControls[access]);
  // Now save the ACL:
  try {
    await saveAclFor(solidDatasetWithAcl, updatedAcl, { fetch });
  } catch (error) {
    console.log(error);
    throw new Error("error");
  }
}

export async function updateDatasetAccess(
  webId: string,
  solidDatasetWithAcl: (SolidDataset | Blob) & WithServerResourceInfo & WithAcl,
  action: "addAsEditor" | "addAsViewer" | "revoke",
  loginWebId: string
) {
  let resourceAcl;
  if (!hasResourceAcl(solidDatasetWithAcl)) {
    if (!hasAccessibleAcl(solidDatasetWithAcl)) {
      throw new Error("The current user does not have permission to change access rights to this Resource.");
    }
    if (!hasFallbackAcl(solidDatasetWithAcl)) {
      resourceAcl = createAcl(solidDatasetWithAcl);
      throw new Error("The current user does not have permission to see who currently has access to this Resource.");
    }
    resourceAcl = createAclFromFallbackAcl(solidDatasetWithAcl);
  } else {
    resourceAcl = getResourceAcl(solidDatasetWithAcl);
  }

  let option: Access;
  let actionType = "";
  let actionValue = undefined;
  switch (action) {
    case "addAsEditor":
      option = { read: true, append: true, write: true, control: true };
      actionType = "GRANT ACCESS";
      actionValue = "EDITOR";
      break;
    case "addAsViewer":
      option = { read: true, append: false, write: false, control: false };
      actionType = "GRANT ACCESS";
      actionValue = "VIEWER";
      break;
    default:
      option = { read: false, append: false, write: false, control: false };
      actionType = "REVOKE ACCESS";
  }

  let updatedAcl = setAgentResourceAccess(resourceAcl, webId, option);

  updatedAcl = setAgentDefaultAccess(updatedAcl, webId, option);
  await api.audit.createAuditTrail.mutate({
    loginWebId: loginWebId,
    auditValue: {
      action_type: actionType as "GRANT ACCESS" | "REVOKE ACCESS",
      new_value: actionValue as "EDITOR" | "VIEWER" | undefined,
      actionee: webId,
      resource_url: decodeURIComponent(solidDatasetWithAcl.internal_resourceInfo.sourceIri),
    },
  });

  try {
    await saveAclFor(solidDatasetWithAcl, updatedAcl, { fetch });
  } catch (error) {
    console.log(error);
    throw new Error("error");
  }
}

//******************************************************
// this is sample of what podDataContents looks like when console logged in browser
//******************************************************
/*
{
  "http://localhost:3000/test1pod1/": {
    "type": "Subject",
    "url": "http://localhost:3000/test1pod1/",
    "predicates": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "namedNodes": [
          "http://www.w3.org/ns/pim/space#Storage",
          "http://www.w3.org/ns/ldp#Container",
          "http://www.w3.org/ns/ldp#BasicContainer",
          "http://www.w3.org/ns/ldp#Resource"
        ]
      },
      "http://purl.org/dc/terms/modified": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#dateTime": ["2023-11-07T08:47:51.000Z"]
        }
      },
      "http://www.w3.org/ns/posix/stat#mtime": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#integer": ["1699346871"]
        }
      },
      "http://www.w3.org/ns/ldp#contains": {
        "namedNodes": ["http://localhost:3000/test1pod1/README", "http://localhost:3000/test1pod1/profile/"]
      }
    }
  },
  "http://localhost:3000/test1pod1/README": {
    "type": "Subject",
    "url": "http://localhost:3000/test1pod1/README",
    "predicates": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "namedNodes": ["http://www.w3.org/ns/ldp#Resource", "http://www.w3.org/ns/iana/media-types/text/markdown#Resource"]
      },
      "http://purl.org/dc/terms/modified": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#dateTime": ["2023-10-27T02:52:09.000Z"]
        }
      },
      "http://www.w3.org/ns/posix/stat#mtime": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#integer": ["1698375129"]
        }
      },
      "http://www.w3.org/ns/posix/stat#size": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#integer": ["960"]
        }
      }
    }
  },
  "http://localhost:3000/test1pod1/profile/": {
    "type": "Subject",
    "url": "http://localhost:3000/test1pod1/profile/",
    "predicates": {
      "http://www.w3.org/1999/02/22-rdf-syntax-ns#type": {
        "namedNodes": ["http://www.w3.org/ns/ldp#Container", "http://www.w3.org/ns/ldp#BasicContainer", "http://www.w3.org/ns/ldp#Resource"]
      },
      "http://purl.org/dc/terms/modified": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#dateTime": ["2023-10-27T02:52:09.000Z"]
        }
      },
      "http://www.w3.org/ns/posix/stat#mtime": {
        "literals": {
          "http://www.w3.org/2001/XMLSchema#integer": ["1698375129"]
        }
      }
    }
  }
}
*/

//******************************************************
// converted to json-ld format, podDataContents looks like this. so the 'predicates' key above is not part of standard json-ld format.
// but the concept is the same. ea url key in this case represents a Thing
//******************************************************
/* 
{
  "@context": {
    "rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
    "dc": "http://purl.org/dc/terms/",
    "ldp": "http://www.w3.org/ns/ldp#",
    "iana": "http://www.w3.org/ns/iana/media-types/",
    "posix": "http://www.w3.org/ns/posix/stat#",
    "xsd": "http://www.w3.org/2001/XMLSchema#"
  },
  "http://localhost:3000/test1pod1/": {
    "@type": ["ldp:Container", "ldp:BasicContainer", "ldp:Resource"],
    "dc:modified": {
      "@type": "xsd:dateTime",
      "@value": "2023-11-07T08:47:51.000Z"
    },
    "posix:mtime": {
      "@type": "xsd:integer",
      "@value": "1699346871"
    },
    "ldp:contains": [
      "http://localhost:3000/test1pod1/README",
      "http://localhost:3000/test1pod1/profile/"
    ]
  },
  "http://localhost:3000/test1pod1/README": {
    "@type": ["ldp:Resource", "iana:text/markdown#Resource"],
    "dc:modified": {
      "@type": "xsd:dateTime",
      "@value": "2023-10-27T02:52:09.000Z"
    },
    "posix:mtime": {
      "@type": "xsd:integer",
      "@value": "1698375129"
    },
    "posix:size": {
      "@type": "xsd:integer",
      "@value": "960"
    }
  },
  "http://localhost:3000/test1pod1/profile/": {
    "@type": ["ldp:BasicContainer", "ldp:Container", "ldp:Resource"],
    "dc:modified": {
      "@type": "xsd:dateTime",
      "@value": "2023-10-27T02:52:09.000Z"
    },
    "posix:mtime": {
      "@type": "xsd:integer",
      "@value": "1698375129"
    }
  }
}

*/
