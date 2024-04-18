export type FilterObject = Record<string, string>;

export interface SortingProps {
  column: string;
  order: "asc" | "desc";
  nulls: "first" | "last";
}

export interface Audit {
  id: number;
  action_type: string;
  actioner: string;
  actionee: string;
  resource_url: string;
  old_value: string;
  new_value: string;
  created_at: Date;
  updated_at: Date;
}

export enum ActionTypes {
  CREATE_FOLDER = "CREATE FOLDER",
  DELETE_FOLDER = "DELETE FOLDER",
  UPLOAD_RESOURCE = "UPLOAD RESOURCE",
  DOWNLOAD_RESOURCE = "DOWNLOAD RESOURCE",
  DELETE_RESOURCE = "DELETE RESOURCE",
  GRANT_ACCESS = "GRANT ACCESS",
  CHANGE_ACCESS = "CHANGE ACCESS",
  REVOKE_ACCESS = "REVOKE ACCESS",
  ADD_CONTACT = "ADD CONTACT",
  DELETE_CONTACT = "DELETE CONTACT",
}
