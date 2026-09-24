const styles = {
  LOW: "bg-slate-100/80 text-slate-700 border-slate-200/80",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200/80",
  HIGH: "bg-rose-50 text-rose-700 border-rose-200/80 font-bold",
};

const PriorityBadge = ({ priority }) => {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
        styles[priority] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {priority}
    </span>
  );
};

export default PriorityBadge;