import Icon from "./Icon";

const styles = {
  container: {
    position: "fixed", bottom: 24, right: 24, zIndex: 400,
    display: "flex", flexDirection: "column", gap: 8,
  },
  toast: {
    padding: "12px 18px",
    borderRadius: 10,
    fontSize: 13.5,
    fontWeight: 500,
    boxShadow: "0 12px 24px -4px rgba(16,24,40,.12)",
    display: "flex",
    alignItems: "center",
    gap: 10,
    maxWidth: 320,
    background: "var(--surface)",
    animation: "toastIn .25s ease",
    borderLeft: "4px solid",
    fontFamily: "var(--font)",
  },
};

export default function ToastContainer({ toasts }) {
  return (
    <div style={styles.container}>
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            ...styles.toast,
            borderColor: t.type === "success" ? "var(--success)" : "var(--danger)",
          }}
        >
          <Icon
            name={t.type === "success" ? "check" : "alert"}
            style={{ color: t.type === "success" ? "var(--success)" : "var(--danger)", flexShrink: 0 }}
          />
          {t.msg}
        </div>
      ))}
    </div>
  );
}
