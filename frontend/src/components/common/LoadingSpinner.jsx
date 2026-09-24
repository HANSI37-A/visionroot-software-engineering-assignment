const LoadingSpinner = () => {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 py-12">
      <div className="relative flex items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-100 border-t-indigo-600" />
        <div className="absolute h-2 w-2 rounded-full bg-indigo-600/40 animate-ping" />
      </div>
      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Loading data...</p>
    </div>
  );
};

export default LoadingSpinner;