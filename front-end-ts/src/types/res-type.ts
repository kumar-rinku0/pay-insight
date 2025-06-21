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

export type EmployeeAttendanceType = {
  _id: string;
  status: string;
  date: string;
  month: string;
  punchingInfo: PunchingInfoType[];
  user: UserType;
};

export type PunchingInfoType = {
  punchInInfo: PunchInInfoType;
  punchOutInfo: PunchOutInfoType;
};

export type PunchInInfoType = {
  status: string;
  punchInGeometry: {
    type: string;
    coordinates: [number];
  };
  punchInAddress: string;
  punchInImg: string;
  createdAt: Date;
};

export type PunchOutInfoType = {
  status: string;
  punchOutGeometry: {
    type: string;
    coordinates: [number];
  };
  punchOutAddress: string;
  punchOutImg: string;
  createdAt: Date;
};
