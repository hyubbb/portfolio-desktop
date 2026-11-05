export type TimeAgo = { key: "today" } | { key: "daysAgo" | "monthsAgo" | "yearsAgo"; n: number };

/** YYYY-MM-DD 날짜가 지금으로부터 얼마나 지났는지 (번역 키로 돌려줌) */
export function timeAgo(date: string, now: Date = new Date()): TimeAgo {
  const days = Math.floor((now.getTime() - new Date(`${date}T00:00:00`).getTime()) / 86_400_000);
  if (days < 1) return { key: "today" };
  if (days < 31) return { key: "daysAgo", n: days };
  if (days < 365) return { key: "monthsAgo", n: Math.floor(days / 30) };
  return { key: "yearsAgo", n: Math.floor(days / 365) };
}
