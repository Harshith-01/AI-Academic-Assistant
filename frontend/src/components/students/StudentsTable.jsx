import { Link } from "react-router-dom";
import { ArrowUpRight, BookOpenText } from "lucide-react";
import StatusBadge from "../ui/StatusBadge";

function StudentsTable({ students }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel transition duration-300 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:border-slate-800 dark:bg-slate-800/70 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3 font-semibold">Student</th>
              <th className="px-5 py-3 font-semibold">Cohort</th>
              <th className="px-5 py-3 font-semibold">Avg Marks</th>
              <th className="px-5 py-3 font-semibold">Attendance</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => {
              const status = student.status || (student.risk === "Low" ? "Good" : "Risk");
              return (
                <tr
                  key={student.id}
                  className="group border-b border-slate-100 text-slate-700 transition duration-200 hover:bg-slate-50/70 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                  </td>
                  <td className="px-5 py-4">{student.cohort}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <BookOpenText size={14} className="text-slate-400" />
                      {student.averageMarks.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-5 py-4">{student.attendance}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={status} compact />
                  </td>
                  <td className="px-5 py-4">
                    <Link
                      className="inline-flex items-center gap-1 rounded-lg border border-brand-200 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-50 dark:border-brand-500/30 dark:text-brand-200 dark:hover:bg-brand-500/20"
                      to={`/students/${student.id}`}
                    >
                      View profile
                      <ArrowUpRight size={13} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentsTable;
