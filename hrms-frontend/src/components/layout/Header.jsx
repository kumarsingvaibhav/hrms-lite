import { fmtToday } from "../../utils/helpers";

export default function Header({ title, subtitle }) {
  return (
    <header style={{
      height: "var(--header-h)",
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div>
        <h1 style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.3px" }}>{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 1 }}>{subtitle}</p>
        )}
      </div>
      <div style={{
        fontSize: 12,
        color: "var(--text-secondary)",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 20,
        padding: "5px 12px",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
      }}>
        {fmtToday()}
      </div>
    </header>
  );
}
