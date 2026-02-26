import Icon from "../common/Icon";

const NAV = [
  { id: "dashboard", label: "Dashboard",       icon: "dashboard"  },
  { id: "employees", label: "Employees",        icon: "employees"  },
  { id: "attendance",label: "Mark Attendance",  icon: "attendance" },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside style={{
      width: "var(--sidebar-w)",
      background: "var(--surface)",
      borderRight: "1px solid var(--border)",
      position: "fixed", top: 0, left: 0,
      height: "100vh",
      display: "flex", flexDirection: "column",
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        padding: "20px 20px 16px",
        borderBottom: "1px solid var(--border-light)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <Icon name="employees" width={18} height={18} style={{ color: "white" }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>HRMS Lite</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>Admin Portal</div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        <div style={{
          fontSize: 10.5, fontWeight: 600, color: "var(--text-muted)",
          letterSpacing: "0.8px", textTransform: "uppercase",
          padding: "8px 10px 4px",
        }}>
          Main Menu
        </div>

        {NAV.map((item) => {
          const isActive = active === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "9px 10px", borderRadius: 6,
                cursor: "pointer",
                fontSize: 14, fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--accent)" : "var(--text-secondary)",
                background: isActive ? "var(--accent-light)" : "transparent",
                marginBottom: 2,
                transition: "var(--transition)",
                userSelect: "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "var(--surface-2)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon name={item.icon} width={18} height={18} />
              {item.label}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        padding: "14px 16px",
        borderTop: "1px solid var(--border-light)",
        display: "flex", alignItems: "center", gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg,#667eea,#764ba2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 600, color: "white", flexShrink: 0,
        }}>
          AD
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Admin</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>HR Administrator</div>
        </div>
      </div>
    </aside>
  );
}
