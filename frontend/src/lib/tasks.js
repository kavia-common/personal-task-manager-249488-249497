import { getNowIso, makeId } from "./utils";

const STORAGE_KEY = "ptm.tasks.v1";

/**
 * A task is:
 * { id: string, title: string, completed: boolean, createdAt: string, updatedAt?: string }
 */

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function loadTasksFromStorage() {
  /** Load tasks from localStorage, returning [] on any error. */
  if (typeof window === "undefined" || !window.localStorage) return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeJsonParse(raw);
  if (!Array.isArray(parsed)) return [];
  // Basic normalization/validation.
  return parsed
    .filter((t) => t && typeof t.id === "string" && typeof t.title === "string")
    .map((t) => ({
      id: t.id,
      title: String(t.title),
      completed: Boolean(t.completed),
      createdAt: typeof t.createdAt === "string" ? t.createdAt : getNowIso(),
      updatedAt: typeof t.updatedAt === "string" ? t.updatedAt : undefined,
    }));
}

// PUBLIC_INTERFACE
export function saveTasksToStorage(tasks) {
  /** Persist tasks to localStorage (best-effort). */
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore quota/security errors; app still functions in-memory.
  }
}

// PUBLIC_INTERFACE
export function createTask(tasks, title) {
  /** Return a new task list with a newly created task at the top. */
  const now = getNowIso();
  const task = {
    id: makeId("task"),
    title,
    completed: false,
    createdAt: now,
  };
  return [task, ...tasks];
}

// PUBLIC_INTERFACE
export function deleteTask(tasks, taskId) {
  /** Delete a task by id. */
  return tasks.filter((t) => t.id !== taskId);
}

// PUBLIC_INTERFACE
export function setTaskCompleted(tasks, taskId, completed) {
  /** Toggle completion flag for a task. */
  const now = getNowIso();
  return tasks.map((t) =>
    t.id === taskId ? { ...t, completed, updatedAt: now } : t,
  );
}

// PUBLIC_INTERFACE
export function updateTaskTitle(tasks, taskId, title) {
  /** Update task title. */
  const now = getNowIso();
  return tasks.map((t) =>
    t.id === taskId ? { ...t, title, updatedAt: now } : t,
  );
}

// PUBLIC_INTERFACE
export function filterTasks(tasks, filter) {
  /** Filter tasks by 'all' | 'active' | 'completed'. */
  if (filter === "active") return tasks.filter((t) => !t.completed);
  if (filter === "completed") return tasks.filter((t) => t.completed);
  return tasks;
}

// PUBLIC_INTERFACE
export function reorderTasks(tasks, draggingId, overId) {
  /** Reorder tasks by moving draggingId item before overId item. */
  const fromIndex = tasks.findIndex((t) => t.id === draggingId);
  const toIndex = tasks.findIndex((t) => t.id === overId);
  if (fromIndex < 0 || toIndex < 0) return tasks;
  if (fromIndex === toIndex) return tasks;

  const copy = [...tasks];
  const [moved] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, moved);
  return copy;
}
