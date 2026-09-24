import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Loader2, Sparkles, HelpCircle } from "lucide-react";
import toast from "react-hot-toast";
import { createRequest } from "../../features/requests/requestSlice";

const CreateRequest = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { actionLoading } = useSelector((state) => state.requests);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    priority: "MEDIUM",
  });

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const result = await dispatch(createRequest(form)).unwrap();

      toast.success("Request created successfully");

      navigate(`/requests/${result.data.request._id}`);
    } catch (error) {
      toast.error(error);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Back Link */}
      <div>
        <Link
          to="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to My Requests</span>
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Create Service Request
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Provide complete details regarding the service, issue, or assistance required.
        </p>
      </div>

      {/* Main Form Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Request Title <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {form.title.length}/150
              </span>
            </div>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              minLength={3}
              maxLength={150}
              placeholder="e.g. Email server authentication failure on mobile device"
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-700">
                Detailed Description <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                {form.description.length}/2000
              </span>
            </div>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              minLength={10}
              maxLength={2000}
              rows={6}
              placeholder="Please provide steps to reproduce, error codes, impact, or any relevant environment details..."
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>

          {/* Category & Priority Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Category <span className="text-rose-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              >
                <option value="">Select a category</option>
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
                <option value="LOW">Low - General inquiry or minor issue</option>
                <option value="MEDIUM">Medium - Standard operational impact</option>
                <option value="HIGH">High - Urgent or blocking workflow</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
            <Link
              to="/requests"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={actionLoading}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50 transition-all"
            >
              {actionLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send size={15} />
                  <span>Submit Request</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateRequest;