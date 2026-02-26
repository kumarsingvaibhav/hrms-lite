import { DEPT_COLORS } from "../../utils/helpers";

export default function DeptChip({ dept }) {
  const color = DEPT_COLORS[dept] || "var(--accent)";
  return (
    <span style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 20,
      fontSize: 12,
      fontWeight: 500,
      background: color + "18",
      color,
    }}>
      {dept}
    </span>
  );
}
