import {
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Tag,
  User,
  Mail,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
  Loader2,
  Workflow,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  changeRequestStatus,
  fetchRequestById,
} from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";

const allowedTransitions = {
  PENDING: [
    "IN_PROGRESS",
    "CANCELLED",
  ],
  IN_PROGRESS: [
    "RESOLVED",
    "CANCELLED",
  ],
  RESOLVED: [],
  CANCELLED: [],
};

const AdminRequestDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentRequest,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.requests);

  const [nextStatus, setNextStatus] = useState("");

  useEffect(() => {
    dispatch(fetchRequestById(id));
  }, [dispatch, id]);

  const handleStatusUpdate = async () => {
    if (!nextStatus) {
      return;
    }

    try {
      await dispatch(
        changeRequestStatus({
          id,
          status: nextStatus,
        })
      ).unwrap();

      toast.success("Status updated successfully");

      setNextStatus("");
    } catch (error) {
      toast.error(error);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !currentRequest) {
    return (
      <ErrorMessage
        message={error || "Request not found"}
      />
    );
  }

  const nextStates =
    allowedTransitions[currentRequest.status] || [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate("/admin/requests")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to All Requests</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Ticket Header */}
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-600">
                TICKET #{currentRequest._id?.slice(-6).toUpperCase()}
              </span>
              <StatusBadge status={currentRequest.status} />
              <PriorityBadge priority={currentRequest.priority} />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {currentRequest.title}
            </h1>

            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar size={14} className="text-slate-400" />
              <span>Created on {new Date(currentRequest.createdAt).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Requester Profile & Metadata Card */}
        <div className="grid gap-4 sm:grid-cols-2">
          {/* User Info */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Customer / Requester Details
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 font-bold text-sm">
                {currentRequest.user?.name ? currentRequest.user.name.slice(0, 1).toUpperCase() : "U"}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 text-sm truncate">
                  {currentRequest.user?.name || "Unknown User"}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {currentRequest.user?.email || "No email available"}
                </p>
              </div>
            </div>
          </div>

          {/* Classification */}
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 flex flex-col justify-between">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Ticket Categorization
            </p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs text-slate-500">Category</span>
              <span className="font-semibold text-slate-800 flex items-center gap-1">
                <Tag size={13} className="text-indigo-600" />
                {currentRequest.category}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-xs text-slate-500">Priority Level</span>
              <span className="font-semibold text-slate-800">
                {currentRequest.priority}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <FileText size={16} className="text-indigo-600" />
            <span>Problem Description</span>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/30 p-5 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap font-normal">
            {currentRequest.description}
          </div>
        </div>

        {/* Status Workflow Action Box */}
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Workflow size={17} className="text-indigo-600" />
            <span>Workflow & Lifecycle Management</span>
          </div>

          {nextStates.length === 0 ? (
            <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-4 text-xs font-medium text-slate-600">
              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
              <span>
                This request has reached terminal status ({currentRequest.status?.toLowerCase()}). No further transitions are permissible.
              </span>
            </div>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <select
                  value={nextStatus}
                  onChange={(event) => setNextStatus(event.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                >
                  <option value="">Choose next lifecycle status...</option>
                  {nextStates.map((status) => (
                    <option key={status} value={status}>
                      Mark as {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <button
                disabled={!nextStatus || actionLoading}
                onClick={handleStatusUpdate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 disabled:opacity-50 transition-all sm:w-auto"
              >
                {actionLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Status</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminRequestDetails;