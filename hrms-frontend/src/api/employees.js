/**
 * api/employees.js
 * ─────────────────
 * All employee-related API calls.
 * Matches backend routes:
 *   GET    /api/v1/employees
 *   POST   /api/v1/employees
 *   GET    /api/v1/employees/:id
 *   DELETE /api/v1/employees/:id
 */

import { get, post, del } from "./client";

export const employeeApi = {
  /** Fetch all employees (sorted newest first by backend) */
  getAll: () => get("/employees"),

  /** Fetch a single employee by employee_id (e.g. "EMP001") */
  getOne: (employeeId) => get(`/employees/${employeeId}`),

  /**
   * Create a new employee.
   * @param {{ employee_id, full_name, email, department }} data
   */
  create: (data) => post("/employees", data),

  /**
   * Delete employee + cascade their attendance records.
   * @param {string} employeeId
   */
  remove: (employeeId) => del(`/employees/${employeeId}`),
};
