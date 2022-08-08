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
