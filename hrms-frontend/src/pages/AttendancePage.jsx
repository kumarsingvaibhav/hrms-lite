import { useState, useCallback } from "react";
import EmployeeAvatar from "../components/employees/EmployeeAvatar";
import ErrorBanner from "../components/common/ErrorBanner";
import EmptyState from "../components/common/EmptyState";
import Spinner from "../components/common/Spinner";
import Icon from "../components/common/Icon";
import { employeeApi } from "../api/employees";
import { attendanceApi } from "../api/attendance";
import { useAsync } from "../hooks/useAsync";
import { todayISO } from "../utils/helpers";

export default function AttendancePage({ toast }) {
  const { data: employees, loading, error, refetch } = useAsync(employeeApi.getAll);

  const [date,       setDate]       = useState(todayISO());
  const [selections, setSelections] = useState({}); // { [employee_id]: "Present"|"Absent"|undefined }
  const [saved,      setSaved]      = useState({}); // { [`${empId}_${date}`]: true }
  const [saving,     setSaving]     = useState(false);

  function toggle(empId, status) {
    setSelections((s) => ({
      ...s,
      [empId]: s[empId] === status ? undefined : status,
    }));
  }

  const hasAny = Object.values(selections).some(Boolean);

  async function saveAll() {
    const toSave = Object.entries(selections).filter(([, v]) => v);
    if (!toSave.length) return;

    setSaving(true);
    let ok = 0;
    const errs = [];

    for (const [empId, status] of toSave) {
      try {
        await attendanceApi.mark({ employee_id: empId, date, status });
        setSaved((s) => ({ ...s, [`${empId}_${date}`]: status }));
        ok++;
      } catch (e) {
        errs.push(`${empId}: ${e.message}`);
      }
    }

    if (ok)        toast(`${ok} attendance record${ok > 1 ? "s" : ""} saved successfully!`, "success");
    if (errs.length) toast(errs[0], "error");

    setSelections({});
    setSaving(false);
  }

  return (
    <div style={{ padding: 28 }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", overflow: "hidden",
      }}>
        {/* Coloured header */}
        <div style={{ background: "var(--accent)", padding: "20px 22px", color: "white" }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>Mark Attendance</div>
          <div style={{ fontSize: 12.5, opacity: 0.8, marginTop: 2 }}>
            Select each employee's status for the chosen date, then save all at once.
          </div>
        </div>

        {/* Date + Save bar */}
        <div style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <Icon name="calendar" width={16} height={16} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={(e) => { setDate(e.target.value); setSelections({}); }}
            style={{
              padding: "7px 11px", border: "1px solid var(--border)",
              borderRadius: 6, fontSize: 13.5,
              fontFamily: "var(--font)", outline: "none",
              width: "auto",
            }}
          />
          <div style={{ flex: 1 }} />
          <button
            onClick={saveAll}
            disabled={saving || !hasAny}
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "8px 18px", borderRadius: 6, fontSize: 13.5, fontWeight: 600,
              cursor: saving || !hasAny ? "not-allowed" : "pointer",
              background: "var(--accent)", color: "white", border: "none",
              fontFamily: "var(--font)", opacity: saving || !hasAny ? 0.6 : 1,
              transition: "all .18s ease",
            }}
          >
            {saving
              ? <><Spinner size={15} color="white" /> Saving…</>
              : <><Icon name="check" width={15} height={15} /> Save Attendance</>
            }
          </button>
        </div>

        {error ? (
          <ErrorBanner message={error} onRetry={refetch} />
        ) : loading ? (
          <div style={{ padding: 40, textAlign: "center" }}>
            <Spinner size={28} />
            <div style={{ color: "var(--text-muted)", marginTop: 10, fontSize: 13 }}>Loading employees…</div>
          </div>
        ) : !employees?.length ? (
          <EmptyState
            icon="attendance"
            title="No employees"
            text="Add employees first to mark attendance."
          />
        ) : (
          employees.map((emp, idx) => {
            const key      = `${emp.employee_id}_${date}`;
            const savedVal = saved[key];
            const sel      = selections[emp.employee_id];

            return (
              <div
                key={emp.employee_id}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 18px",
                  borderBottom: idx < employees.length - 1 ? "1px solid var(--border-light)" : "none",
                  background: savedVal ? "var(--success-light)" : "transparent",
                  transition: "background .2s ease",
                }}
              >
                <EmployeeAvatar name={emp.full_name} size={34} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{emp.full_name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>
                    {emp.employee_id} · {emp.department}
                  </div>
                </div>

                {savedVal ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--success)", fontSize: 13, fontWeight: 600 }}>
                    <Icon name="check" width={15} height={15} />
                    {savedVal}
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6 }}>
                    {["Present", "Absent"].map((status) => {
                      const isPresent = status === "Present";
                      const active    = sel === status;
                      const color     = isPresent ? "var(--success)" : "var(--danger)";
                      return (
                        <button
                          key={status}
                          disabled={saving}
                          onClick={() => toggle(emp.employee_id, status)}
                          style={{
                            padding: "5px 13px", borderRadius: 20,
                            border: `1.5px solid ${active ? color : "var(--border)"}`,
                            background: active ? color : "transparent",
                            color: active ? "white" : color,
                            fontSize: 12, fontWeight: 600,
                            cursor: saving ? "not-allowed" : "pointer",
                            fontFamily: "var(--font)",
                            transition: "all .15s ease",
                          }}
                        >
                          {status}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
