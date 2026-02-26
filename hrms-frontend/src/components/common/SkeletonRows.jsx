export default function SkeletonRows({ n = 5 }) {
  return Array.from({ length: n }).map((_, i) => (
    <tr key={i}>
      <td style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div className="skeleton" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div className="skeleton" style={{ width: 120 + (i * 13) % 60, height: 12 }} />
            <div className="skeleton" style={{ width: 70 + (i * 7) % 40, height: 10 }} />
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div className="skeleton" style={{ width: 80, height: 22, borderRadius: 20 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div className="skeleton" style={{ width: 90, height: 12 }} />
      </td>
      <td style={{ padding: "14px 16px" }}>
        <div className="skeleton" style={{ width: 72, height: 30, borderRadius: 6 }} />
      </td>
    </tr>
  ));
}
