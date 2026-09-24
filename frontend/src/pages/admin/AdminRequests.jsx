import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Search, ChevronRight, User, Filter, SlidersHorizontal } from "lucide-react";
import { fetchRequests } from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import Pagination from "../../components/common/Pagination";

const AdminRequests = () => {
  const dispatch = useDispatch();

  const {
    items,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.requests);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    category: "",
    priority: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );

      dispatch(fetchRequests(params));
    }, 300);

    return () => clearTimeout(timeout);
  }, [dispatch, filters]);

  const handleFilterChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
      page: 1,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((previous) => ({
      ...previous,
      page,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          All Service Requests
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Filter, triage, and manage all organization-wide service desk tickets.
        </p>
      </div>

      {/* Filter Toolbar Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {/* Search bar */}
          <div className="relative sm:col-span-2 lg:col-span-2">
            <Search
              size={16}
              className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
            />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by ticket title..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">All Categories</option>
              <option value="TECHNICAL">Technical</option>
              <option value="BILLING">Billing</option>
              <option value="ACCOUNT">Account</option>
              <option value="OTHER">Other</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              name="priority"
              value={filters.priority}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">All Priorities</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <select
              name="sortOrder"
              value={filters.sortOrder}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} />
      ) : items.length === 0 ? (
        <EmptyState
          title="No matching requests found"
          description="Adjust your search keyword or clear one of the filters to see results."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Request Subject</th>
                  <th className="px-6 py-4">Requester</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {items.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/admin/requests/${item._id}`}
                        className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors block"
                      >
                        {item.title}
                      </Link>
                      <span className="text-[11px] font-mono text-slate-400">
                        #{item._id.slice(-6).toUpperCase()}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                          {item.user?.name ? item.user.name.slice(0, 1).toUpperCase() : "U"}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-900 leading-tight">
                            {item.user?.name || "Unknown"}
                          </p>
                          <p className="text-[11px] text-slate-500 leading-none mt-0.5">
                            {item.user?.email}
                          </p>
                        </div>
                      </div>
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

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/requests/${item._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <span>Manage</span>
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {items.map((item) => (
              <Link
                key={item._id}
                to={`/admin/requests/${item._id}`}
                className="block p-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      By {item.user?.name || "Unknown"}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate-400 shrink-0 mt-0.5" />
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={item.priority} />
                  <StatusBadge status={item.status} />
                  <span className="text-[11px] text-slate-400 font-medium ml-auto">
                    {item.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default AdminRequests;