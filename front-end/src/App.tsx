import "./App.css";

import { Route, Routes } from "react-router";
import { useAuth } from "./providers/use-auth";
import Header from "./components/navigation/side-nav";
import HomePage from "./components/root/home-page";
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import reactsvg from "@/assets/react.svg";
import { Toaster } from "./components/ui/sonner";
import NoPage from "./components/root/no-page";
import CreateCompany from "./components/private/companies/create-company";
import VerifyPage from "./components/auth/verify-user";
import ResetPage from "./components/auth/reset-password";
import CreateBranch from "./components/private/branches/create-branch";
import CreateStaff from "./components/private/staff/create-staff";
import Attendance from "./components/private/attendance/attendance";
import Search from "./components/private/search/search";
import Dashboard from "./components/private/dashboard/dashboard";
import Staff from "./components/private/staff/staff";
import Profile from "./components/private/profile/profile";
import {
  EmployeeCalendar,
  AdminCalendar,
} from "./components/private/calendar/calendar";
import Companies from "./components/private/companies/companies";
import Branches from "./components/private/branches/branches";
import Shift from "./components/private/staff/shift";
import Settings from "./components/private/settings/settings";
import Subscription from "./components/private/subscription/subscription";
import PayStatus from "./components/private/subscription/status";
import Terms from "./components/root/terms";
import Privacy from "./components/root/privacy";
import Policy from "./components/root/policy";
import Home from "./components/private/home/home";
import Session from "./components/private/profile/session";
import ImageUpload from "./components/root/upload";
import UpdateCompanyPage from "./components/private/companies/update-company";
import UpdateBranchPage from "./components/private/branches/update-branch";

function App() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="app w-full h-[90vh] flex justify-center items-center lead">
        <img src={reactsvg} className="w-20 h-20 animate-spin" alt="" />
      </div>
    );
  }
  return (
    <div>
      <Routes>
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="/reset" element={<ResetPage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/policy" element={<Policy />} />

        {!isAuthenticated && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        {isAuthenticated && (
          <Route path="/" element={<Header />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/companies/create" element={<CreateCompany />} />
            <Route path="/companies/update" element={<UpdateCompanyPage />} />
            <Route path="/branches/create" element={<CreateBranch />} />
            <Route path="/branches/update" element={<UpdateBranchPage />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/staff/create" element={<CreateStaff />} />
            <Route path="/staff/calendar" element={<AdminCalendar />} />
            <Route path="/staff/shift" element={<Shift />} />
            <Route path="/calendar" element={<EmployeeCalendar />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/account" element={<Profile />} />
            <Route path="/account/onetap" element={<Session />} />

            <Route path="/subscription" element={<Subscription />} />
            <Route path="/status" element={<PayStatus />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/upload" element={<ImageUpload />} />
          </Route>
        )}
        <Route path="/*" element={<NoPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
