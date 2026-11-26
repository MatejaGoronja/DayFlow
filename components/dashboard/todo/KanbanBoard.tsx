"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Bell, CalendarDays, ChevronLeft, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { useDashboard } from "../store/DashboardProvider";
import { dayNumber, parseKey, taskRemindOptions, toKey, type Priority, type Remind, type Status, type Task, type TaskInput } from "../store/dashboard";

type ColumnDef = {status: Status; title: string; short: string; dot: string};

const columns: ColumnDef[] = [
  {status: "todo", title: "To do", short: "To do", dot: "bg-muted"},
  {status: "progress", title: "In progress", short: "Doing", dot: "bg-primary"},
  {status: "done", title: "Done", short: "Done", dot: "bg-accent"},
];

const priorityBorder: Record<Priority, string> = {
  high: "border-l-red-400",
  medium: "border-l-amber-400",
  low: "border-l-accent",
};

const priorityBadge: Record<Priority, string> = {
  high: "bg-red-50 text-red-600",
  medium: "bg-amber-50 text-amber-600",
  low: "bg-accent/10 text-accent",
};

const priorityRank: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

function formatDate(date: string) {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

type DueInfo = { label: string; chip: string; overdue: boolean } | null;

function dueInfo(task: Task, today: string): DueInfo {
  if(!task.due || !today || task.status === "done") return null;

  const diff = dayNumber(task.due) - dayNumber(today);

  if(diff < 0) {
    return {
      label: `Overdue · ${formatDate(task.due)}`,
      chip: "bg-red-100 font-bold text-red-600",
      overdue: true,
    };
  }

  if(diff <= 2){
    const label = diff === 0 ? "Due today" : diff === 1 ? "Due tomorrow" : "Due in 2 days";
    return { label, chip: "bg-orange-50 font-semibold text-orange-600", overdue: false};
  }
  return null;
}

function compareTasks(a: Task, b: Task) {
  if(priorityRank[a.priority] !== priorityRank[b.priority]) {
    return priorityRank[a.priority] - priorityRank[b.priority];
  }
  if(a.due === b.due) return 0;
  if(!a.due) return 1;
  if(!b.due) return -1;
  return a.due.localeCompare(b.due);
}

{/* Date picker */}
const weekdays = ["M", "T", "W", "T", "F", "S", "S"];

type DatePickerProps = {
  value: string;
  today: string;
  onChange: (value: string) => void;
};

function DatePicker({value, today, onChange}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const base = parseKey(value || today || "2026-01-01");
  const [view, setView] = useState({y: base.y, m: base.m});
  
  const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
  const cells = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(view.y, view.m, i - offset + 1);
    return {
      key: toKey(d.getFullYear(), d.getMonth(), d.getDate()),
      day: d.getDate(),
      inMonth: d.getMonth() === view.m,
    };
  });

  const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  function shift(delta: number) {
    const d = new Date(view.y, view.m + delta, 1);
    setView({ y: d.getFullYear(), m:d.getMonth() });
  }

  function pick(key: string) {
    onChange(key);
    setOpen(false);
  }

  const nav = "rounded-md p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary";

  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} aria-expanded={open} className={`flex w-full items-center gap-2 rounded-lg border bg-white px-3 py-2 text-left text-xs outline-none transition-colors ${
        open ? "border-primary ring-2 ring-primary/20" : "border-border"
      }`}>
        <CalendarDays size={14} className="shrink-0 text-muted"/>
        <span className={value ? "font-semibold" : "text-muted"}>
          {value ? formatDate(value) : "No due date"}
        </span>
      </button>

      {open && (
        <div className="mt-2 rounded-xl border border-border bg-white p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">{monthLabel}</span>
            <div className="flex">
              <button type="button" onClick={() => shift(-1)} aria-label="Previous month" className={nav}>
                <ChevronLeft size={16}/>
              </button>
              <button type="button" onClick={() => shift(1)} aria-label="Next month" className={nav}>
                <ChevronRight size={16}/>
              </button>
            </div>
          </div>

          <div className="mt-2 grid grid-cols-7 text-center text-[11px] font-semibold text-muted">
            {weekdays.map((d, i) => (
              <span key={i} className="py-1">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {cells.map((cell) => {
              const selected = cell.key === value;
              const isToday = cell.key === today;
              return (
                <button key={cell.key} type="button" onClick={() => pick(cell.key)} aria-pressed={selected} className={`flex aspect-square items-center justify-center rounded-lg text-xs font-semibold transition-colors ${
                  selected
                  ? "bg-primary text-white"
                  : isToday
                    ? "bg-primary-soft text-primary"
                    : cell.inMonth
                      ? "hover:bg-primary-hover/10"
                      : "text-muted/50 hover:bg-primary-hover/10"
                }`}>
                  {cell.day}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex justify-between border-t border-border pt-2 text-xs font-semibold">
            <button type="button" onClick={() => today && pick(today)} className="text-primary hover:underline">
              Today
            </button>
            <button type="button" onClick={() => pick("")} className="text-muted hover:text-red-500 hover:underline">
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

type TaskFormProps = {
  initial?: Task;
  today: string;
  onSubmit: (input: TaskInput) => void;
  onCancel: () => void;
};

function TaskForm({ initial, today, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [priority, setPriority] = useState<Priority>(initial?.priority ?? "medium");
  const [due, setDue] = useState(initial?.due ?? "");
  const [remind, setRemind] = useState<Remind>(initial?.remind ?? "none");
  const [error, setError] = useState("");

  function handleDueChange(value: string) {
    setDue(value);
    if(!value) setRemind("none");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = title.trim();
    if(!trimmed){
      setError("Please enter a task title.");
      return;
    }
    onSubmit({ title: trimmed, priority, due, remind });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5 rounded-xl border border-primary/40 bg-white p-3 shadow-sm">
      <input autoFocus type="text" value={title} onChange={(e) => {
        setTitle(e.target.value);
        if(error) setError("");
      }} 
      onKeyDown={(e) => e.key === "Escape" && onCancel()}
      placeholder="Task title..."
      aria-label="Task title"
      aria-invalid={!!error}
      className={`w-full rounded-lg border px-3 py-2 text-sm outline-none placeholder:text-muted/60 focus:ring-2 focus:ring-primary/20 ${
        error ? "border-red-400" : "border-border focus:border-primary"
      }`}/>
      {error && <p className="text-sm text-red-500">{error}</p>}

      <select value={priority} onChange={(e) => setPriority(e.target.value as Priority)} aria-label="Priority" 
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary">
          <option value="low">Low priority</option>
          <option value="medium">Medium priority</option>
          <option value="high">High priority</option>
      </select>

      <DatePicker value={due} today={today} onChange={handleDueChange}/>

      <select value={remind} onChange={(e) => setRemind(e.target.value as Remind)} disabled={!due} aria-label="Remind me"
        className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs outline-none focus:border-primary disabled:opacity-50">
          {taskRemindOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.value === "none" && !due ? "Reminder (set a due date first)" : o.label}
            </option>
          ))}
      </select>

      <div className="flex gap-2">
        <button type="submit" className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
          {initial? "Save changes" : "Add"}
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface">
          Cancel
        </button>
      </div>
    </form>
  );
}

type CardProps = {
  task: Task;
  today: string;
  index: number;
  dragging: boolean;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onMove: (id: string, status: Status) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskCard({
  task,
  today,
  index,
  dragging,
  onDragStart,
  onDragEnd,
  onMove,
  onEdit,
  onDelete,
}: CardProps) {
  const prev = columns[index - 1];
  const next = columns[index + 1];
  const done = task.status === "done";
  const due = dueInfo(task, today);

  return (
    <li draggable onDragStart={(e) => {
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
      onDragStart(task.id);
    }}
    onDragEnd={onDragEnd}
    className={`group cursor-grab rounded-xl border border-l-4 bg-white p-3.5 shadow-sm transition-opacity active:cursor-grabbing ${
      due?.overdue ? "border-red-200" : "border-border"
    } ${priorityBorder[task.priority]} ${dragging ? "opacity-40" : ""}`}>
      <p className={`text-sm font-semibold ${done ? "text-muted line-through" : ""}`}>
        {task.title}
      </p>

      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${priorityBadge[task.priority]}`}>
          {task.priority}
        </span>

        {task.due &&
          (due ? (
            <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${due.chip}`}>
              <CalendarDays size={13}/>
              {due.label}
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs text-muted">
              <CalendarDays size={13}/>
              {formatDate(task.due)}
            </span>
        ))}

        {task.remind !== "none" && !done && (
          <span title="Reminder set" className="text-muted">
            <Bell size={13}/>
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
        <div className="flex gap-1">
          <button type="button" onClick={() => prev && onMove(task.id, prev.status)} disabled={!prev} aria-label={prev ? `Move to ${prev.title}` : "Can't move left"} className="rounded-md p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary disabled:pointer-events-none disabled:opacity-30">
            <ArrowLeft size={16}/>
          </button>
          <button type="button" onClick={() => next && onMove(task.id, next.status)} disabled={!next} aria-label={next ? `Move to ${next.title}` : "Can't move right"} className="rounded-md p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary disabled:pointer-events-none disabled:opacity-30">
            <ArrowRight size={16}/>
          </button>
        </div>

        <div className="flex items-center transition-all lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100">
          <button type="button" onClick={() => onEdit(task.id)} aria-label={`Edit ${task.title}`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
            <Pencil size={16}/>
          </button>
          <button type="button" onClick={() => onDelete(task.id)} aria-label={`Delete ${task.title}`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-500">
            <Trash2 size={16}/>
          </button>
        </div>
      </div>
    </li>
  );
}

type ColumnsProps = {
  column: ColumnDef;
  index: number;
  tasks: Task[];
  today: string;
  visible: boolean;
  isOver: boolean;
  draggingId: string | null;
  editingId: string | null;
  onDragOver: (status: Status) => void;
  onDragLeave: () => void;
  onDrop: (status: Status, id: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onMove: (id: string, status: Status) => void;
  onEdit: (id: string) => void;
  onCancelEdit: () => void;
  onUpdate: (id: string, input: TaskInput) => void;
  onDelete: (id: string) => void;
  onAdd: (status: Status, input: TaskInput) => void;
};

function Column({
  column,
  index,
  tasks,
  today,
  visible,
  isOver,
  draggingId,
  editingId,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragStart,
  onDragEnd,
  onMove,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onAdd,
}: ColumnsProps) {
  const [adding, setAdding] = useState(false);

  return (
    <section aria-label={column.title} onDragOver={(e) => {
      e.preventDefault();
      onDragOver(column.status);
    }}
    onDragLeave={(e) => {
      if(!e.currentTarget.contains(e.relatedTarget as Node)) onDragLeave();
    }}
    onDrop={(e) => {
      e.preventDefault();
      onDrop(column.status, e.dataTransfer.getData("text/plain"));
    }}
    className={`flex-col rounded-2xl border p-3 transition-colors ${
      visible ? "flex" : "hidden xl:flex"
    } ${isOver ? "border-primary bg-primary-soft" : "border-border bg-white/60"}`}
    >
      <div className="flex items-center justify-between px-1 pb-3">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.dot}`}/>
          <h2 className="text-sm font-bold">{column.title}</h2>
          <span className="rounded-full bg-surface px-2 py-0.5 text-xs font-semibold text-muted">
            {tasks.length}
          </span>
        </div>
        <button type="button" onClick={() => setAdding(true)} aria-label={`Add task to ${column.title}`} className="rounded-lg p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
          <Plus size={18}/>
        </button>
      </div>

      <ul className="min-h-24 flex-1 space-y-3">
        {tasks.map((task) =>
          editingId === task.id ? (
            <li key={task.id}>
              <TaskForm initial={task} today={today} onSubmit={(input) => onUpdate(task.id, input)} onCancel={onCancelEdit}/>
            </li>
          ) : (
            <TaskCard key={task.id} task={task} today={today} index={index} dragging={draggingId === task.id} onDragStart={onDragStart} onDragEnd={onDragEnd} onMove={onMove} onEdit={(id) => {
              setAdding(false);
              onEdit(id);
            }}
            onDelete={onDelete}/>
          )
        )}

        {tasks.length === 0 && !adding && (
          <li className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
            Drop tasks here
          </li>
        )}
      </ul>

      <div className="mt-3">
        {adding ? (
          <TaskForm
            today={today}
            onSubmit={(input) => {
              onAdd(column.status, input);
              setAdding(false);
            }}
            onCancel={() => setAdding(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
              <Plus size={16}/>
              Add task
            </button>
        )}
      </div>
    </section>
  );
}

export default function KanbanBoard() {
  const { ready, today, tasks, addTask, updateTask, moveTask, deleteTask } = useDashboard();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<Status | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tab, setTab] = useState<Status>("todo");

  if(!ready){
    return <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white/60"/>;
  }

  function handleUpdate(id: string, input: TaskInput) {
    updateTask(id, input);
    setEditingId(null);
  }

  function handleDrop(status: Status, id: string){
    if(id) moveTask(id, status);
    setDraggingId(null);
    setOverColumn(null);
  }

  return (
    <div className="mt-8">
      <div role="tablist" aria-label="Task columns" className="mb-4 grid grid-cols-3 gap-2 xl:hidden">
        {columns.map((column) => {
          const count = tasks.filter((t) => t.status === column.status).length;
          const active = tab === column.status;
          const isOver = overColumn === column.status;

          return (
            <button key={column.status} type="button" role="tab" aria-selected={active}
            aria-label={`${column.title}, ${count} tasks`} onClick={() => setTab(column.status)} 
            onDragOver={(e) => {
              e.preventDefault();
              setOverColumn(column.status);
            }}
            onDragLeave={() => setOverColumn(null)}
            onDrop={(e) => {
              e.preventDefault();
              handleDrop(column.status, e.dataTransfer.getData("text/plain"));
            }}
            className={`flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border px-2 py-2.5 text-sm font-semibold transition-colors sm:px-3 ${
              isOver
                ? "border-primary bg-primary-soft text-primary"
                : active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted hover:bg-primary-hover/10 hover:text-primary"
            }`}
            >
              <span className={`h-2 w-2 shrink-0 rounded-full ${active ? "bg-white" :column.dot}`}/>
              <span className="sm:hidden">{column.short}</span>
              <span className="hidden sm:inline">{column.title}</span>
              <span className="opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 xl:grid-cols-3 xl:items-start">
        {columns.map((column, index) => (
          <Column 
            key={column.status}
            column={column}
            index={index}
            tasks={tasks.filter((t) => t.status === column.status).sort(compareTasks)}
            today={today}
            visible={tab === column.status}
            isOver={overColumn === column.status}
            draggingId={draggingId}
            editingId={editingId}
            onDragOver={setOverColumn}
            onDragLeave={() => setOverColumn(null)}
            onDrop={handleDrop}
            onDragStart={setDraggingId}
            onDragEnd={() => {
              setDraggingId(null);
              setOverColumn(null);
            }}
            onMove={moveTask}
            onEdit={setEditingId}
            onCancelEdit={() => setEditingId(null)}
            onUpdate={handleUpdate}
            onDelete={deleteTask}
            onAdd={addTask}
          />
        ))}
      </div>
    </div>
  );
}