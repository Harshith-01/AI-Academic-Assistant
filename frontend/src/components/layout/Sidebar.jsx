import { NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Sparkles, X } from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Students", icon: Users, to: "/students" },
  { label: "Insights", icon: Sparkles, to: "/insights" },
];

function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/45 backdrop-blur-sm transition-opacity lg:hidden ${
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        role="presentation"
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200/80 bg-white/95 px-6 py-7 shadow-2xl backdrop-blur-xl transition-transform dark:border-slate-800 dark:bg-slate-900/95 lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">AI Academic</p>
            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Assistant</h1>
          </div>
          <button
            className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {navItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                  isActive
                    ? "bg-brand-600 text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white"
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-10 rounded-2xl border border-brand-100 bg-brand-50/80 p-4 dark:border-brand-500/30 dark:bg-brand-500/10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700 dark:text-brand-200">AI Alert</p>
          <p className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">
            8 students are trending upward after adaptive tutoring sessions.
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
