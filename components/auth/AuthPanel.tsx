import { Bell, CalendarDays, Check } from "lucide-react";

const tasks = [
  { text: "Plan the week", done: true},
  { text: "Finish project report", done:true},
  { text: "Buy groceries", done: false},
];

const days = ["M", "T" , "W", "T", "F", "S", "S"];

export default function AuthPanel() {
  return(
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-linear-to-br from-primary via-[#6e6ee0] to-[#8c8cf0] p-12">
      <div className="pointer-events-none absolute -right-20 -top-16 h-72 w-72 rounded-full bg-white/10"/>
      <div className="pointer-events-none absolute -bottom-24 -left-20 h-96 w-96 rounded-full bg-white/10"/>
      <div className="pointer-events-none absolute right-12 top-1/2 h-40 w-40 rounded-full border-2 border-white/15"/>
      <div className="pointer-events-none absolute left-10 top-24 h-6 w-6 rounded-full bg-white/20"/>
    
    <div className="relative w-full max-w-sm">
      {/* Tasks card */}
      <div className="auth-float rounded-2xl bg-white p-5 shadow-xl">
        <p className="text-sm font-bold">Today</p>
        <ul className="mt-3 space-y-2.5">
          {tasks.map((task) => (
            <li key={task.text} className="flex items-center gap-3 text-sm">
              <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                task.done
                ? "border-primary bg-primary text-white"
                : "border-border"
              }`}>
                {task.done && <Check size={12}/>}
              </span>
              <span className={task.done ? "text-muted line-through" : ""}>{task.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reminder card */}
      <div className="auth-float ml-10 mt-5 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-xl [animation-delay:-2s]">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
          <Bell size={20}/>
        </span>
        <div>
          <p className="text-sm font-bold">Team meeting</p>
          <p className="text-xs text-muted">Today, 14:00</p>
        </div>
      </div>

      {/* Calendar card */}
      <div className="auth-float mr-10 mt-5 rounded-2xl bg-white p-4 shadow-xl [animation-delay:-4s]">
        <div className="flex items-center gap-2 text-sm font-bold">
          <CalendarDays size={16} className="text-primary"/>
          This week
        </div>
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-xs">
          {days.map((day,i) => (
            <div key={i} className="spacy-y-1">
              <p className="text-muted">{day}</p>
              <p className={`rounded-lg py-1.5 font-semibold ${
                i === 2 ? "bg-primary text-white" : ""
              }`}>{12 + i}</p>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-10 text-center text-sm font-semibold text-white/90">Your whole day, at a glance.</p>
    </div>
    </div>
  );
}