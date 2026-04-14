import { Menu, Search } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth } from "../../context/AuthContext";

function Header({ onMenuClick }) {
  const { user } = useAuth();
  const displayName = user?.user_metadata?.full_name || user?.email || "Riya Khanna";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const roleLabel = user?.email ? "Signed in user" : "Program Manager";

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80 sm:px-6 lg:px-10">
      <div className="flex items-center gap-3">
        <button
          className="rounded-xl border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
          onClick={onMenuClick}
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none ring-brand-500 transition focus:border-brand-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500"
            placeholder="Search students, cohorts, insights..."
            type="search"
          />
        </div>

        <ThemeToggle />

        <button
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
          type="button"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-500 text-sm font-bold text-white">
            {initials}
          </span>
          <span className="hidden text-left md:block">
            <span className="block text-xs text-slate-500 dark:text-slate-400">{roleLabel}</span>
            <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">{displayName}</span>
          </span>
        </button>
      </div>
    </header>
  );
}

export default Header;
