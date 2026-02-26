import { avatarColor, initials } from "../../utils/helpers";

export default function EmployeeAvatar({ name, size = 32 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: avatarColor(name),
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.38, fontWeight: 700, color: "white",
      flexShrink: 0, userSelect: "none",
    }}>
      {initials(name)}
    </div>
  );
}
