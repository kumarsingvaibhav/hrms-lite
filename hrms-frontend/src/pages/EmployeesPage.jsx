import { useState, useCallback } from "react";
import EmployeeAvatar from "../components/employees/EmployeeAvatar";
import DeptChip from "../components/employees/DeptChip";
import AddEmployeeModal from "../components/employees/AddEmployeeModal";
import ConfirmDialog from "../components/common/ConfirmDialog";
import SkeletonRows from "../components/common/SkeletonRows";
import EmptyState from "../components/common/EmptyState";
import ErrorBanner from "../components/common/ErrorBanner";
import Icon from "../components/common/Icon";
import { employeeApi } from "../api/employees";
import { useAsync } from "../hooks/useAsync";
import { fmtDate } from "../utils/helpers";

export default function EmployeesPage({ onNavigate, toast }) {
  const { data: employees, loading, error, refetch } = useAsync(employeeApi.getAll);
  const [showAdd,     setShowAdd]     = useState(false);
  const [toDelete,    setToDelete]    = useState(null);   // employee object
  const [deleting,    setDeleting]    = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await employeeApi.remove(toDelete.employee_id);
      toast(`${toDelete.full_name} removed successfully.`, "success");
      setToDelete(null);
      refetch();
    } catch (err) {
      toast(err.message || "Failed to delete employee.", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden",
      }}>
        {/* Section header */}
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>All Employees</div>
            <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
              {loading ? "Loading…" : `${employees?.length ?? 0} team member${employees?.length !== 1 ? "s" : ""}`}
            </div>
          </div>
          <button onClick={() => setShowAdd(true)} style={primaryBtn}>
            <Icon name="plus" width={15} height={15} /> Add Employee
          </button>
        </div>

        {error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Employee", "Email", "Department", "Joined", "Actions"].map((h) => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows n={6} />
              ) : !employees?.length ? (
                <tr><td colSpan={5}>
                  <EmptyState
                    icon="users"
                    title="No employees found"
                    text="Add your first employee to get started."
                    action={
                      <button onClick={() => setShowAdd(true)} style={primaryBtn}>
                        <Icon name="plus" width={15} height={15} /> Add Employee
                      </button>
                    }
                  />
                </td></tr>
              ) : (
                employees.map((emp) => (
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
                    <td style={{ ...tdStyle, color: "var(--text-secondary)", fontSize: 13 }}>{emp.email}</td>
                    <td style={tdStyle}><DeptChip dept={emp.department} /></td>
                    <td style={{ ...tdStyle, color: "var(--text-muted)", fontFamily: "var(--font-mono)", fontSize: 12.5 }}>{fmtDate(emp.created_at)}</td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => onNavigate("attendance-history", emp)}
                          style={ghostBtn}
                        >
                          <Icon name="eye" width={14} height={14} /> History
                        </button>
                        <button
                          onClick={() => setToDelete(emp)}
                          style={dangerGhostBtn}
                        >
                          <Icon name="trash" width={14} height={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showAdd && (
        <AddEmployeeModal
          onClose={() => setShowAdd(false)}
          onSuccess={() => {
            setShowAdd(false);
            refetch();
            toast("Employee added successfully! 🎉", "success");
          }}
          toast={toast}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Delete Employee"
          text={`Remove ${toDelete.full_name} and all their attendance records? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
          loading={deleting}
        />
      )}
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
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "7px 13px", borderRadius: 6, fontSize: 13, fontWeight: 600,
  cursor: "pointer", border: "none", fontFamily: "var(--font)", transition: "all .18s ease",
};
const primaryBtn    = { ...base, background: "var(--accent)", color: "white" };
const ghostBtn      = { ...base, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)", padding: "5px 11px", fontSize: 12.5 };
const dangerGhostBtn= { ...base, background: "transparent", color: "var(--danger)",         border: "1px solid var(--border)", padding: "5px 11px" };
