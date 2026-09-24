import {
  useEffect,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  useNavigate,
  useParams,
  Link,
} from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  fetchRequestById,
  updateRequest,
} from "../../features/requests/requestSlice";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditRequest = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    currentRequest,
    loading,
    actionLoading,
  } = useSelector((state) => state.requests);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  });

  useEffect(() => {
    dispatch(fetchRequestById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentRequest) {
      setForm({
        title: currentRequest.title || "",
        description: currentRequest.description || "",
        category: currentRequest.category || "",
        priority: currentRequest.priority || "MEDIUM",
      });
    }
  }, [currentRequest]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (currentRequest && currentRequest.status !== "PENDING") {
    return (
      <Navigate
        to={`/requests/${id}`}
        replace
      />
    );
  }

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        updateRequest({
          id,
          formData: form,
        })
      ).unwrap();

      toast.success("Request updated successfully");

      navigate(`/requests/${id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back button */}
      <div>
        <Link
          to={`/requests/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Request Details</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Edit Service Request
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Modify the subject, description, or priorities of this pending ticket.
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Request Title <span className="text-rose-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={6}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="TECHNICAL">Technical Issue</option>
                <option value="BILLING">Billing & Accounts</option>
                <option value="ACCOUNT">Account Access</option>
                <option value="OTHER">Other Inquiry</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Priority Level
              </label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Link
              to={`/requests/${id}`}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-900/30 disabled:opacity-50 transition-all"
            >
              {actionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={15} />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRequest;