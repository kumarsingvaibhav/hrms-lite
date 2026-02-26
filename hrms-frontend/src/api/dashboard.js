/**
 * api/dashboard.js
 * ─────────────────
 * Dashboard summary endpoint.
 * GET /api/v1/dashboard
 *
 * Returns: { total_employees, today: { present, absent, not_marked, marked_total } }
 */

import { get } from "./client";

export const dashboardApi = {
  getStats: () => get("/dashboard"),
};
