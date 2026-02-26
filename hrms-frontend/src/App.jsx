import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import ToastContainer from "./components/common/Toast";
import DashboardPage from "./pages/DashboardPage";
import EmployeesPage from "./pages/EmployeesPage";
import AttendancePage from "./pages/AttendancePage";
import AttendanceHistoryPage from "./pages/AttendanceHistoryPage";
import { useToast } from "./hooks/useToast";

const PAGE_META = {
  dashboard:           { title: "Dashboard",          subtitle: "Welcome back, Admin 👋" },
  employees:           { title: "Employee Management", subtitle: "Add, view, and manage your team" },
  attendance:          { title: "Attendance Tracker",  subtitle: "Mark and monitor daily attendance" },
  "attendance-history":{ title: "Attendance History",  subtitle: null /* filled dynamically */ },
};

export default function App() {
  const [page,        setPage]        = useState("dashboard");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const { toasts, toast } = useToast();

  function navigate(dest, emp = null) {
    setPage(dest);
    setSelectedEmp(emp);
    window.scrollTo(0, 0);
  }

  const meta = PAGE_META[page] ?? { title: "", subtitle: "" };
  const subtitle = page === "attendance-history" && selectedEmp
    ? selectedEmp.full_name
    : meta.subtitle;

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar active={page === "attendance-history" ? "employees" : page} onNavigate={navigate} />

      <main style={{ marginLeft: "var(--sidebar-w)", flex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header title={meta.title} subtitle={subtitle} />

        {page === "dashboard" && (
          <DashboardPage onNavigate={navigate} />
        )}
        {page === "employees" && (
          <EmployeesPage onNavigate={navigate} toast={toast} />
        )}
        {page === "attendance" && (
          <AttendancePage toast={toast} />
        )}
        {page === "attendance-history" && selectedEmp && (
          <AttendanceHistoryPage
            employee={selectedEmp}
            onBack={() => navigate("employees")}
          />
        )}
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
}
