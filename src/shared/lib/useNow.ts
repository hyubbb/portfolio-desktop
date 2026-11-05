import { useEffect, useState } from "react";

/** 주기적으로 현재 시각을 돌려주는 훅 (메뉴 막대 시계) */
export function useNow(intervalMs = 15_000): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
