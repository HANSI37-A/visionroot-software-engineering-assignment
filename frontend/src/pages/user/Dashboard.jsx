import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Clock,
  LoaderCircle,
  CircleCheck,
  XCircle,
  PlusCircle,
  Layers,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { fetchRequests } from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(
      fetchRequests({
        page: 1,
        limit: 100,
      })
    );
  }, [dispatch]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() =>
          dispatch(
            fetchRequests({
              page: 1,
              limit: 100,
            })
          )
        }
      />
    );
  }

  const stats = {
    total: items.length,
    pending: items.filter((item) => item.status === "PENDING").length,
    inProgress: items.filter((item) => item.status === "IN_PROGRESS").length,
    resolved: items.filter((item) => item.status === "RESOLVED").length,
    cancelled: items.filter((item) => item.status === "CANCELLED").length,
  };

  const cards = [
    {
      title: "Total Requests",
      value: stats.total,
      icon: Layers,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      accent: "from-indigo-500 to-indigo-600",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      accent: "from-amber-400 to-amber-500",
    },
    {
      title: "In Progress",
      value: stats.inProgress,
      icon: LoaderCircle,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      accent: "from-blue-500 to-blue-600",
    },
    {
      title: "Resolved",
      value: stats.resolved,
      icon: CircleCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      accent: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      icon: XCircle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      accent: "from-rose-500 to-rose-600",
    },
  ];

  const recentRequests = items.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm ring-1 ring-white/10 mb-3">
              <TrendingUp size={13} className="text-emerald-400" />
              <span>Service Center Overview</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Hello, {user?.name || "Service User"}
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              Track real-time status of your support tickets and enterprise service requests.
            </p>
          </div>

          <Link
            to="/requests/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:shadow-indigo-600/40 transition-all duration-200"
          >
            <PlusCircle size={18} />
            <span>Create New Request</span>
          </Link>
        </div>

        {/* Ambient glow decoration */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map(({ title, value, icon: Icon, color }) => (
          <div
            key={title}
            className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${color} transition-transform group-hover:scale-105`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests Section */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Service Requests</h2>
            <p className="text-xs text-slate-500">Latest tickets raised from your account</p>
          </div>
          <Link
            to="/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {recentRequests.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No service requests found. Click "Create New Request" above to get started.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-3.5">Request Details</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRequests.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/requests/${item._id}`}
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;