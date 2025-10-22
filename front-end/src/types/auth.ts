import type { RoleType } from "./res-type";

// Define the types for the user and the AuthContext
export type UserType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  picture: string;
};

export type UserRoleType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  role: RoleType;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserRoleType | null;
  signIn: (userInfo: UserRoleType) => void;
  signOut: () => void;
  loading: boolean;
};
