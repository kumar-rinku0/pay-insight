import type { CompanyRoleType } from "./company";

// Define the types for the user and the AuthContext
export type UserType = {
  _id: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  role?: CompanyRoleType;
  roles?: CompanyRoleType[];
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: UserType | null;
  signIn: (userInfo: UserType) => void;
  signOut: () => void;
  loading: boolean;
};
