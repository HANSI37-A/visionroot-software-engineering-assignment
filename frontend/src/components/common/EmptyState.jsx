import { FolderOpen } from "lucide-react";

const EmptyState = ({
  title = "Nothing here yet",
  description = "There is currently no data to display.",
}) => {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300/80 bg-slate-50/50 p-12 text-center">
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white border border-slate-200 shadow-xs text-slate-400">
        <FolderOpen size={24} className="stroke-[1.5]" />
      </div>

      <h3 className="text-base font-semibold text-slate-900 tracking-tight">
        {title}
      </h3>

      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;