/**
 * hooks/useAsync.js
 * ──────────────────
 * Generic hook for async data fetching.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useAsync(employeeApi.getAll);
 */

import { useState, useEffect, useCallback, useRef } from "react";

export function useAsync(fn, deps = []) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fn();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(err.message || "Something went wrong.");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    mountedRef.current = true;
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { data, loading, error, refetch: run };
}
