import { AlertCircle, RotateCcw } from "lucide-react";

const ErrorMessage = ({
  message,
  onRetry,
}) => {
  return (
    <div className="rounded-2xl border border-rose-200/80 bg-rose-50/50 p-6 text-center shadow-xs">
      <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 ring-8 ring-rose-50">
        <AlertCircle size={20} />
      </div>

      <h4 className="font-semibold text-rose-950">Action Failed</h4>
      <p className="mt-1 text-sm text-rose-700 max-w-md mx-auto">
        {message || "An unexpected error occurred while processing your request."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-xs hover:bg-rose-700 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 transition-all"
        >
          <RotateCcw size={15} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;