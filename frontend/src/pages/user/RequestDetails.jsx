import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Pencil,
  XCircle,
  Clock,
  Loader2,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  cancelRequest,
  fetchRequestById,
} from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import StatusBadge from "../../components/common/StatusBadge";
import PriorityBadge from "../../components/common/PriorityBadge";

const RequestDetails = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentRequest,
    loading,
    actionLoading,
    error,
  } = useSelector((state) => state.requests);

  useEffect(() => {
    dispatch(fetchRequestById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this request?"
    );

    if (!confirmed) return;

    try {
      await dispatch(cancelRequest(id)).unwrap();

      toast.success("Request cancelled");
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
        onRetry={() => dispatch(fetchRequestById(id))}
      />
    );
  }

  const canEdit = currentRequest.status === "PENDING";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate("/requests")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Requests</span>
        </button>
      </div>

      {/* Main Ticket Container */}
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

        {/* Metadata Details Grid */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Category</p>
            <p className="mt-1 font-semibold text-slate-800 text-sm flex items-center gap-1.5">
              <Tag size={14} className="text-indigo-600" />
              {currentRequest.category}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Priority Level</p>
            <p className="mt-1 font-semibold text-slate-800 text-sm">
              {currentRequest.priority}
            </p>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Current Status</p>
            <p className="mt-1 font-semibold text-slate-800 text-sm capitalize">
              {currentRequest.status?.toLowerCase().replaceAll("_", " ")}
            </p>
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

        {/* User Actions */}
        {canEdit && (
          <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <button
              disabled={actionLoading}
              onClick={handleCancel}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-4 py-2.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:border-rose-300 disabled:opacity-50 transition-all"
            >
              {actionLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <XCircle size={15} />
                  <span>Cancel Request</span>
                </>
              )}
            </button>

            <Link
              to={`/requests/${id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition-all"
            >
              <Pencil size={14} />
              <span>Edit Request</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetails;