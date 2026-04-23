import React, { useEffect, useMemo, useState } from "react";
import {
  createTask,
  deleteTask,
  filterTasks,
  loadTasksFromStorage,
  reorderTasks,
  saveTasksToStorage,
  setTaskCompleted,
  updateTaskTitle,
} from "./lib/tasks";
import {
  FILTERS,
  assertValidFilter,
  formatCountLabel,
  formatRelativeDateTime,
  getNowIso,
} from "./lib/utils";
import {
  CheckIcon,
  ClipboardIcon,
  DeleteIcon,
  EditIcon,
  FilterIcon,
  PlusIcon,
  ReorderIcon,
  SaveIcon,
  XIcon,
} from "./components/Icons";

/**
 * App: Ocean Professional themed task manager.
 * Local-first (localStorage) with optional hooks for future backend integration.
 */
export default function App() {
  const [tasks, setTasks] = useState(() => loadTasksFromStorage());
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [newTitle, setNewTitle] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [dragState, setDragState] = useState({ draggingId: null, overId: null });

  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    // Defensive: ensure filter is always valid even if user manipulates local state.
    try {
      assertValidFilter(filter);
    } catch (e) {
      setFilter(FILTERS.ALL);
    }
  }, [filter]);

  const filteredTasks = useMemo(() => {
    const base = filterTasks(tasks, filter);
    if (!search.trim()) return base;
    const q = search.trim().toLowerCase();
    return base.filter((t) => t.title.toLowerCase().includes(q));
  }, [tasks, filter, search]);

  const counts = useMemo(() => {
    const total = tasks.length;
    const active = tasks.filter((t) => !t.completed).length;
    const done = tasks.filter((t) => t.completed).length;
    return { total, active, done };
  }, [tasks]);

  function handleAddTask(e) {
    e.preventDefault();
    setError("");
    const title = newTitle.trim();
    if (!title) {
      setError("Task title cannot be empty.");
      return;
    }
    if (title.length > 200) {
      setError("Task title is too long (max 200 characters).");
      return;
    }

    setTasks((prev) => createTask(prev, title));
    setNewTitle("");
  }

  function handleClearCompleted() {
    setTasks((prev) => prev.filter((t) => !t.completed));
  }

  function onDragStart(taskId) {
    setDragState({ draggingId: taskId, overId: null });
  }

  function onDragOver(e, overId) {
    e.preventDefault();
    if (!dragState.draggingId || dragState.draggingId === overId) return;
    setDragState((prev) => ({ ...prev, overId }));
  }

  function onDrop() {
    const { draggingId, overId } = dragState;
    if (!draggingId || !overId || draggingId === overId) {
      setDragState({ draggingId: null, overId: null });
      return;
    }
    setTasks((prev) => reorderTasks(prev, draggingId, overId));
    setDragState({ draggingId: null, overId: null });
  }

  const apiInfo = useMemo(() => {
    // Optional future integration visibility: show env presence without requiring a backend.
    const apiBase = process.env.REACT_APP_API_BASE || "";
    const backendUrl = process.env.REACT_APP_BACKEND_URL || "";
    const wsUrl = process.env.REACT_APP_WS_URL || "";
    return {
      apiBase,
      backendUrl,
      wsUrl,
      any: Boolean(apiBase || backendUrl || wsUrl),
    };
  }, []);

  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="logoMark" aria-hidden="true" />
          <div>
            <div className="brandTitle">Personal Task Manager</div>
            <div className="brandSubtitle">
              Ocean Professional • local-first •{" "}
              <span className="mono">{formatRelativeDateTime(getNowIso())}</span>
            </div>
          </div>
        </div>

        <div className="topBarMeta">
          <div className="pill">
            <ClipboardIcon />
            <span>
              {formatCountLabel(counts.total, "task")} •{" "}
              {formatCountLabel(counts.active, "active")}
            </span>
          </div>
          <a
            className="pill pillLink"
            href="https://example.com"
            onClick={(e) => e.preventDefault()}
            aria-label="Info (placeholder link)"
            title="This is a placeholder link for future navigation."
          >
            <FilterIcon />
            <span>Filters</span>
          </a>
        </div>
      </header>

      <main className="content">
        <section className="card heroCard">
          <div className="heroHeader">
            <div>
              <h1 className="h1">Stay focused. Ship with clarity.</h1>
              <p className="subtle">
                Add tasks, prioritize by dragging, and filter your day with a
                clean Ocean Professional UI.
              </p>
            </div>

            <div className="envHint" aria-label="Environment integration hint">
              <div className="envTitle">Integration</div>
              <div className="envBody">
                {apiInfo.any ? (
                  <div className="envOk">
                    <CheckIcon /> Env vars detected for optional backend use.
                  </div>
                ) : (
                  <div className="envMuted">
                    Local-only mode (no backend configured).
                  </div>
                )}
              </div>
            </div>
          </div>

          <form className="addRow" onSubmit={handleAddTask}>
            <label className="srOnly" htmlFor="new-task">
              Add a new task
            </label>
            <input
              id="new-task"
              className="input"
              type="text"
              value={newTitle}
              placeholder="Add a task… (e.g., “Finish roadmap”)"
              onChange={(e) => setNewTitle(e.target.value)}
              autoComplete="off"
            />
            <button className="btnPrimary" type="submit">
              <PlusIcon />
              Add
            </button>
          </form>

          {error ? <div className="inlineError">{error}</div> : null}

          <div className="toolbar">
            <div className="filters" role="tablist" aria-label="Task filters">
              <FilterButton
                active={filter === FILTERS.ALL}
                onClick={() => setFilter(FILTERS.ALL)}
                label="All"
              />
              <FilterButton
                active={filter === FILTERS.ACTIVE}
                onClick={() => setFilter(FILTERS.ACTIVE)}
                label="Active"
              />
              <FilterButton
                active={filter === FILTERS.COMPLETED}
                onClick={() => setFilter(FILTERS.COMPLETED)}
                label="Completed"
              />
            </div>

            <div className="searchWrap">
              <label className="srOnly" htmlFor="search">
                Search tasks
              </label>
              <input
                id="search"
                className="input inputSmall"
                type="search"
                value={search}
                placeholder="Search…"
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search ? (
                <button
                  type="button"
                  className="iconBtn"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  title="Clear search"
                >
                  <XIcon />
                </button>
              ) : null}
            </div>

            <div className="actions">
              <button
                type="button"
                className="btnSecondary"
                onClick={handleClearCompleted}
                disabled={counts.done === 0}
                title="Remove all completed tasks"
              >
                <DeleteIcon />
                Clear completed
              </button>
            </div>
          </div>
        </section>

        <section className="card listCard" aria-label="Task list section">
          <div className="listHeader">
            <div className="listTitle">
              <span className="listTitleMain">Tasks</span>
              <span className="listTitleSubtle">
                {filteredTasks.length === tasks.length
                  ? `${formatCountLabel(filteredTasks.length, "item")} shown`
                  : `${formatCountLabel(filteredTasks.length, "match")} of ${formatCountLabel(
                      tasks.length,
                      "task",
                    )}`}
              </span>
            </div>

            <div className="listHint">
              <ReorderIcon /> Drag to prioritize
            </div>
          </div>

          {filteredTasks.length === 0 ? (
            <EmptyState
              filter={filter}
              search={search}
              onReset={() => {
                setFilter(FILTERS.ALL);
                setSearch("");
              }}
            />
          ) : (
            <ul className="taskList" aria-label="Tasks">
              {filteredTasks.map((t) => (
                <TaskRow
                  key={t.id}
                  task={t}
                  draggingId={dragState.draggingId}
                  overId={dragState.overId}
                  onToggle={() =>
                    setTasks((prev) => setTaskCompleted(prev, t.id, !t.completed))
                  }
                  onDelete={() => setTasks((prev) => deleteTask(prev, t.id))}
                  onEdit={(nextTitle) =>
                    setTasks((prev) => updateTaskTitle(prev, t.id, nextTitle))
                  }
                  onDragStart={() => onDragStart(t.id)}
                  onDragOver={(e) => onDragOver(e, t.id)}
                  onDrop={onDrop}
                />
              ))}
            </ul>
          )}
        </section>

        <footer className="footer">
          <div className="footerInner">
            <span className="footerMuted">
              Data stored locally in your browser (localStorage). No account
              needed.
            </span>
            <span className="footerMuted mono">
              {process.env.REACT_APP_NODE_ENV || "development"}
            </span>
          </div>
        </footer>
      </main>
    </div>
  );
}

function FilterButton({ active, onClick, label }) {
  return (
    <button
      type="button"
      className={active ? "chip chipActive" : "chip"}
      onClick={onClick}
      role="tab"
      aria-selected={active}
    >
      {label}
    </button>
  );
}

function EmptyState({ filter, search, onReset }) {
  const title = search
    ? "No matching tasks"
    : filter === FILTERS.COMPLETED
      ? "No completed tasks yet"
      : filter === FILTERS.ACTIVE
        ? "No active tasks"
        : "No tasks yet";

  const subtitle = search
    ? "Try a different keyword or clear the search."
    : "Add your first task above to get started.";

  return (
    <div className="emptyState">
      <div className="emptyIcon" aria-hidden="true">
        <ClipboardIcon />
      </div>
      <div className="emptyText">
        <div className="emptyTitle">{title}</div>
        <div className="emptySubtitle">{subtitle}</div>
      </div>
      <button type="button" className="btnSecondary" onClick={onReset}>
        Reset view
      </button>
    </div>
  );
}

function TaskRow({
  task,
  onToggle,
  onDelete,
  onEdit,
  onDragStart,
  onDragOver,
  onDrop,
  draggingId,
  overId,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(task.title);
  const [rowError, setRowError] = useState("");

  useEffect(() => {
    setDraft(task.title);
  }, [task.title]);

  const isDragging = draggingId === task.id;
  const isOver = overId === task.id && draggingId && draggingId !== task.id;

  function startEdit() {
    setRowError("");
    setIsEditing(true);
  }

  function cancelEdit() {
    setRowError("");
    setDraft(task.title);
    setIsEditing(false);
  }

  function saveEdit() {
    const next = draft.trim();
    if (!next) {
      setRowError("Title cannot be empty.");
      return;
    }
    if (next.length > 200) {
      setRowError("Title too long (max 200).");
      return;
    }
    onEdit(next);
    setIsEditing(false);
  }

  return (
    <li
      className={[
        "taskRow",
        task.completed ? "taskRowCompleted" : "",
        isDragging ? "taskRowDragging" : "",
        isOver ? "taskRowOver" : "",
      ].join(" ")}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      aria-label={`Task: ${task.title}`}
    >
      <button
        type="button"
        className={task.completed ? "checkBtn checkBtnDone" : "checkBtn"}
        onClick={onToggle}
        aria-label={task.completed ? "Mark as active" : "Mark as completed"}
        title={task.completed ? "Mark as active" : "Mark as completed"}
      >
        <CheckIcon />
      </button>

      <div className="taskMain">
        {isEditing ? (
          <div className="editWrap">
            <input
              className="input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              aria-label="Edit task title"
            />
            {rowError ? <div className="inlineError">{rowError}</div> : null}
          </div>
        ) : (
          <>
            <div className="taskTitle">{task.title}</div>
            <div className="taskMeta">
              <span className="mono">{formatRelativeDateTime(task.createdAt)}</span>
              {task.updatedAt ? (
                <span className="taskMetaSep">•</span>
              ) : null}
              {task.updatedAt ? (
                <span className="mono">
                  updated {formatRelativeDateTime(task.updatedAt)}
                </span>
              ) : null}
            </div>
          </>
        )}
      </div>

      <div className="taskActions">
        {isEditing ? (
          <>
            <button
              type="button"
              className="iconBtn"
              onClick={saveEdit}
              aria-label="Save edit"
              title="Save"
            >
              <SaveIcon />
            </button>
            <button
              type="button"
              className="iconBtn"
              onClick={cancelEdit}
              aria-label="Cancel edit"
              title="Cancel"
            >
              <XIcon />
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="iconBtn"
              onClick={startEdit}
              aria-label="Edit task"
              title="Edit"
            >
              <EditIcon />
            </button>
            <button
              type="button"
              className="iconBtn danger"
              onClick={onDelete}
              aria-label="Delete task"
              title="Delete"
            >
              <DeleteIcon />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
