import { useState } from "react";
import { LogOut, Menu, X, Shield, User, LayoutDashboard, ClipboardList, PlusCircle, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../features/auth/authSlice";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-slate-900 text-white font-semibold shadow-xs"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 md:hidden transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-2 md:hidden">
            <span className="font-bold text-slate-900 text-base">ResolveIQ</span>
          </div>

          <div className="hidden items-center gap-2 text-xs font-medium text-slate-400 md:flex">
            <span>Portal</span>
            <span>/</span>
            <span className="font-semibold text-slate-700 capitalize">
              {user?.role === "ADMIN" ? "Administrator" : "Service Center"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Profile Pill */}
          <div className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50/80 py-1 pl-1.5 pr-3.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-[11px] font-bold text-white shadow-xs">
              {user?.name ? user.name.slice(0, 1).toUpperCase() : "U"}
            </div>
            <div className="text-left">
              <p className="text-xs font-semibold leading-tight text-slate-900">
                {user?.name || "Account"}
              </p>
              <p className="text-[10px] font-medium leading-none text-slate-500 capitalize">
                {user?.role?.toLowerCase() || "user"}
              </p>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200" />

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600 transition-all"
            aria-label="Logout"
            title="Sign out"
          >
            <LogOut size={16} className="transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>
      </header>

      {/* Mobile Dropdown Navigation */}
      {menuOpen && (
        <div className="border-b border-slate-200 bg-white p-4 shadow-lg md:hidden animate-in slide-in-from-top-2 duration-150">
          <div className="mb-2 px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Navigation Menu
          </div>
          {user?.role === "ADMIN" ? (
            <div className="space-y-1">
              <NavLink
                to="/admin"
                end
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink
                to="/admin/requests"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <ClipboardList size={18} />
                All Requests
              </NavLink>

              <NavLink
                to="/admin/users"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <Users size={18} />
                Users Directory
              </NavLink>
            </div>
          ) : (
            <div className="space-y-1">
              <NavLink
                to="/dashboard"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </NavLink>

              <NavLink
                to="/requests"
                end
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <ClipboardList size={18} />
                My Requests
              </NavLink>

              <NavLink
                to="/requests/new"
                className={navLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                <PlusCircle size={18} />
                New Request
              </NavLink>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;