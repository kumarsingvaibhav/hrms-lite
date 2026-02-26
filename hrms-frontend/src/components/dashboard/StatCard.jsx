import Icon from "../common/Icon";

export default function StatCard({ label, value, sub, iconName, iconColor, iconBg, loading }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: 20,
      boxShadow: "var(--shadow-sm)",
      transition: "var(--transition)",
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.transform = "";
      }}
    >
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="skeleton" style={{ width: "60%", height: 12 }} />
          <div className="skeleton" style={{ width: "40%", height: 28, marginTop: 4 }} />
          <div className="skeleton" style={{ width: "50%", height: 10 }} />
        </div>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12.5, color: "var(--text-secondary)", fontWeight: 500 }}>{label}</span>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={iconName} width={18} height={18} style={{ color: iconColor }} />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-1px", lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 11.5, color: "var(--text-muted)", marginTop: 4 }}>{sub}</div>
        </>
      )}
    </div>
  );
}
