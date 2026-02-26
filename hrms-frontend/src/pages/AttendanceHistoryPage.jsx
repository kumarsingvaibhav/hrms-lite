import { useCallback } from "react";
import EmployeeAvatar from "../components/employees/EmployeeAvatar";
import DeptChip from "../components/employees/DeptChip";
import AttendanceBadge from "../components/attendance/AttendanceBadge";
import ErrorBanner from "../components/common/ErrorBanner";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Icon from "../components/common/Icon";
import { attendanceApi } from "../api/attendance";
import { useAsync } from "../hooks/useAsync";
import { fmtDate } from "../utils/helpers";

export default function AttendanceHistoryPage({ employee, onBack }) {
  const fetchHistory = useCallback(
    () => attendanceApi.getByEmployee(employee.employee_id),
    [employee.employee_id]
  );
  const fetchSummary = useCallback(
    () => attendanceApi.getSummary(employee.employee_id),
    [employee.employee_id]
  );

  const { data: records, loading: hLoading, error: hError, refetch: refetchH } = useAsync(fetchHistory, [employee.employee_id]);
  const { data: summary, loading: sLoading, error: sError, refetch: refetchS } = useAsync(fetchSummary, [employee.employee_id]);

  return (
    <div style={{ padding: 28 }}>
      {/* Back link */}
      <div
        onClick={onBack}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 13, color: "var(--text-secondary)", cursor: "pointer",
          padding: "6px 10px", borderRadius: 6, marginBottom: 16,
          transition: "all .18s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--text-primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; }}
      >
        <Icon name="back" width={16} height={16} /> Back to Employees
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 20 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Employee card */}
          <div style={{
            background: "var(--surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)",
            padding: "20px 22px", display: "flex", alignItems: "center", gap: 14,
          }}>
            <EmployeeAvatar name={employee.full_name} size={52} />
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>{employee.full_name}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", fontFamily: "var(--font-mono)", marginTop: 2 }}>
                {employee.employee_id}
              </div>
              <div style={{ marginTop: 6 }}><DeptChip dept={employee.department} /></div>
            </div>
          </div>

          {/* Summary stat grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {sLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", padding: 16,
                }}>
                  <div className="skeleton" style={{ height: 10, width: "60%", marginBottom: 8 }} />
                  <div className="skeleton" style={{ height: 24, width: "40%" }} />
                </div>
              ))
            ) : sError ? (
              <div style={{ gridColumn: "1/-1" }}><ErrorBanner message={sError} onRetry={refetchS} /></div>
            ) : summary ? (
              [
                { label: "Present",         value: summary.present_days,         color: "var(--success)" },
                { label: "Absent",          value: summary.absent_days,          color: "var(--danger)"  },
                { label: "Total Days",      value: summary.total_days,           color: "var(--accent)"  },
                { label: "Attendance Rate", value: `${summary.attendance_rate}%`, color: "#D97706"       },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: "var(--radius)", padding: 16,
                  boxShadow: "var(--shadow-sm)",
                }}>
                  <div style={{ fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: s.color, letterSpacing: "-0.5px" }}>{s.value}</div>
                </div>
              ))
            ) : null}
          </div>
        </div>

        {/* Right column — history table */}
        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden",
        }}>
          <div style={{
            padding: "18px 22px", borderBottom: "1px solid var(--border-light)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Attendance Log</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>
                {hLoading ? "Loading…" : `${records?.length ?? 0} record${records?.length !== 1 ? "s" : ""}`}
              </div>
            </div>
          </div>

          {hError ? (
            <ErrorBanner message={hError} onRetry={refetchH} />
          ) : hLoading ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              <Spinner size={26} />
            </div>
          ) : !records?.length ? (
            <EmptyState
              icon="calendar"
              title="No records yet"
              text="No attendance has been marked for this employee."
            />
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Date", "Status"].map((h) => (
                    <th key={h} style={thStyle}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => (
                  <tr
                    key={idx}
                    style={{ borderBottom: idx < records.length - 1 ? "1px solid var(--border-light)" : "none" }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = ""}
                  >
                    <td style={{ ...tdStyle, fontFamily: "var(--font-mono)", fontSize: 13 }}>{fmtDate(r.date)}</td>
                    <td style={tdStyle}><AttendanceBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
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
