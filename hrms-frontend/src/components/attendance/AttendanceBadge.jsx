export default function AttendanceBadge({ status }) {
  const isPresent = status === "Present";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 9px", borderRadius: 20, fontSize: 12, fontWeight: 600,
      background: isPresent ? "var(--success-light)" : "var(--danger-light)",
      color:      isPresent ? "#027A48"              : "#B42318",
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
        background: isPresent ? "var(--success)" : "var(--danger)",
      }} />
      {status}
    </span>
  );
}
