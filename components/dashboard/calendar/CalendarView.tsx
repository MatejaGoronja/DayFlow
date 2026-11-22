"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronLeft, ChevronRight, Clock, Pencil, Plus, Repeat as RepeatIcon, Trash2 } from "lucide-react";

type Category = "work" | "personal" | "study";
type Freq = "none" | "daily" | "weekly" | "monthly" | "yearly";
type EndType = "never" | "count" | "until";

type Repeat = {
    freq: Freq;
    interval: number;
    end: EndType;
    count: number;
    until: string;
}

type CalEvent = {
    id: string;
    title: string;
    date: string;
    start: string;
    end: string;
    category: Category;
    repeat: Repeat;
};

type EventInput = Omit<CalEvent, "id" | "date">;

const USE_12H = true;

const categories: Record<Category, {label: string; dot: string; chip: string}> = {
    work: {label: "Work", dot: "bg-primary", chip: "bg-primary-soft text-primary"},
    personal: {label: "Personal", dot: "bg-accent", chip: "bg-accent/10 text-accent"},
    study: {label: "Study", dot: "bg-amber-400", chip: "bg-amber-50 text-amber-600"},
};

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const noRepeat: Repeat = { freq: "none", interval: 1, end: "never", count: 10, until: ""};

const freqUnit: Record<Exclude<Freq, "none">, string> = {
    daily: "day",
    weekly: "week",
    monthly: "month",
    yearly: "year",
};

const initialEvents: CalEvent[] = [
  { id: "1", title: "Team meeting", date: "2026-11-12", start: "14:00", end: "15:00", category: "work", repeat: { ...noRepeat, freq: "weekly" } },
  { id: "2", title: "Internet technologies lecture", date: "2026-11-13", start: "10:00", end: "12:00", category: "study", repeat: noRepeat },
  { id: "3", title: "Dentist", date: "2026-11-16", start: "17:30", end: "18:00", category: "personal", repeat: noRepeat },
  { id: "4", title: "Project deadline", date: "2026-11-20", start: "09:00", end: "10:00", category: "work", repeat: noRepeat },
  { id: "5", title: "Study session", date: "2026-11-20", start: "18:00", end: "20:00", category: "study", repeat: noRepeat },
  { id: "6", title: "Dog's birthday", date: "2026-11-25", start: "09:00", end: "10:00", category: "personal", repeat: { ...noRepeat, freq: "yearly" } },
];

const pad = (n: number) => String(n).padStart(2, "0");
const toKey = (y: number, m: number, d: number) => `${y}-${pad(m+1)}-${pad(d)}`;

function parseKey(key: string) {
    return {
        y: Number(key.slice(0, 4)),
        m: Number(key.slice(5,7)) - 1,
        d: Number(key.slice(8,10)),
    };
}

function dayNumber(key: string){
    const { y, m, d } = parseKey(key);
    return Math.round(Date.UTC(y, m, d) / 86_400_000);
}

function formatTime(time:string){
    if(!USE_12H) return time;
    const [h, m] = time.split(":").map(Number);
    return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
}

function formatLong(key: string, options: Intl.DateTimeFormatOptions){
    const { y, m, d } = parseKey(key);
    return new Date(y, m, d).toLocaleDateString("en-US", options);
}

function subscribe() {
    return () => {};
}

function getToday() {
    const now = new Date();
    return toKey(now.getFullYear(), now.getMonth(), now.getDate());
}

function getServerToday(){
    return "";
}

function occurenceNumber(ev: CalEvent, key: string): number | null {
    const {freq, interval} = ev.repeat;
    if(key < ev.date) return null;

    if(freq === "none") return key === ev.date ? 0 : null;

    if(freq === "daily" || freq === "weekly") {
        const step = (freq === "daily" ? 1 : 7) * interval;
        const diff = dayNumber(key) - dayNumber(ev.date);
        return diff % step === 0 ? diff / step : null;
    }

    const s = parseKey(ev.date);
    const k = parseKey(key);
    const stepMonths = (freq === "monthly" ? 1 : 12) * interval;
    const monthsDiff = (k.y - s.y) * 12 + (k.m - s.m);

    if(k.d !== s.d || monthsDiff % stepMonths !== 0) return null;
    if(freq === "yearly" && k.m !== s.m) return null;

    let index = 0;
    for (let j = 0; j < monthsDiff / stepMonths; j++){
        const probe = new Date(s.y, s.m + j * stepMonths, s.d);
        if(probe.getDate() === s.d) index++;
    }
    return index;
}

function occursOn(ev: CalEvent, key: string){
    const n = occurenceNumber(ev, key);
    if(n === null) return false;
    if(ev.repeat.end === "count") return n < ev.repeat.count;
    if(ev.repeat.end === "until") return key <= ev.repeat.until;
    return true;
}

function describeRepeat(r: Repeat, date: string) {
    if(r.freq === "none") return "Does not repeat";

    const unit = freqUnit[r.freq];
    let text = r.interval === 1 ? `Every ${unit}` : `Every ${r.interval} ${unit}s`;

    if (r.freq === "weekly") text += ` on ${formatLong(date, { weekday: "long"})}`;
    if (r.freq === "monthly") text += ` on day ${parseKey(date).d}`;
    if (r.freq === "yearly") text += ` on ${formatLong(date, { month: "long", day: "numeric"})}`;

    if (r.end === "count") text += `, ${r.count} times`;
    if (r.end === "until" && r.until){
        text += `, until ${formatLong(r.until, { month: "short", day: "numeric", year: "numeric"})}`;
    } 

    return text;
}

{/* Event form */}
type EventFormProps = {
    date: string;
    initial?: CalEvent;
    onSubmit: (input: EventInput) => void;
    onCancel: () => void;
};

function EventForm({ date, initial, onSubmit, onCancel}: EventFormProps){
    const [title, setTitle] = useState(initial?.title ?? "");
    const [start, setStart] = useState(initial?.start ?? "09:00");
    const [end, setEnd] = useState(initial?.end ?? "10:00");
    const [category, setCategory] = useState<Category>(initial?.category ?? "work");
    
    const [freq, setFreq] = useState<Freq>(initial?.repeat.freq ?? "none");
    const [interval, setIntervalValue] = useState(String(initial?.repeat.interval ?? 1));
    const [endType, setEndType] = useState<EndType>(initial?.repeat.end ?? "never");
    const [count, setCount] = useState(String(initial?.repeat.count ?? 10));
    const [until, setUntil] = useState(initial?.repeat.until ?? "");
    const [error, setError] = useState("");

    const repeat: Repeat = {
        freq, interval: Math.max(1, Math.floor(Number(interval)) || 1), end: endType, count: Math.max(1, Math.floor(Number(count)) || 1), until,
    };

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const trimmed = title.trim();
        if(!trimmed){
            setError("Please enter a title.");
            return;
        }
        if(end < start){
            setError("The event can't end before it starts.");
            return;
        }
        if(freq !== "none" && endType === "until" && (!until || until < date)) {
            setError("Choose an end date that is not before the first event.");
            return;
        }
        onSubmit({title: trimmed, start, end, category, repeat});
    }

    const field = "w-full rounded-lg border border-border bg-white px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20";

    return (
        <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-primary/40 bg-white p-3.5 shadow-sm">
            <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && onCancel()}
                placeholder="Event title..."
                aria-label="Event title"
                className={field}
            />

            <div className="grid grid-cols-2 gap-2">
                <label className="text-xs font-semibold text-muted">
                    Start
                    <input type="time" value={start} onChange={(e) => setStart(e.target.value)} className={`${field} mt-1`} />
                </label>
                <label className="text-xs font-semibold text-muted">
                    End
                    <input type="time" value={end} onChange={(e) => setEnd(e.target.value)} className={`${field} mt-1`} />
                </label>
            </div>

            <select value={category} onChange={(e) => setCategory(e.target.value as Category)}
                aria-label="Category" className={field}>
                    {(Object.keys(categories) as Category[]).map((c) => (
                        <option key={c} value={c}>
                            {categories[c].label}
                        </option>
                ))}
            </select>

            {/* Repeat */}
            <div className="space-y-3 border-t border-border pt-3">
                <label className="block text-xs font-semibold text-muted">
                    Repeat
                    <select value={freq} onChange={(e) => setFreq(e.target.value as Freq)}
                        className={`${field} mt-1`}
                    >
                        <option value="none">Don&apos;t repeat</option> 
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                        <option value="yearly">Yearly</option>  
                    </select>
                </label>

                {freq !== "none" && (
                    <>
                        <div className="flex items-center gap-2 text-sm text-muted">
                            <span>Every</span>
                            <input type="number" min={1} value={interval} onChange={(e) => setIntervalValue(e.target.value)} aria-label="Repeat interval" className={`${field} w-20`} />
                            <span>
                                {freqUnit[freq]}
                                {repeat.interval === 1 ? "" : "s"}
                            </span>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-semibold text-muted">
                                Ends
                                <select value={endType} onChange={(e) => setEndType(e.target.value as EndType)} className={`${field} mt-1`}>
                                    <option value="never">Never (forever)</option>
                                    <option value="count">After a number of times</option>
                                    <option value="until">On a date</option>
                                </select>
                            </label>

                            {endType === "count" && (
                                <div className="flex items-center gap-2 text-sm text-muted">
                                    <span>After</span>
                                    <input type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} aria-label="Number of times" className={`${field} w-20`}/>
                                    <span>times</span>
                                </div>
                            )}

                            {endType === "until" && (
                                <input type="date" value={until} min={date} onChange={(e) => setUntil(e.target.value)} aria-label="End date" className={field} />
                            )}
                        </div>

                        <p className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                            <RepeatIcon size={13}/>
                            {describeRepeat(repeat, date)}
                        </p>
                    </>
                )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-2">
                <button type="submit" className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-hover">
                    {initial ? "Save changes" : "Add event"}
                </button>
                <button type="button" onClick={onCancel} className="rounded-lg border border-border px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-surface">
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default function CalendarView() {
    const today = useSyncExternalStore(subscribe, getToday, getServerToday);
    const [events, setEvents] = useState<CalEvent[]>(initialEvents);
    const [viewState, setViewState] = useState<{ y:number, m:number } | null>(null);
    const [selectedState, setSelectedState] = useState<string | null>(null);
    const [adding, setAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    if(!today){
        return <div className="mt-8 h-96 animate-pulse rounded-2xl bg-white/60"/>;
    }

    const t = parseKey(today);
    const view = viewState ?? { y: t.y, m: t.m };
    const selected = selectedState ?? today;

    const eventsOn = (key: string) =>
        events.filter((e) => occursOn(e, key)).sort((a,b) => a.start.localeCompare(b.start));

    const offset = (new Date(view.y, view.m, 1).getDay() + 6) % 7;
    const cells = Array.from({ length: 42}, (_, i) => {
        const d = new Date(view.y, view.m, i -offset + 1);
        return {
            key: toKey(d.getFullYear(), d.getMonth(), d.getDate()),
            day: d.getDate(),
            y: d.getFullYear(),
            m: d.getMonth(),
            inMonth: d.getMonth() === view.m,
        };
    });

    const monthLabel = new Date(view.y, view.m, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const sel = parseKey(selected);
    const selectedLabel = new Date(sel.y, sel.m, sel.d).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });
    const selectedEvents = eventsOn(selected);

    function shiftMonth(delta: number){
        const d = new Date(view.y, view.m + delta, 1);
        setViewState({ y: d.getFullYear(), m: d.getMonth() });
    }

    function goToToday(){
        setViewState(null);
        setSelectedState(null);
    }

    function selectDay(cell: { key: string; y: number; m: number; inMonth: boolean}) {
        setSelectedState(cell.key);
        setAdding(false);
        setEditingId(null);

        if(!cell.inMonth) setViewState({ y:cell.y, m:cell.m});
    }

    function addEvent(input: EventInput) {
        setEvents((current) => [
            ...current,
            { id: crypto.randomUUID(), date: selected, ...input },
        ]);
        setAdding(false);
    }

    function updateEvent(id: string, input: EventInput){
        setEvents((current) => current.map((e) => (e.id === id ? { ...e, ...input } : e)));
        setEditingId(null);
    }

    function deleteEvent(id: string){
        setEvents((current) => current.filter((e) => e.id !== id));
    }

    const navButton = "rounded-lg border border-border bg-white p-2 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary";

    return (
        <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_340px] xl:items-start">
            {/* Month grid */}
            <section aria-label="Month view" className="rounded-2xl border border-border bg-white p-4 sm:p-5">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">{monthLabel}</h2>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={goToToday} className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-semibold text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
                            Today
                        </button>
                        <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className={navButton}>
                            <ChevronLeft size={18}/>
                        </button>
                        <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className={navButton}>
                            <ChevronRight size={18}/>
                        </button>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-7 gap-1 text-center text-xs font-semibold uppercase tracking-wider text-muted">
                    {weekdays.map((day) => (
                        <div key={day} className="py-2">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                    {cells.map((cell) => {
                        const dayEvents = eventsOn(cell.key);
                        const isToday = cell.key === today;
                        const isSelected = cell.key === selected;

                        const visible = dayEvents.length > 2 ? dayEvents.slice(0,1) : dayEvents;
                        const hidden = dayEvents.length - visible.length;

                        return (
                            <button key={cell.key} type="button" onClick={() => selectDay(cell)} aria-pressed={isSelected} aria-label={`${cell.day}, ${dayEvents.length} events`} 
                            className={`flex h-16 flex-col items-stretch overflow-hidden rounded-xl border p-1.5 text-left transition-colors sm:h-28 sm:p-2 xl:h-[max(4rem,calc((100vh_-_24.5rem)/6))] ${
                                isSelected
                                ? "border-primary bg-primary-soft/60 ring-1 ring-primary"
                                : cell.inMonth
                                    ? "border-border hover:bg-primary-hover/5"
                                    : "border-border/60 bg-surface/50 hover:bg-primary-hover/5"
                            }`}>
                                <span className={`flex h-6 w-6 shrink-0 items-center justify-center self-start rounded-full text-xs font-bold leading-none ${
                                    isToday
                                    ? "bg-primary text-white"
                                    : cell.inMonth
                                        ? ""
                                        : "text-muted/60"
                                }`}>
                                    {cell.day}
                                </span>

                                {/* Phones: dots */}
                                <span className={`mt-auto flex flex-wrap gap-1 sm:hidden ${
                                    cell.inMonth ? "" : "opacity-50"
                                }`}>
                                    {dayEvents.slice(0,4).map((ev) => (
                                        <span key={ev.id} className={`h-1.5 w-1.5 rounded-full ${categories[ev.category].dot}`}/>
                                    ))}
                                </span>

                                {/* Larger screens: event chips */}
                                <span className={`mt-1 hidden min-h-0 space-y-1 overflow-hidden sm:block ${
                                    cell.inMonth ? "" : "opacity-50"
                                }`}>
                                    {visible.map((ev) => (
                                        <span key={ev.id} className={`block truncate rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${categories[ev.category].chip}`}>
                                            {ev.title}
                                        </span>
                                    ))}
                                    {hidden > 0 && (
                                        <span className="block px-1.5 text-[11px] font-semibold text-muted">
                                            +{hidden} more
                                        </span>
                                    )}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-5 flex flex-wrap gap-4 border-t border-border pt-4 text-xs text-muted">
                    {(Object.keys(categories) as Category[]).map((c) => (
                        <span key={c} className="flex items-center gap-2">
                            <span className={`h-2.5 w-2.5 rounded-full ${categories[c].dot}`}/>
                            {categories[c].label}
                        </span>
                    ))}
                </div>
            </section>

            <aside aria-label="Selected day" className="rounded-2xl border border-border bg-white p-5 xl:sticky xl:top-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <h2 className="text-lg font-bold">{selectedLabel}</h2>
                        <p className="mt-0.5 text-sm text-muted">
                            {selectedEvents.length === 0
                            ? "No events"
                            : `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""}`}
                        </p>
                    </div>
                    {!adding && (
                        <button type="button" onClick={() => {
                            setEditingId(null);
                            setAdding(true);
                        }} aria-label="Add event" className="rounded-lg bg-primary p-2 text-white transition-colors hover:bg-primary-hover">
                            <Plus size={18}/>
                        </button>
                    )}
                </div>

                <ul className="mt-5 space-y-3">
                    {selectedEvents.map((ev) =>
                    editingId === ev.id ? (
                        <li key={ev.id}>
                            <EventForm date={ev.date} initial={ev} onSubmit={(input) => updateEvent(ev.id, input)} onCancel={() => setEditingId(null)}/>
                        </li>
                    ) : (
                        <li key={ev.id} className="group flex items-center gap-3 rounded-xl border border-border p-3">
                            <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${categories[ev.category].dot}`}/>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-semibold">{ev.title}</p>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                                    <Clock size={13}/>
                                    {formatTime(ev.start)} - {formatTime(ev.end)}
                                </p>
                                {ev.repeat.freq !== "none" && (
                                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
                                        <RepeatIcon size={13}/>
                                        {describeRepeat(ev.repeat, ev.date)}
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center transition-all lg:opacity-0 lg:focus-within:opacity-100 lg:group-hover:opacity-100">
                                <button type="button" onClick={() => {
                                    setAdding(false);
                                    setEditingId(ev.id);
                                }} aria-label={`Edit ${ev.title}`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-primary-hover/10 hover:text-primary">
                                    <Pencil size={16}/>
                                </button>
                                <button type="button" onClick={() => deleteEvent(ev.id)}
                                 aria-label={`Delete ${ev.title}`} className="rounded-md p-1.5 text-muted transition-colors hover:bg-red-50 hover:text-red-500">
                                    <Trash2 size={16}/>
                                </button>
                            </div>
                        </li>
                        )
                    )}

                    {selectedEvents.length === 0 && !adding && (
                        <li className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted">
                            Nothing planned for this day.
                        </li>
                    )}
                </ul>

                {adding && (
                    <div className="mt-4">
                        <EventForm date={selected} onSubmit={addEvent} onCancel={() => setAdding(false)}/>
                    </div>
                )}
            </aside>
        </div>
    );
}