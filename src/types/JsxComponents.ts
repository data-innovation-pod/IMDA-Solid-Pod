import { type HTMLProps, type Dispatch, type SetStateAction, type RefObject, ReactNode } from "react";
import { type DocumentObject } from "./SolidData";
import { type DetailColumnHandle } from "~/app/_components/your-data/detail-column";
import { type DeleteConfirmationModalHandle } from "~/app/_components/common/delete-confirmation-modal";

export type PodVariant = "pod" | "contacts" | "shared";

export type HeaderProps = HTMLProps<HTMLDivElement> & {
  variant?: "empty";
};

export type SidebarProps = HTMLProps<HTMLDivElement> & {
  variant?: "empty";
};

export type UnderlinedSectionProps = HTMLProps<HTMLDivElement> & {
  title?: string;
  paraText?: string;
  numberedText?: string[];
  nestedText?: string[];
  children?: ReactNode;
  variant?: "bullet";
};

export type BulletedListProps = HTMLProps<HTMLDivElement> & {
  numberedText: string[];
  nestedText?: string[];
  variant?: "dash";
};

export type NestedListProps = HTMLProps<HTMLDivElement> & {
  bulletList: { mainItem: string; nested?: string[] }[];
};

export type ParagraphsProps = HTMLProps<HTMLDivElement> & {
  paraText: string[];
};

export type SectionHeaderProps = HTMLProps<HTMLDivElement> & {
  title: string;
  children?: ReactNode;
};

export type ComandBarProps = HTMLProps<HTMLDivElement> & {
  structure?: DocumentObject;
  setStructure: Dispatch<SetStateAction<DocumentObject>>;
  variant?: PodVariant;
};

export type DisplayPodContentsProps = HTMLProps<HTMLDivElement> & {
  structure: DocumentObject;
  setStructure: Dispatch<SetStateAction<DocumentObject>>;
} & (WithDetailCol | WithoutDetailCol);

export type WithDetailCol = {
  variant: "pod";
  detailColumnRef: RefObject<DetailColumnHandle>;
};

export type WithoutDetailCol = {
  variant: "contacts" | "shared";
};

// Start of display pod header type definitions
export type DisplayPodHeaderProps = HTMLProps<HTMLDivElement> & {
  structure?: DocumentObject;
  setStructure?: Dispatch<SetStateAction<DocumentObject>>;
  webId?: string;
} & (DisplayPodNormalHeaderProps | DisplayPodSharedHeaderProps | DisplayPodContactsHeaderProps);

export type DisplayPodNormalHeaderProps = HTMLProps<HTMLDivElement> & {
  variant: "pod";
  createUpdateSort: (newColName: NormalPodColName) => () => void;
  currentSort: NormalPodSort;
};

export type DisplayPodSharedHeaderProps = HTMLProps<HTMLDivElement> & {
  variant: "shared";
  createUpdateSort: (newColName: SharedPodColName) => () => void;
  currentSort: SharedPodSort;
};

export type DisplayPodContactsHeaderProps = HTMLProps<HTMLDivElement> & {
  variant: "contacts";
  createUpdateSort: (newColName: ContactsPodColName) => () => void;
  currentSort: ContactsPodSort;
};
// End of display pod header type definitions

// Start of display pod body type definitions
export type PodDataItemProps = HTMLProps<HTMLDivElement> &
  (
    | Omit<NormalPodDataItemProps, "webId" | "deleteConfirmationModalRef">
    | Omit<ContactsPodDataItemProps, "webId" | "deleteConfirmationModalRef">
    | Omit<SharedPodDataItemProps, "webId" | "deleteConfirmationModalRef">
  );

export type NormalPodDataItemProps = {
  variant: "pod";
  structure?: DocumentObject;
  setStructure?: Dispatch<SetStateAction<DocumentObject>>;
  deleteConfirmationModalRef: RefObject<DeleteConfirmationModalHandle>;
  detailColumnRef: RefObject<DetailColumnHandle>;
  currentSort: NormalPodSort;
  webId?: string;
};

export type ContactsPodDataItemProps = {
  variant: "contacts";
  deleteConfirmationModalRef: RefObject<DeleteConfirmationModalHandle>;
  structure?: DocumentObject;
  setStructure?: Dispatch<SetStateAction<DocumentObject>>;
  currentSort: ContactsPodSort;
  webId?: string;
};

export type SharedPodDataItemProps = {
  variant: "shared";
  deleteConfirmationModalRef: RefObject<DeleteConfirmationModalHandle>;
  structure?: DocumentObject;
  setStructure?: Dispatch<SetStateAction<DocumentObject>>;
  currentSort: NormalPodSort;
  webId?: string;
};
// End of display pod body type definitions

export interface NestedDynamicPageProps {
  readonly params: { readonly pathSegment?: readonly string[] };
}

export interface CustomSVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export type NormalPodSort = {
  colName: NormalPodColName;
  order: "asc" | "desc";
};

export type SharedPodSort = {
  colName: SharedPodColName;
  order: "asc" | "desc";
};

export type ContactsPodSort = {
  colName: ContactsPodColName;
  order: "asc" | "desc";
};

export type NormalPodColName = "name" | "lastModified" | "fileSize";

export type SharedPodColName = "name";

export type ContactsPodColName = "name" | "webIdUrl";
