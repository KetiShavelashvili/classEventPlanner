import { useState, useEffect, useRef } from "react";

// ── Seed Data ──────────────────────────────────────────────────────────────
const SEED_EVENTS = [
  {
    id: "e1", title: "Introduction to Algorithms", type: "Lecture",
    date: new Date(Date.now() + 3600000 * 26).toISOString().split("T")[0],
    time: "09:00", course: "Computer Science", location: "Hall A-101",
    description: "Covers sorting algorithms and Big-O notation basics.",
    priority: "High", createdBy: "lecturer",
  },
  {
    id: "e2", title: "Calculus Midterm Exam", type: "Exam",
    date: new Date(Date.now() + 3600000 * 72).toISOString().split("T")[0],
    time: "14:00", course: "Mathematics", location: "Exam Hall B",
    description: "Chapters 1–5. Bring your student ID and calculator.",
    priority: "Critical", createdBy: "lecturer",
  },
  {
    id: "e3", title: "Data Structures Assignment Due", type: "Assignment Deadline",
    date: new Date(Date.now() + 3600000 * 48).toISOString().split("T")[0],
    time: "23:59", course: "Computer Science", location: "Online Submission",
    description: "Submit binary tree implementation via the portal.",
    priority: "High", createdBy: "lecturer",
  },
  {
    id: "e4", title: "Physics Lab Session", type: "Lab Session",
    date: new Date(Date.now() + 3600000 * 120).toISOString().split("T")[0],
    time: "10:30", course: "Physics", location: "Lab C-204",
    description: "Wave optics experiment. Safety goggles required.",
    priority: "Medium", createdBy: "lecturer",
  },
  {
    id: "e5", title: "Office Hours – Prof. Ahmed", type: "Office Hours",
    date: new Date(Date.now() + 3600000 * 8).toISOString().split("T")[0],
    time: "15:00", course: "Mathematics", location: "Room 3-08",
    description: "Open session for midterm questions.",
    priority: "Low", createdBy: "lecturer",
  },
];

const COURSES = ["Computer Science", "Mathematics", "Physics", "Engineering"];
const EVENT_TYPES = ["Lecture", "Exam", "Assignment Deadline", "Lab Session", "Presentation", "Office Hours", "Workshop", "Other"];
const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const PRIORITY_CONFIG = {
  Low:      { color: "#22c55e", bg: "rgba(34,197,94,0.15)",   dot: "#22c55e" },
  Medium:   { color: "#f59e0b", bg: "rgba(245,158,11,0.15)",  dot: "#f59e0b" },
  High:     { color: "#f97316", bg: "rgba(249,115,22,0.15)",  dot: "#f97316" },
  Critical: { color: "#ef4444", bg: "rgba(239,68,68,0.15)",   dot: "#ef4444" },
};

const TYPE_ICONS = {
  Lecture: "📖", Exam: "📝", "Assignment Deadline": "⏰",
  "Lab Session": "🔬", Presentation: "🎤", "Office Hours": "💬",
  Workshop: "🛠️", Other: "📌",
};

function isSoon(event) {
  const now = Date.now();
  const evDate = new Date(`${event.date}T${event.time}`).getTime();
  return evDate > now && evDate - now <= 48 * 3600000;
}

function isToday(event) {
  return event.date === new Date().toISOString().split("T")[0];
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function uid() { return Math.random().toString(36).slice(2, 10); }

// ── Main App ───────────────────────────────────────────────────────────────
export default function App() {
  const [role, setRole] = useState(null); // "lecturer" | "student"
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("acadEvents")) || SEED_EVENTS; }
    catch { return SEED_EVENTS; }
  });

  useEffect(() => { localStorage.setItem("acadEvents", JSON.stringify(events)); }, [events]);

  if (!role) return <LoginScreen onLogin={setRole} />;
  if (role === "lecturer") return <LecturerApp events={events} setEvents={setEvents} onLogout={() => setRole(null)} />;
  return <StudentApp events={events} onLogout={() => setRole(null)} />;
}

// ── Login Screen ───────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [hovered, setHovered] = useState(null);
  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", padding: "2rem" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      {/* decorative grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 520 }}>
        <div style={{ fontSize: 48, marginBottom: "1rem" }}>🎓</div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(2rem, 5vw, 3rem)", color: "#f0f0f8", margin: "0 0 0.5rem", lineHeight: 1.15 }}>
          EduSchedule
        </h1>
        <p style={{ color: "#8b8fa8", fontSize: "1.05rem", marginBottom: "3rem", fontWeight: 300 }}>
          Academic Event & Task Management
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          {[
            { r: "lecturer", icon: "👩‍🏫", label: "Teacher / Lecturer", desc: "Manage events, courses & student workload", accent: "#6366f1" },
            { r: "student",  icon: "🎒",   label: "Student",             desc: "View classes, deadlines & upcoming events",  accent: "#0ea5e9" },
          ].map(({ r, icon, label, desc, accent }) => (
            <button
              key={r}
              onMouseEnter={() => setHovered(r)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => onLogin(r)}
              style={{
                background: hovered === r ? `linear-gradient(135deg, ${accent}22, ${accent}11)` : "rgba(255,255,255,0.03)",
                border: `1.5px solid ${hovered === r ? accent : "rgba(255,255,255,0.08)"}`,
                borderRadius: 16, padding: "1.75rem 1.25rem", cursor: "pointer",
                transition: "all 0.2s ease", transform: hovered === r ? "translateY(-3px)" : "none",
                boxShadow: hovered === r ? `0 8px 32px ${accent}33` : "none",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: "0.75rem" }}>{icon}</div>
              <div style={{ color: "#f0f0f8", fontWeight: 600, fontSize: "1rem", marginBottom: "0.4rem" }}>{label}</div>
              <div style={{ color: "#8b8fa8", fontSize: "0.82rem", lineHeight: 1.5 }}>{desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Lecturer App ───────────────────────────────────────────────────────────
function LecturerApp({ events, setEvents, onLogout }) {
  const [view, setView] = useState("dashboard"); // dashboard | events | workload
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [filters, setFilters] = useState({ type: "", course: "", priority: "" });
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = events
    .filter(e => !filters.type     || e.type === filters.type)
    .filter(e => !filters.course   || e.course === filters.course)
    .filter(e => !filters.priority || e.priority === filters.priority)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const upcomingCount = events.filter(e => new Date(`${e.date}T${e.time}`) > Date.now()).length;
  const soonCount = events.filter(isSoon).length;

  const handleSave = (ev) => {
    if (editTarget) setEvents(prev => prev.map(e => e.id === editTarget.id ? ev : e));
    else setEvents(prev => [...prev, { ...ev, id: uid(), createdBy: "lecturer" }]);
    setShowForm(false); setEditTarget(null);
  };

  const handleDelete = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <Shell role="lecturer" view={view} setView={setView} onLogout={onLogout}
      extra={<button onClick={() => { setEditTarget(null); setShowForm(true); }} style={btnStyle("#6366f1")}>+ New Event</button>}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {view === "dashboard" && (
        <div>
          <SectionTitle>Dashboard</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <StatCard icon="📅" label="Total Events" value={events.length} accent="#6366f1" />
            <StatCard icon="⏳" label="Upcoming" value={upcomingCount} accent="#0ea5e9" />
            <StatCard icon="🔥" label="Due Soon (48h)" value={soonCount} accent="#f97316" />
            <StatCard icon="📚" label="Courses" value={COURSES.length} accent="#22c55e" />
          </div>
          <SectionTitle small>Upcoming Events</SectionTitle>
          <EventGrid events={events.filter(e => new Date(`${e.date}T${e.time}`) > Date.now()).slice(0, 6)}
            onEdit={e => { setEditTarget(e); setShowForm(true); }}
            onDelete={id => setDeleteConfirm(id)} role="lecturer" />
        </div>
      )}

      {view === "events" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <SectionTitle style={{ margin: 0 }}>All Events</SectionTitle>
            <input placeholder="🔍 Search events…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputBase, width: 220, padding: "0.55rem 0.9rem", fontSize: "0.88rem" }} />
          </div>
          <FilterBar filters={filters} setFilters={setFilters} />
          <EventGrid events={filtered}
            onEdit={e => { setEditTarget(e); setShowForm(true); }}
            onDelete={id => setDeleteConfirm(id)} role="lecturer" />
          {filtered.length === 0 && <Empty />}
        </div>
      )}

      {view === "workload" && <WorkloadView events={events} />}

      {showForm && (
        <Modal onClose={() => { setShowForm(false); setEditTarget(null); }}>
          <EventForm initial={editTarget} onSave={handleSave} onCancel={() => { setShowForm(false); setEditTarget(null); }} />
        </Modal>
      )}

      {deleteConfirm && (
        <Modal onClose={() => setDeleteConfirm(null)}>
          <div style={{ textAlign: "center", padding: "1rem" }}>
            <div style={{ fontSize: 40, marginBottom: "1rem" }}>🗑️</div>
            <h3 style={{ color: "#f0f0f8", fontFamily: "'DM Serif Display', serif", marginBottom: "0.5rem" }}>Delete Event?</h3>
            <p style={{ color: "#8b8fa8", marginBottom: "1.5rem" }}>This action cannot be undone.</p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              <button onClick={() => setDeleteConfirm(null)} style={btnStyle("rgba(255,255,255,0.1)")}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} style={btnStyle("#ef4444")}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
    </Shell>
  );
}

// ── Student App ────────────────────────────────────────────────────────────
function StudentApp({ events, onLogout }) {
  const [view, setView] = useState("dashboard");
  const [filters, setFilters] = useState({ type: "", course: "", priority: "" });
  const [search, setSearch] = useState("");

  const upcoming = events
    .filter(e => new Date(`${e.date}T${e.time}`) > Date.now())
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  const filtered = events
    .filter(e => !filters.type     || e.type === filters.type)
    .filter(e => !filters.course   || e.course === filters.course)
    .filter(e => !filters.priority || e.priority === filters.priority)
    .filter(e => !search || e.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));

  return (
    <Shell role="student" view={view} setView={setView} onLogout={onLogout}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {view === "dashboard" && (
        <div>
          <SectionTitle>My Schedule</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
            <StatCard icon="📚" label="Total Classes" value={events.length} accent="#0ea5e9" />
            <StatCard icon="⏳" label="Upcoming" value={upcoming.length} accent="#6366f1" />
            <StatCard icon="🔥" label="Due in 48h" value={events.filter(isSoon).length} accent="#f97316" />
            <StatCard icon="📝" label="Exams Ahead" value={upcoming.filter(e => e.type === "Exam").length} accent="#ef4444" />
          </div>
          <SectionTitle small>Coming Up Next</SectionTitle>
          <EventGrid events={upcoming.slice(0, 6)} role="student" />
        </div>
      )}

      {view === "events" && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
            <SectionTitle style={{ margin: 0 }}>All Events</SectionTitle>
            <input placeholder="🔍 Search…" value={search} onChange={e => setSearch(e.target.value)}
              style={{ ...inputBase, width: 200, padding: "0.55rem 0.9rem", fontSize: "0.88rem" }} />
          </div>
          <FilterBar filters={filters} setFilters={setFilters} />
          <EventGrid events={filtered} role="student" />
          {filtered.length === 0 && <Empty />}
        </div>
      )}

      {view === "workload" && <WorkloadView events={events} readOnly />}
    </Shell>
  );
}

// ── Shell Layout ───────────────────────────────────────────────────────────
function Shell({ children, role, view, setView, onLogout, extra }) {
  const accent = role === "lecturer" ? "#6366f1" : "#0ea5e9";
  const navItems = [
    { id: "dashboard", icon: "⊞", label: "Dashboard" },
    { id: "events",    icon: "📅", label: "Events" },
    { id: "workload",  icon: "📊", label: role === "lecturer" ? "Workload" : "Overview" },
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0d1117", fontFamily: "'DM Sans', sans-serif", color: "#f0f0f8" }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: "#111827", borderRight: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", padding: "1.5rem 1rem", flexShrink: 0 }}>
        <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <div style={{ fontSize: 22, marginBottom: 4 }}>🎓</div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "#f0f0f8" }}>EduSchedule</div>
          <div style={{ fontSize: "0.75rem", color: accent, fontWeight: 500, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {role === "lecturer" ? "Teacher / Lecturer" : "Student"}
          </div>
        </div>
        <nav style={{ flex: 1 }}>
          {navItems.map(({ id, icon, label }) => (
            <button key={id} onClick={() => setView(id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.65rem", width: "100%",
                padding: "0.65rem 0.75rem", borderRadius: 10, border: "none", cursor: "pointer",
                background: view === id ? `${accent}22` : "transparent",
                color: view === id ? accent : "#8b8fa8",
                fontWeight: view === id ? 600 : 400, fontSize: "0.9rem",
                transition: "all 0.15s", marginBottom: "0.25rem",
                borderLeft: view === id ? `3px solid ${accent}` : "3px solid transparent",
              }}
            >
              <span>{icon}</span>{label}
            </button>
          ))}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
          <button onClick={onLogout}
            style={{ display: "flex", alignItems: "center", gap: "0.65rem", width: "100%", padding: "0.65rem 0.75rem", borderRadius: 10, border: "none", cursor: "pointer", background: "transparent", color: "#8b8fa8", fontSize: "0.9rem", transition: "color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.color = "#ef4444"}
            onMouseLeave={e => e.currentTarget.style.color = "#8b8fa8"}
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "2rem", maxWidth: "100%" }}>
        {extra && <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1.5rem" }}>{extra}</div>}
        {children}
      </main>
    </div>
  );
}

// ── Event Grid ─────────────────────────────────────────────────────────────
function EventGrid({ events, onEdit, onDelete, role }) {
  if (!events.length) return <Empty />;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
      {events.map(e => <EventCard key={e.id} event={e} onEdit={onEdit} onDelete={onDelete} role={role} />)}
    </div>
  );
}

function EventCard({ event, onEdit, onDelete, role }) {
  const pc = PRIORITY_CONFIG[event.priority] || PRIORITY_CONFIG.Medium;
  const soon = isSoon(event);
  const today = isToday(event);
  const past = new Date(`${event.date}T${event.time}`) < Date.now();

  return (
    <div style={{
      background: "#111827", border: `1px solid ${soon ? "#f9731655" : "rgba(255,255,255,0.07)"}`,
      borderRadius: 14, padding: "1.25rem", position: "relative", overflow: "hidden",
      opacity: past ? 0.55 : 1, transition: "transform 0.15s, box-shadow 0.15s",
      boxShadow: soon ? "0 0 20px rgba(249,115,22,0.15)" : "none",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.35)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = soon ? "0 0 20px rgba(249,115,22,0.15)" : "none"; }}
    >
      {soon && !past && (
        <div style={{ position: "absolute", top: 10, right: 10, background: "#f97316", color: "#fff", fontSize: "0.65rem", fontWeight: 700, padding: "2px 8px", borderRadius: 999, letterSpacing: "0.05em" }}>SOON</div>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", marginBottom: "0.75rem" }}>
        <span style={{ fontSize: 22 }}>{TYPE_ICONS[event.type] || "📌"}</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f0f0f8", lineHeight: 1.35 }}>{event.title}</div>
          <div style={{ fontSize: "0.78rem", color: "#6b7280", marginTop: 2 }}>{event.type}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.75rem" }}>
        <Tag icon="📅">{formatDate(event.date)} {event.time}</Tag>
        <Tag icon="📚">{event.course}</Tag>
        <Tag icon="📍">{event.location}</Tag>
      </div>
      {event.description && (
        <p style={{ fontSize: "0.82rem", color: "#9ca3af", lineHeight: 1.5, marginBottom: "0.75rem", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {event.description}
        </p>
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.75rem", fontWeight: 600, color: pc.color, background: pc.bg, padding: "3px 10px", borderRadius: 999 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: pc.dot, display: "inline-block" }} />
          {event.priority}
        </span>
        {role === "lecturer" && (
          <div style={{ display: "flex", gap: "0.4rem" }}>
            <IconBtn onClick={() => onEdit(event)} title="Edit">✏️</IconBtn>
            <IconBtn onClick={() => onDelete(event.id)} title="Delete" danger>🗑️</IconBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Event Form ─────────────────────────────────────────────────────────────
function EventForm({ initial, onSave, onCancel }) {
  const today = new Date().toISOString().split("T")[0];
  const [form, setForm] = useState(initial || { title: "", type: "Lecture", date: "", time: "", course: COURSES[0], location: "", description: "", priority: "Medium" });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title || form.title.length < 3) e.title = "Title must be at least 3 characters";
    if (!form.date) e.date = "Date is required";
    else if (form.date < today) e.date = "Cannot select a past date";
    if (!form.time) e.time = "Time is required";
    if (!form.location) e.location = "Location is required";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave(form);
  };

  return (
    <div style={{ minWidth: 360, maxWidth: 480 }}>
      <h3 style={{ fontFamily: "'DM Serif Display', serif", color: "#f0f0f8", marginBottom: "1.5rem", fontSize: "1.3rem" }}>
        {initial ? "Edit Event" : "New Event"}
      </h3>
      <FormRow label="Title" error={errors.title}>
        <input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Event title…" style={inputBase} />
      </FormRow>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
        <FormRow label="Type">
          <select value={form.type} onChange={e => set("type", e.target.value)} style={inputBase}>
            {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
        </FormRow>
        <FormRow label="Priority">
          <select value={form.priority} onChange={e => set("priority", e.target.value)} style={inputBase}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </FormRow>
        <FormRow label="Date" error={errors.date}>
          <input type="date" value={form.date} min={today} onChange={e => set("date", e.target.value)} style={inputBase} />
        </FormRow>
        <FormRow label="Time" error={errors.time}>
          <input type="time" value={form.time} onChange={e => set("time", e.target.value)} style={inputBase} />
        </FormRow>
      </div>
      <FormRow label="Course">
        <select value={form.course} onChange={e => set("course", e.target.value)} style={inputBase}>
          {COURSES.map(c => <option key={c}>{c}</option>)}
        </select>
      </FormRow>
      <FormRow label="Location" error={errors.location}>
        <input value={form.location} onChange={e => set("location", e.target.value)} placeholder="Room / Online…" style={inputBase} />
      </FormRow>
      <FormRow label="Description">
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} placeholder="Optional details…" style={{ ...inputBase, resize: "vertical" }} />
      </FormRow>
      <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end", marginTop: "1.5rem" }}>
        <button onClick={onCancel} style={btnStyle("rgba(255,255,255,0.08)")}>Cancel</button>
        <button onClick={handleSubmit} style={btnStyle("#6366f1")}>Save Event</button>
      </div>
    </div>
  );
}

// ── Workload View ──────────────────────────────────────────────────────────
function WorkloadView({ events, readOnly }) {
  const byType = EVENT_TYPES.reduce((acc, t) => ({ ...acc, [t]: events.filter(e => e.type === t).length }), {});
  const byCourse = COURSES.reduce((acc, c) => ({ ...acc, [c]: events.filter(e => e.course === c).length }), {});
  const max = Math.max(...Object.values(byCourse), 1);

  return (
    <div>
      <SectionTitle>{readOnly ? "Course Overview" : "Workload Management"}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {/* By Course */}
        <Panel title="Events by Course" icon="📚">
          {COURSES.map(c => (
            <div key={c} style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", color: "#d1d5db", marginBottom: 6 }}>
                <span>{c}</span><span style={{ fontWeight: 600 }}>{byCourse[c]}</span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 999, height: 7, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "linear-gradient(90deg, #6366f1, #0ea5e9)", borderRadius: 999, width: `${(byCourse[c] / max) * 100}%`, transition: "width 0.5s ease" }} />
              </div>
            </div>
          ))}
        </Panel>

        {/* By Type */}
        <Panel title="Events by Type" icon="🗂️">
          {EVENT_TYPES.filter(t => byType[t] > 0).map(t => (
            <div key={t} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: "0.88rem", color: "#d1d5db" }}>{TYPE_ICONS[t]} {t}</span>
              <span style={{ fontWeight: 600, color: "#f0f0f8", background: "rgba(255,255,255,0.08)", padding: "2px 10px", borderRadius: 999, fontSize: "0.82rem" }}>{byType[t]}</span>
            </div>
          ))}
        </Panel>

        {/* Priority breakdown */}
        <Panel title="Priority Breakdown" icon="⚡">
          {PRIORITIES.map(p => {
            const pc = PRIORITY_CONFIG[p];
            const cnt = events.filter(e => e.priority === p).length;
            return (
              <div key={p} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.55rem 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.88rem" }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: pc.dot }} />
                  <span style={{ color: "#d1d5db" }}>{p}</span>
                </span>
                <span style={{ fontWeight: 600, color: pc.color, background: pc.bg, padding: "2px 10px", borderRadius: 999, fontSize: "0.82rem" }}>{cnt}</span>
              </div>
            );
          })}
        </Panel>
      </div>
    </div>
  );
}

// ── Shared Small Components ────────────────────────────────────────────────
function SectionTitle({ children, small, style }) {
  return <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: small ? "1.1rem" : "1.5rem", color: "#f0f0f8", margin: "0 0 1rem", ...style }}>{children}</h2>;
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem 1.5rem" }}>
      <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>{icon}</div>
      <div style={{ fontSize: "1.75rem", fontWeight: 700, color: accent, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ fontSize: "0.82rem", color: "#6b7280", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function FilterBar({ filters, setFilters }) {
  const sf = (k, v) => setFilters(f => ({ ...f, [k]: v }));
  const selectStyle = { ...inputBase, fontSize: "0.82rem", padding: "0.5rem 0.75rem" };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginBottom: "1.25rem" }}>
      <select value={filters.type} onChange={e => sf("type", e.target.value)} style={selectStyle}>
        <option value="">All Types</option>
        {EVENT_TYPES.map(t => <option key={t}>{t}</option>)}
      </select>
      <select value={filters.course} onChange={e => sf("course", e.target.value)} style={selectStyle}>
        <option value="">All Courses</option>
        {COURSES.map(c => <option key={c}>{c}</option>)}
      </select>
      <select value={filters.priority} onChange={e => sf("priority", e.target.value)} style={selectStyle}>
        <option value="">All Priorities</option>
        {PRIORITIES.map(p => <option key={p}>{p}</option>)}
      </select>
      {(filters.type || filters.course || filters.priority) && (
        <button onClick={() => setFilters({ type: "", course: "", priority: "" })} style={{ ...btnStyle("rgba(239,68,68,0.15)"), color: "#ef4444", fontSize: "0.82rem", padding: "0.5rem 0.85rem" }}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}

function Tag({ icon, children }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "0.73rem", color: "#9ca3af", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: 6 }}>
      {icon && <span>{icon}</span>}{children}
    </span>
  );
}

function IconBtn({ onClick, children, title, danger }) {
  return (
    <button onClick={onClick} title={title}
      style={{ background: "rgba(255,255,255,0.05)", border: "none", borderRadius: 8, padding: "5px 8px", cursor: "pointer", fontSize: "0.85rem", transition: "background 0.15s" }}
      onMouseEnter={e => e.currentTarget.style.background = danger ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.12)"}
      onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
    >{children}</button>
  );
}

function FormRow({ label, children, error }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <label style={{ display: "block", fontSize: "0.8rem", color: "#9ca3af", marginBottom: "0.4rem", fontWeight: 500 }}>{label}</label>
      {children}
      {error && <div style={{ fontSize: "0.75rem", color: "#ef4444", marginTop: 4 }}>{error}</div>}
    </div>
  );
}

function Panel({ title, icon, children }) {
  return (
    <div style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.25rem" }}>
      <div style={{ fontWeight: 600, color: "#f0f0f8", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span>{icon}</span>{title}
      </div>
      {children}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "1rem" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, padding: "2rem", maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 520 }}>
        {children}
      </div>
    </div>
  );
}

function Empty() {
  return (
    <div style={{ textAlign: "center", padding: "4rem 2rem", color: "#4b5563" }}>
      <div style={{ fontSize: 48, marginBottom: "0.75rem" }}>📭</div>
      <div style={{ fontSize: "1rem" }}>No events found</div>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const inputBase = {
  width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10, padding: "0.65rem 0.9rem", color: "#f0f0f8", fontSize: "0.9rem",
  outline: "none", fontFamily: "'DM Sans', sans-serif", boxSizing: "border-box",
};

function btnStyle(bg) {
  return {
    background: bg, border: "none", borderRadius: 10, padding: "0.65rem 1.25rem",
    color: "#f0f0f8", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif", transition: "opacity 0.15s",
  };
}
