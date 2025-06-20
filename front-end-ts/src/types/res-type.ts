import type { UserType } from "./auth";

export type RoleType = {
  _id: string;
  user: string;
  name: string;
  company: string;
  role: string;
  branch?: string;
};

export type RoleUserType = {
  _id: string;
  user: UserType;
  name: string;
  company: string;
  role: string;
  branch?: string;
};

export type BranchType = {
  _id: string;
  name: string;
  address: string;
};

export type CompanyType = {
  _id: string;
  name: string;
  address: string;
};
