const styles = {
  PENDING: {
    badge: "bg-amber-50 text-amber-700 border-amber-200/80 shadow-[0_1px_2px_rgba(245,158,11,0.08)]",
    dot: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
  },
  IN_PROGRESS: {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-200/80 shadow-[0_1px_2px_rgba(99,102,241,0.08)]",
    dot: "bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.4)]",
  },
  RESOLVED: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200/80 shadow-[0_1px_2px_rgba(16,185,129,0.08)]",
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
  },
  CANCELLED: {
    badge: "bg-rose-50 text-rose-700 border-rose-200/80 shadow-[0_1px_2px_rgba(244,63,94,0.08)]",
    dot: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]",
  },
};

const StatusBadge = ({ status }) => {
  const current = styles[status] || {
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${current.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      {status?.replaceAll("_", " ")}
    </span>
  );
};

export default StatusBadge;