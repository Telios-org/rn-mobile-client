export type AliasNamespace = {
  disabled?: boolean;
  domain: string;
  mailboxId: string;
  name: string;
  privateKey: string;
  publicKey: string;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
};
export type Alias = {
  aliasId: string;
  name: string;
  publicKey?: string;
  privateKey?: string;
  description?: string | undefined;
  namespaceKey: string | undefined;
  fwdAddresses?: string[];
  count: number;
  disabled?: boolean | undefined;
  whitelisted?: boolean | undefined;
  createdAt?: string;
  updatedAt?: string;
  _id: string;
};

export type Email = {
  emailId: any;
  cid: string;
  folderId: number;
  mailboxId: number;
  aliasId?: string | null;
  subject: string;
  unread: boolean;
  date: string;
  toJSON: string;
  fromJSON: string;
  ccJSON?: string;
  bccJSON?: string;
  bodyAsText?: string;
  bodyAsHtml?: string;
  attachments?: string;
  path?: string;
  count?: any;
  key: string;
  header: string;
  createdAt: string;
  updatedAt: string;
  _id: string;
};

export type Folder = {
  _id: string;
  folderId: number;
  mailboxId: number;
  name: string;
  type: string;
  count: number;
  icon?: string;
  color?: string;
  seq: number;
  createdAt: string;
  updatedAt: string;
};

export type Mailbox = {
  address: string;
  mailboxId: string;
  _id: string;
};

export type ToFrom = { address?: string; name?: string };

export type EmailContent = {
  _id?: string;
  attachments?: Array<any>;
  bcc?: Array<any>;
  cc?: Array<any>;
  date: string;
  to: Array<ToFrom>;
  from: Array<ToFrom>;
  subject?: string;
  bodyAsText?: string;
  bodyAsHTML?: string;
};

export type Stats = {
  _id?: string;
  aliasesUsed: number;
  dailyEmailResetDate: any;
  dailyEmailUsed: number;
  lastUpdated: string;
  maxAliasAddresses: number;
  maxAliasNames: number;
  maxGBBandwidth: number;
  maxGBCloudStorage: number;
  maxOutgoingEmails: number;
  namespaceUsed: number;
  plan: string;
  storageSpaceUsed: number;
};

export type Organization = { name: string };

export type Contact = {
  address?: string;
  author?: string;
  birthday?: string;
  contactId: string;
  email?: string;
  familyName?: string;
  givenName?: string;
  name?: string;
  nickname?: string;
  notes?: string;
  organization?: Array<Organization>;
  pgpPublicKey?: string;
  phone?: string;
  publicKey?: string;
  website?: string;
  _id?: string;
};
