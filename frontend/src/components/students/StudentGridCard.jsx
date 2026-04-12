import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, CalendarCheck2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

function StudentGridCard({ student }) {
  const status = student.status || (student.risk === "Low" ? "Good" : "Risk");

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">{student.name}</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{student.cohort}</p>
        </div>
        <StatusBadge status={status} compact />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-xs text-slate-500 dark:text-slate-400">Avg Marks</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-base font-bold text-slate-900 dark:text-white">
            <BarChart3 size={14} className="text-slate-400" />
            {student.averageMarks.toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-xs text-slate-500 dark:text-slate-400">Attendance</p>
          <p className="mt-1 inline-flex items-center gap-1.5 text-base font-bold text-slate-900 dark:text-white">
            <CalendarCheck2 size={14} className="text-slate-400" />
            {student.attendance}
          </p>
        </div>
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/70">
          <p className="text-xs text-slate-500 dark:text-slate-400">GPA</p>
          <p className="mt-1 text-base font-bold text-slate-900 dark:text-white">{student.gpa}</p>
        </div>
      </div>

      <Link
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        to={`/students/${student.id}`}
      >
        Open student detail
        <ArrowUpRight size={14} />
      </Link>
    </article>
  );
}

export default StudentGridCard;
