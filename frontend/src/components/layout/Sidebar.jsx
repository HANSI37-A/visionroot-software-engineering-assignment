import {
  LayoutDashboard,
  ClipboardList,
  PlusCircle,
  Users,
  ShieldCheck,
  Headphones,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

const Sidebar = () => {
  const { role, user } = useSelector((state) => state.auth);

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 group ${
      isActive
        ? "bg-slate-900 text-white shadow-xs font-semibold"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-200/80 bg-white md:flex">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/80 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-700 text-white shadow-xs">
          <ShieldCheck size={20} className="stroke-[2.2]" />
        </div>
        <div>
          <span className="font-bold text-slate-900 tracking-tight text-base block leading-none">
            ResolveIQ
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-600 leading-none">
            Enterprise Desk
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        <div>
          <p className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {role === "ADMIN" ? "Admin Control" : "Workspace"}
          </p>

          <nav className="space-y-1">
            {role === "ADMIN" ? (
              <>
                <NavLink to="/admin" end className={linkClass}>
                  <LayoutDashboard size={18} className="transition-transform group-hover:scale-110" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/admin/requests" className={linkClass}>
                  <ClipboardList size={18} className="transition-transform group-hover:scale-110" />
                  <span>All Requests</span>
                </NavLink>

                <NavLink to="/admin/users" className={linkClass}>
                  <Users size={18} className="transition-transform group-hover:scale-110" />
                  <span>Users Directory</span>
                </NavLink>
              </>
            ) : (
              <>
                <NavLink to="/dashboard" className={linkClass}>
                  <LayoutDashboard size={18} className="transition-transform group-hover:scale-110" />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink to="/requests" end className={linkClass}>
                  <ClipboardList size={18} className="transition-transform group-hover:scale-110" />
                  <span>My Requests</span>
                </NavLink>

                <NavLink to="/requests/new" className={linkClass}>
                  <PlusCircle size={18} className="transition-transform group-hover:scale-110" />
                  <span>New Request</span>
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Footer Profile / Status */}
      <div className="border-t border-slate-200/80 p-4 bg-slate-50/60">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs ring-2 ring-white">
            {user?.name ? user.name.slice(0, 2).toUpperCase() : (role === "ADMIN" ? "AD" : "UR")}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-900">
              {user?.name || "System User"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="truncate text-[11px] text-slate-500 font-medium capitalize">
                {role?.toLowerCase() || "standard"} role
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;