/**
 * components/common/Icon.jsx
 * ───────────────────────────
 * Inline SVG icons — no external dependency, no network request.
 * Usage: <Icon name="employees" style={{ color: "red" }} />
 */

const PATHS = {
  dashboard:   <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  employees:   <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
  attendance:  <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M9 16l2 2 4-4"/></>,
  plus:        <><path d="M12 5v14M5 12h14"/></>,
  trash:       <><path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2"/></>,
  close:       <><path d="M18 6L6 18M6 6l12 12"/></>,
  back:        <><path d="M19 12H5M12 19l-7-7 7-7"/></>,
  check:       <><path d="M20 6L9 17l-5-5"/></>,
  alert:       <><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></>,
  users:       <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></>,
  calendar:    <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>,
  eye:         <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
  trend:       <><path d="M23 6l-9.5 9.5-5-5L1 18"/><path d="M17 6h6v6"/></>,
  refresh:     <><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></>,
  wifi_off:    <><line x1="1" y1="1" x2="23" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></>,
};

export default function Icon({ name, className, style, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width="18"
      height="18"
      className={className}
      style={style}
      aria-hidden="true"
      {...rest}
    >
      {PATHS[name] ?? null}
    </svg>
  );
}
