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
import CreateBranch from "./components/private/companies/branches/create-branch";
import CreateStaff from "./components/private/companies/staff/create-staff";
import Attendance from "./components/private/attendance/attendance";
import Search from "./components/private/search/search";
import Dashboard from "./components/private/dashboard/dashboard";
import Staff from "./components/private/companies/staff/staff";
import Profile from "./components/private/profile/profile";
import {
  EmployeeCalendar,
  AdminCalendar,
} from "./components/private/calendar/calendar";
import Companies from "./components/private/companies/companies";
import Branches from "./components/private/companies/branches/branches";
import Shift from "./components/private/companies/staff/shift";
import Settings from "./components/private/settings/settings";
import Subscription from "./components/private/subscription/subscription";
import PayStatus from "./components/private/subscription/status";

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
        {!isAuthenticated && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}
        {isAuthenticated && (
          <Route path="/" element={<Header />}>
            {/* <Route path="/" element={<Dashboard />} /> */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/branches" element={<Branches />} />
            <Route path="/companies/create" element={<CreateCompany />} />
            <Route path="/branches/create" element={<CreateBranch />} />
            <Route path="/staff" element={<Staff />} />
            <Route path="/staff/create" element={<CreateStaff />} />
            <Route path="/staff/calendar" element={<AdminCalendar />} />
            <Route path="/staff/shift" element={<Shift />} />
            <Route path="/calendar" element={<EmployeeCalendar />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/subscription" element={<Subscription />} />
            <Route path="/status" element={<PayStatus />} />
            <Route path="/search" element={<Search />} />
            <Route path="/settings" element={<Settings />} />
            <>
              {/* <Route path="/settings" element={<Settings />} />
              <Route path="/select" element={<SelectCompany />} />
              <Route path="/branch" element={<CreateBranch />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leavereq" element={<Leaves />} />
              <Route path="/leaveapr" element={<ApprovePage />} />
              <Route path="/holidaylist" element={<HolidayList />} />
              <Route
                path="/attendancedetails"
                element={<AttendanceDetails />}
              />
              <Route path="/worktimings" element={<WorkTime />} />
              <Route path="/attendancemode" element={<AttendanceModes />} />
              <Route path="/automationrules" element={<AutomationRules />} />
              <Route path="/attendancepage" element={<CalendarPage />} />
              <Route path="/editattendance" element={<EditAttendance />} />
              <Route path="/create" element={<CreateCompany />} />
              <Route path="/showdetails" element={<ShowCompany />} />
              <Route path="/staff" element={<CreateStaff />} />
              <Route path="/selectcompany" element={<SelectCompany />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profilepage" element={<ProfilePage />} />
              <Route path="/personaldetails" element={<PersonalDetails />} />
              <Route path="/currentemp" element={<CurrentEmp />} />
              <Route path="/bankdetails" element={<BankDetails />} />
              <Route path="/leavesform" element={<LeavesPage />} />
              <Route path="/leavedetails" element={<LeaveDetails />} />
              <Route path="/notespage" element={<NotesPage />} />
              <Route path="/message" element={<MessagesSystem />} />
              <Route path="/button" element={<ExportUsersCSVButton />} /> */}
            </>
          </Route>
        )}
        <Route path="/*" element={<NoPage />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
