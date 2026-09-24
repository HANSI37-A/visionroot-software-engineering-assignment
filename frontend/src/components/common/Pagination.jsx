import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  pagination,
  onPageChange,
}) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/50 px-5 py-3.5">
      <button
        disabled={!pagination.hasPreviousPage}
        onClick={() => onPageChange(pagination.page - 1)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all"
      >
        <ChevronLeft size={14} />
        Previous
      </button>

      <div className="text-xs font-medium text-slate-500">
        Page <span className="font-semibold text-slate-900">{pagination.page}</span> of{" "}
        <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
        {pagination.totalItems && (
          <span className="hidden sm:inline text-slate-400"> ({pagination.totalItems} total)</span>
        )}
      </div>

      <button
        disabled={!pagination.hasNextPage}
        onClick={() => onPageChange(pagination.page + 1)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:border-slate-200 transition-all"
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;