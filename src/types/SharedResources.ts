import { type Audit } from "./AuditTrail";

export interface UserSharedResources {
  user: string;
  resources: Audit[];
}

export interface SharedResourceStructure {
  url: string;
  sharerBaseUrl: string;
  sharerWebId: string;
}
