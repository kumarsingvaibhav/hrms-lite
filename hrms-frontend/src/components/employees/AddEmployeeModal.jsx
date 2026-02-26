import { useState } from "react";
import Icon from "../common/Icon";
import Spinner from "../common/Spinner";
import { employeeApi } from "../../api/employees";
import { DEPARTMENTS } from "../../utils/helpers";

const initialForm = { employee_id: "", full_name: "", email: "", department: "Engineering" };

export default function AddEmployeeModal({ onClose, onSuccess, toast }) {
  const [form,    setForm]    = useState(initialForm);
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function validate() {
    const e = {};
    if (!form.employee_id.trim()) e.employee_id = "Employee ID is required.";
    if (!form.full_name.trim())   e.full_name   = "Full name is required.";
    if (!form.email.trim())       e.email       = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.department)         e.department  = "Department is required.";
    return e;
  }

  async function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setLoading(true);
    try {
      await employeeApi.create({
        ...form,
        employee_id: form.employee_id.trim().toUpperCase(),
        full_name:   form.full_name.trim(),
        email:       form.email.trim().toLowerCase(),
      });
      onSuccess();
    } catch (err) {
      toast(err.message || "Failed to add employee.", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(16,24,40,.4)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn .15s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: "var(--surface)", borderRadius: 14,
        width: 480, maxWidth: "95vw", maxHeight: "92vh", overflowY: "auto",
        boxShadow: "var(--shadow-lg)", animation: "slideUp .2s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "22px 24px 18px",
          borderBottom: "1px solid var(--border-light)",
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Add New Employee</div>
            <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>
              Fill in the details to create a new employee record.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: 6, border: "none",
              background: "var(--surface-2)", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-secondary)",
            }}
          >
            <Icon name="close" width={14} height={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Row: ID + Department */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 16 }}>
            <Field label="Employee ID *" error={errors.employee_id}>
              <input
                placeholder="e.g. EMP005"
                value={form.employee_id}
                onChange={(e) => setField("employee_id", e.target.value.toUpperCase())}
                style={inputStyle(!!errors.employee_id)}
              />
            </Field>
            <Field label="Department *" error={errors.department}>
              <select
                value={form.department}
                onChange={(e) => setField("department", e.target.value)}
                style={inputStyle(!!errors.department)}
              >
                {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Full Name *" error={errors.full_name} style={{ marginBottom: 16 }}>
            <input
              placeholder="e.g. Aanya Sharma"
              value={form.full_name}
              onChange={(e) => setField("full_name", e.target.value)}
              style={inputStyle(!!errors.full_name)}
            />
          </Field>

          <Field label="Work Email *" error={errors.email}>
            <input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              style={inputStyle(!!errors.email)}
            />
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid var(--border-light)",
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <button onClick={onClose} disabled={loading} style={ghostBtn}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading} style={{ ...primaryBtn, minWidth: 130 }}>
            {loading
              ? <><Spinner size={15} color="white" /> Saving…</>
              : <><Icon name="plus" width={15} height={15} /> Add Employee</>
            }
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children, style }) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
        {label}
      </label>
      {children}
      {error && <div style={{ fontSize: 12, color: "var(--danger)", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function inputStyle(hasError) {
  return {
    width: "100%", padding: "9px 13px",
    border: `1px solid ${hasError ? "var(--danger)" : "var(--border)"}`,
    borderRadius: 6, fontSize: 13.5,
    fontFamily: "var(--font)", color: "var(--text-primary)",
    background: "var(--surface)", outline: "none",
    transition: "border .18s, box-shadow .18s",
  };
}

const base = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "8px 16px", borderRadius: 6, fontSize: 13.5, fontWeight: 600,
  cursor: "pointer", border: "none", fontFamily: "var(--font)",
  transition: "all .18s ease",
};
const primaryBtn = { ...base, background: "var(--accent)", color: "white" };
const ghostBtn   = { ...base, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" };
