/**
 * hooks/useToast.js
 * ──────────────────
 * Lightweight toast system. Returns { toasts, toast }.
 * toast(message, type?) — type is "success" | "error"
 */

import { useState, useCallback } from "react";

let _id = 0;

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = "success") => {
    const id = ++_id;
    setToasts((t) => [...t, { id, msg, type }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3800);
  }, []);

  return { toasts, toast };
}
