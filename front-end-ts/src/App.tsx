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
        {!isAuthenticated && (
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyPage />} />
            <Route path="/reset" element={<ResetPage />} />
          </>
        )}
        {isAuthenticated && (
          <Route path="/" element={<Header />}>
            <Route path="/company" element={<CreateCompany />} />
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
