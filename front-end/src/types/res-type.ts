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
  radius: number;
};

export type CompanyType = {
  _id: string;
  name: string;
  code: string;
  type: string;
  cin: string;
  branches: number;
};

export type ShiftType = {
  _id: string;
  createdFor: string;
  startTime: string;
  endTime: string;
  weekOffs: string[];
  type: string;
  lateBy: number;
  halfDayLateBy: number;
};

export type EmployeeAttendanceType = {
  _id: string;
  status: string;
  date: string;
  month: string;
  punchingInfo: PunchingInfoType[];
  role: {
    _id: string;
    user: UserType;
  };
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

export type SubscriptionType = {
  _id: string;
  type: string;
  pro: boolean;
  company: CompanyType;
  createdBy: UserType;
  proExpire: Date;
  upcoming: [string];
};

export type PaymentType = {
  _id: string;
  initiatedBy: string;
  createdAt: Date;
  paymentFor: string;
  amount: number;
  order: string;
  plan: string;
  status: string;
};
