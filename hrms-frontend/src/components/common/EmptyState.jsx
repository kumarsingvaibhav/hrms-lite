import Icon from "./Icon";

export default function EmptyState({ icon = "users", title, text, action }) {
  return (
    <div style={{
      padding: "56px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 10,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: "var(--surface-2)",
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 4,
      }}>
        <Icon name={icon} width={26} height={26} style={{ color: "var(--text-muted)" }} />
      </div>
      <div style={{ fontSize: 15, fontWeight: 700 }}>{title}</div>
      {text && (
        <div style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 260 }}>{text}</div>
      )}
      {action && <div style={{ marginTop: 6 }}>{action}</div>}
    </div>
  );
}
