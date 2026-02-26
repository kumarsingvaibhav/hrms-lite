/**
 * utils/helpers.js
 * ─────────────────
 * Pure helper functions shared across the app.
 */

/** Department → hex colour (matches sidebar palette) */
export const DEPT_COLORS = {
  Engineering: "#2563EB",
  Product:     "#7C3AED",
  Design:      "#0891B2",
  Operations:  "#D97706",
  HR:          "#059669",
  Finance:     "#DC2626",
  Marketing:   "#DB2777",
};

export const DEPARTMENTS = Object.keys(DEPT_COLORS);

/** Deterministic avatar background from name string */
export function avatarColor(name = "") {
  const palette = Object.values(DEPT_COLORS);
  let h = 0;
  for (const c of name) h = c.charCodeAt(0) + h * 31;
  return palette[Math.abs(h) % palette.length];
}

/** First two initials from a full name */
export function initials(name = "") {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/** Today's date as YYYY-MM-DD (local time) */
export function todayISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Format ISO date string → "1 Jan 2025" */
export function fmtDate(iso) {
  if (!iso) return "—";
  // Append time to avoid UTC-shift on date-only strings
  const d = new Date(`${iso.slice(0, 10)}T00:00:00`);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Format today's date for the header */
export function fmtToday() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
