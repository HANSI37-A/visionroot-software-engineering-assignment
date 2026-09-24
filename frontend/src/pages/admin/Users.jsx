import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { Search, Shield, User, CheckCircle2, UserX, UserCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isActive: "",
    page: 1,
    limit: 10,
  });

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );

      const response = await api.get("/users", { params });

      setUsers(response.data.data?.users || []);
      setPagination(response.data.pagination);
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadUsers();
    }, 300);

    return () => clearTimeout(timeout);
  }, [loadUsers]);

  const handleFilterChange = (event) => {
    setFilters((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
      page: 1,
    }));
  };

  const handleToggle = async (user) => {
    try {
      setUpdatingId(user._id);

      await api.patch(`/users/${user._id}`, {
        isActive: !user.isActive,
      });

      toast.success(
        user.isActive ? "User deactivated" : "User activated"
      );

      await loadUsers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          User Management
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage system users, access privileges, roles, and account statuses.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-3 text-slate-400 pointer-events-none"
            />
            <input
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by name or email..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">All Roles</option>
              <option value="USER">Standard User</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>

          <div>
            <select
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-xs sm:text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            >
              <option value="">All Account Statuses</option>
              <option value="true">Active Accounts Only</option>
              <option value="false">Inactive / Deactivated Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={loadUsers} />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users found"
          description="Try broadening your search term or adjusting filters."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">System Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Access Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-700">
                          {user.name ? user.name.slice(0, 2).toUpperCase() : "US"}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200/80"
                            : "bg-slate-100 text-slate-700 border border-slate-200/80"
                        }`}
                      >
                        {user.role === "ADMIN" ? <Shield size={12} /> : <User size={12} />}
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${
                          user.isActive
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${
                            user.isActive ? "bg-emerald-500" : "bg-rose-500"
                          }`}
                        />
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        disabled={updatingId === user._id}
                        onClick={() => handleToggle(user)}
                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-semibold shadow-xs disabled:opacity-50 transition-all ${
                          user.isActive
                            ? "border-rose-200 bg-rose-50/50 text-rose-700 hover:bg-rose-100 hover:border-rose-300"
                            : "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300"
                        }`}
                      >
                        {updatingId === user._id ? (
                          <>
                            <Loader2 size={13} className="animate-spin" />
                            <span>Updating...</span>
                          </>
                        ) : user.isActive ? (
                          <>
                            <UserX size={14} />
                            <span>Deactivate</span>
                          </>
                        ) : (
                          <>
                            <UserCheck size={14} />
                            <span>Activate</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {users.map((user) => (
              <div key={user._id} className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      {user.name}
                    </h3>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase ${
                      user.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-medium text-slate-500">
                    Role: <span className="font-semibold text-slate-800">{user.role}</span>
                  </span>

                  <button
                    disabled={updatingId === user._id}
                    onClick={() => handleToggle(user)}
                    className={`rounded-lg border px-3 py-1 text-xs font-semibold ${
                      user.isActive
                        ? "border-rose-200 bg-rose-50 text-rose-700"
                        : "border-emerald-200 bg-emerald-50 text-emerald-700"
                    }`}
                  >
                    {updatingId === user._id
                      ? "Updating..."
                      : user.isActive
                      ? "Deactivate"
                      : "Activate"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={(page) =>
              setFilters((previous) => ({
                ...previous,
                page,
              }))
            }
          />
        </div>
      )}
    </div>
  );
};

export default Users;