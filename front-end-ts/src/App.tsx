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
import CreateCompany from "./components/private/create/create-company";
import VerifyPage from "./components/auth/verify-user";
import ResetPage from "./components/auth/reset-password";
import CreateBranch from "./components/private/create/create-branch";
import CreateStaff from "./components/private/create/create-staff";
import Attendance from "./components/private/attendance/attendance";
import Search from "./components/private/search/search";
import Dashboard from "./components/private/dashboard/dashboard";
import Users from "./components/private/users/users";
import Profile from "./components/private/profile/profile";
import {
  EmployeeCalendar,
  AdminCalendar,
} from "./components/private/calendar/calendar";
import UpdateAttendance from "./components/private/update/update-attendance";

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
            <Route path="/" element={<Dashboard />} />
            <Route path="/company" element={<CreateCompany />} />
            <Route path="/branch" element={<CreateBranch />} />
            <Route path="/staff" element={<CreateStaff />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/calendar" element={<EmployeeCalendar />} />
            <Route path="/users/calendar" element={<AdminCalendar />} />
            <Route path="/users/calendar/:day" element={<UpdateAttendance />} />
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/search" element={<Search />} />
            <Route path="/users" element={<Users />} />
            <Route path="/profile" element={<Profile />} />
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
