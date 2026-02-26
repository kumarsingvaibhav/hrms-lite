/**
 * api/attendance.js
 * ──────────────────
 * All attendance-related API calls.
 * Matches backend routes:
 *   POST /api/v1/attendance
 *   GET  /api/v1/attendance/employee/:id
 *   GET  /api/v1/attendance/employee/:id/summary
 *   GET  /api/v1/attendance/date/:date
 */

import { get, post } from "./client";

export const attendanceApi = {
  /**
   * Mark attendance for one employee on one date.
   * @param {{ employee_id: string, date: string, status: "Present"|"Absent" }} data
   */
  mark: (data) => post("/attendance", data),

  /** Full attendance history for an employee (newest first) */
  getByEmployee: (employeeId) =>
    get(`/attendance/employee/${employeeId}`),

  /** Aggregated stats — present_days, absent_days, attendance_rate */
  getSummary: (employeeId) =>
    get(`/attendance/employee/${employeeId}/summary`),

  /** All attendance records on a specific date (YYYY-MM-DD) */
  getByDate: (date) => get(`/attendance/date/${date}`),
};
