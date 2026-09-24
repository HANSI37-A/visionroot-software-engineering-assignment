import {
  useEffect,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Plus, ChevronRight, Calendar, Tag } from "lucide-react";
import { fetchRequests } from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";
import Pagination from "../../components/common/Pagination";

const Requests = () => {
  const dispatch = useDispatch();

  const {
    items,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.requests);

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(
      fetchRequests({
        page,
        limit: 10,
      })
    );
  }, [dispatch, page]);

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
              page,
              limit: 10,
            })
          )
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Service Requests
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track, review and manage your submitted support tickets.
          </p>
        </div>

        <Link
          to="/requests/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
        >
          <Plus size={18} />
          <span>New Request</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="No requests yet"
          description="You haven't submitted any service requests yet. Create your first request to get assistance."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200/80">
                <tr>
                  <th className="px-6 py-4">Request Subject</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date Created</th>
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
                        to={`/requests/${item._id}`}
                        className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        <Tag size={12} className="text-slate-400" />
                        {item.category}
                      </span>
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

                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/requests/${item._id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                      >
                        <span>View</span>
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
                to={`/requests/${item._id}`}
                className="block p-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-slate-900 text-sm">
                    {item.title}
                  </h3>
                  <ChevronRight size={16} className="text-slate-400 shrink-0 mt-0.5" />
                </div>

                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-600">{item.category}</span>
                  <span>•</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={item.priority} />
                  <StatusBadge status={item.status} />
                </div>
              </Link>
            ))}
          </div>

          <Pagination
            pagination={pagination}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Requests;