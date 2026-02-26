import { useCallback } from "react";
import StatCard from "../components/dashboard/StatCard";
import EmployeeAvatar from "../components/employees/EmployeeAvatar";
import DeptChip from "../components/employees/DeptChip";
import ErrorBanner from "../components/common/ErrorBanner";
import EmptyState from "../components/common/EmptyState";
import SkeletonRows from "../components/common/SkeletonRows";
import Icon from "../components/common/Icon";
import { dashboardApi } from "../api/dashboard";
import { employeeApi } from "../api/employees";
import { useAsync } from "../hooks/useAsync";
import { fmtDate } from "../utils/helpers";

const STAT_CONFIG = (d) => [
  { label: "Total Employees", value: d?.total_employees ?? 0, sub: "Active in system",    iconName: "users",      iconColor: "#2563EB", iconBg: "#EFF4FF" },
  { label: "Present Today",   value: d?.today?.present ?? 0,  sub: "Clocked in today",   iconName: "check",      iconColor: "#12B76A", iconBg: "#ECFDF3" },
  { label: "Absent Today",    value: d?.today?.absent ?? 0,   sub: "Not present",         iconName: "alert",      iconColor: "#F04438", iconBg: "#FEF3F2" },
  { label: "Not Marked",      value: d?.today?.not_marked ?? 0, sub: "Pending attendance",iconName: "calendar",   iconColor: "#F79009", iconBg: "#FFFAEB" },
];

export default function DashboardPage({ onNavigate }) {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useAsync(dashboardApi.getStats);
  const { data: employees, loading: empLoading, error: empError, refetch: refetchEmp }   = useAsync(employeeApi.getAll);

  const loading = statsLoading || empLoading;

  return (
    <div style={{ padding: 28 }}>
      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 28 }}>
        {STAT_CONFIG(stats).map((s, i) => (
          <StatCard key={i} {...s} loading={statsLoading} />
        ))}
      </div>

      {statsError && <ErrorBanner message={statsError} onRetry={refetchStats} />}

      {/* Recent employees table */}
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden",
      }}>
        <div style={{
          padding: "18px 22px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>Recent Employees</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
              Latest additions to the team
            </div>
          </div>
          <button
            onClick={() => onNavigate("employees")}
            style={primaryBtn}
          >
            <Icon name="employees" width={15} height={15} /> Manage All
          </button>
        </div>

        {empError ? (
          <ErrorBanner message={empError} onRetry={refetchEmp} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Employee", "Department", "Joined", ""].map((h, i) => (
                  <th key={i} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {empLoading ? (
                <SkeletonRows n={4} />
              ) : !employees?.length ? (
                <tr><td colSpan={4}>
                  <EmptyState
                    icon="users"
                    title="No employees yet"
                    text="Start by adding your first employee."
                  />
                </td></tr>
              ) : (
                employees.slice(0, 5).map((emp) => (
                  <tr
                    key={emp.employee_id}
                    style={{ borderBottom: "1px solid var(--border-light)" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}
                  >
                    <td style={tdStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <EmployeeAvatar name={emp.full_name} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13.5 }}>{emp.full_name}</div>
                          <div style={{ fontSize: 11.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{emp.employee_id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}><DeptChip dept={emp.department} /></td>
                    <td style={{ ...tdStyle, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{fmtDate(emp.created_at)}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => onNavigate("attendance-history", emp)}
                        style={ghostBtn}
                      >
                        <Icon name="eye" width={14} height={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const thStyle = {
  padding: "10px 16px", textAlign: "left",
  fontSize: 11.5, fontWeight: 600, color: "var(--text-muted)",
  textTransform: "uppercase", letterSpacing: "0.6px",
  background: "var(--surface-2)", borderBottom: "1px solid var(--border)",
};
const tdStyle = { padding: "12px 16px", verticalAlign: "middle" };

const base = {
  display: "inline-flex", alignItems: "center", gap: 7,
  padding: "7px 13px", borderRadius: 6, fontSize: 13, fontWeight: 600,
  cursor: "pointer", border: "none", fontFamily: "var(--font)", transition: "all .18s ease",
};
const primaryBtn = { ...base, background: "var(--accent)", color: "white", fontSize: 13 };
const ghostBtn   = { ...base, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", padding: "5px 11px", fontSize: 12.5 };
