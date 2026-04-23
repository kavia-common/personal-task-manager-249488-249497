export const FILTERS = Object.freeze({
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
});

// PUBLIC_INTERFACE
export function assertValidFilter(filter) {
  /** Throw if filter is not a supported value. */
  const ok = Object.values(FILTERS).includes(filter);
  if (!ok) throw new Error(`Invalid filter: ${filter}`);
}

// PUBLIC_INTERFACE
export function makeId(prefix) {
  /** Create a reasonably-unique id for client-only usage. */
  const rand = Math.random().toString(16).slice(2);
  const time = Date.now().toString(16);
  return `${prefix}_${time}_${rand}`;
}

// PUBLIC_INTERFACE
export function getNowIso() {
  /** ISO timestamp (UTC) used for createdAt/updatedAt. */
  return new Date().toISOString();
}

// PUBLIC_INTERFACE
export function formatCountLabel(count, noun) {
  /** Format "1 task" vs "2 tasks" */
  const n = Number(count) || 0;
  const plural = n === 1 ? noun : `${noun}s`;
  return `${n} ${plural}`;
}

// PUBLIC_INTERFACE
export function formatRelativeDateTime(isoString) {
  /** Human-friendly relative time (e.g., "3m ago") from an ISO timestamp. */
  if (!isoString) return "";
  const ts = new Date(isoString).getTime();
  if (Number.isNaN(ts)) return "";

  const deltaMs = Date.now() - ts;
  const abs = Math.abs(deltaMs);

  const sec = Math.round(abs / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);

  const suffix = deltaMs >= 0 ? "ago" : "from now";
  if (sec < 45) return `${sec}s ${suffix}`;
  if (min < 45) return `${min}m ${suffix}`;
  if (hr < 36) return `${hr}h ${suffix}`;
  return `${day}d ${suffix}`;
}
