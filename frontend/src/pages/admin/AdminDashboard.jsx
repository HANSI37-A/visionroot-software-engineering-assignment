import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ClipboardList,
  Clock,
  CircleCheck,
  LoaderCircle,
  Shield,
  ArrowRight,
  Users,
  AlertCircle,
} from "lucide-react";
import { fetchRequests } from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";

const AdminDashboard = () => {
  const dispatch = useDispatch();

  const { items, loading, error } = useSelector((state) => state.requests);

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
    return <ErrorMessage message={error} />;
  }

  const cards = [
    {
      title: "Total Requests",
      value: items.length,
      icon: ClipboardList,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      description: "Across all enterprise users",
    },
    {
      title: "Pending",
      value: items.filter((r) => r.status === "PENDING").length,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      description: "Awaiting administrator review",
    },
    {
      title: "In Progress",
      value: items.filter((r) => r.status === "IN_PROGRESS").length,
      icon: LoaderCircle,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      description: "Currently being resolved",
    },
    {
      title: "Resolved",
      value: items.filter((r) => r.status === "RESOLVED").length,
      icon: CircleCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      description: "Closed successfully",
    },
  ];

  const pendingQueue = items.filter((r) => r.status === "PENDING").slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-sm ring-1 ring-white/10 mb-3 text-indigo-300">
              <Shield size={13} />
              <span>Admin Operations Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Service Desk Management
            </h1>
            <p className="mt-1 text-sm text-slate-300 max-w-xl">
              System-wide oversight of enterprise support queues, active tickets, and user accounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/requests"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all"
            >
              <ClipboardList size={16} />
              <span>All Requests</span>
            </Link>

            <Link
              to="/admin/users"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 hover:text-white transition-all"
            >
              <Users size={16} />
              <span>Manage Users</span>
            </Link>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ title, value, icon: Icon, color, description }) => (
          <div
            key={title}
            className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {title}
              </span>
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${color} transition-transform group-hover:scale-105`}>
                <Icon size={18} />
              </div>
            </div>

            <div className="mt-4">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                {value}
              </span>
              <p className="mt-1 text-xs text-slate-400">{description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Priority Action Queue */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200/80 px-6 py-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Pending Review Queue</h2>
            <p className="text-xs text-slate-500">Service requests requiring assignment or triage</p>
          </div>
          <Link
            to="/admin/requests"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View Full Queue</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {pendingQueue.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">
            No requests currently in pending status. All queues are up to date!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-200/60">
                <tr>
                  <th className="px-6 py-3.5">Request Title</th>
                  <th className="px-6 py-3.5">Requested By</th>
                  <th className="px-6 py-3.5">Priority</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendingQueue.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/requests/${item._id}`}
                        className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {item.user?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-slate-600">
                      {item.category}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/requests/${item._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <span>Review</span>
                        <ArrowRight size={14} />
                      </Link>
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

export default AdminDashboard;