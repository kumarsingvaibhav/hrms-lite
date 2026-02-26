import Icon from "./Icon";

export default function ErrorBanner({ message, onRetry }) {
  return (
    <div style={{
      margin: "20px 22px",
      padding: "14px 18px",
      background: "var(--danger-light)",
      border: "1px solid #FECDCA",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}>
      <Icon name="alert" style={{ color: "var(--danger)", flexShrink: 0 }} />
      <div style={{ flex: 1, fontSize: 13.5, color: "#B42318" }}>{message}</div>
      {onRetry && (
        <button
          onClick={onRetry}
          style={{
            padding: "5px 12px", borderRadius: 6, border: "1px solid #FECDCA",
            background: "transparent", color: "#B42318", fontSize: 12.5,
            fontWeight: 600, cursor: "pointer", fontFamily: "var(--font)",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          <Icon name="refresh" width={14} height={14} /> Retry
        </button>
      )}
    </div>
  );
}
