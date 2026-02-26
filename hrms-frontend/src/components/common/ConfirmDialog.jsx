import Icon from "./Icon";
import Spinner from "./Spinner";

export default function ConfirmDialog({ title, text, onConfirm, onCancel, loading }) {
  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(16,24,40,.4)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn .15s ease",
      }}
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div style={{
        background: "var(--surface)", borderRadius: 14, width: 380, maxWidth: "92vw",
        boxShadow: "var(--shadow-lg)", animation: "slideUp .2s ease",
      }}>
        {/* Body */}
        <div style={{ padding: "28px 28px 20px", textAlign: "center" }}>
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--danger-light)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px",
          }}>
            <Icon name="trash" width={22} height={22} style={{ color: "var(--danger)" }} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 13.5, color: "var(--text-secondary)", lineHeight: 1.5 }}>{text}</div>
        </div>
        {/* Footer */}
        <div style={{
          padding: "14px 24px", borderTop: "1px solid var(--border-light)",
          display: "flex", justifyContent: "flex-end", gap: 10,
        }}>
          <button
            onClick={onCancel}
            disabled={loading}
            style={ghostBtnStyle}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{ ...primaryBtnStyle, background: "var(--danger)", minWidth: 110 }}
          >
            {loading ? <Spinner size={16} color="white" /> : "Yes, delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

const base = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "8px 16px", borderRadius: 6, fontSize: 13.5, fontWeight: 600,
  cursor: "pointer", border: "none", fontFamily: "var(--font)", transition: "all .18s ease",
};
const primaryBtnStyle = { ...base, background: "var(--accent)", color: "white" };
const ghostBtnStyle   = { ...base, background: "transparent", color: "var(--text-secondary)", border: "1px solid var(--border)" };
