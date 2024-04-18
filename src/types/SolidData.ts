export type DocumentInfo = {
  url: string;
  lastModified?: string;
  fileSize?: string;
  webIdUrl?: string;
  name?: string | null;
  access?: string;
  sharerBaseUrl?: string;
  sharerWebId?: string;
};

export type DocumentObject = Record<string, DocumentInfo> | undefined;

type Literal = Readonly<Record<string, readonly string[]>> | undefined;

type Predicate = {
  namedNodes?: readonly string[];
  literals?: Literal;
};

type Predicates = Readonly<Record<string, Predicate>>;

export type RDFObject = {
  predicates?: Predicates;
};
