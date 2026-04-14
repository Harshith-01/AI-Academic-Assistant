import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, AlertTriangle, GraduationCap, Users } from "lucide-react";
import StatCard from "../components/cards/StatCard";
import Skeleton from "../components/ui/Skeleton";
import StatusBadge from "../components/ui/StatusBadge";
import { fetchStudents } from "../services/api";

function DashboardPage() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadStudents() {
      setIsLoading(true);
      setError("");
      try {
        const result = await fetchStudents();
        setStudents(result);
      } catch (loadError) {
        console.error("Dashboard students load error:", loadError);
        setError(
          loadError?.response?.data?.detail || loadError?.message || "Unable to load students from backend."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  const stats = useMemo(() => {
    if (!students.length) {
      return [
        { label: "Average Attendance", value: "0.0%", trend: "Awaiting data", icon: Activity, tone: "brand" },
        { label: "Average Marks", value: "0.0%", trend: "Awaiting data", icon: GraduationCap, tone: "warning" },
        { label: "At-Risk Students", value: "0", trend: "Awaiting data", icon: AlertTriangle, tone: "danger" },
      ];
    }

    const averageAttendance = students.reduce((sum, student) => sum + student.attendanceValue, 0) / students.length;
    const averageMarks = students.reduce((sum, student) => sum + student.averageMarks, 0) / students.length;
    const atRiskStudents = students.filter((student) => student.status === "Risk").length;

    return [
      {
        label: "Average Attendance",
        value: `${averageAttendance.toFixed(1)}%`,
        trend: `${students.length} students tracked`,
        icon: Activity,
        tone: "brand",
      },
      {
        label: "Average Marks",
        value: `${averageMarks.toFixed(1)}%`,
        trend: averageMarks >= 75 ? "On target" : "Needs reinforcement",
        icon: GraduationCap,
        tone: averageMarks >= 75 ? "brand" : "warning",
      },
      {
        label: "At-Risk Students",
        value: atRiskStudents.toString(),
        trend: atRiskStudents > 0 ? "Immediate action needed" : "No urgent alerts",
        icon: AlertTriangle,
        tone: atRiskStudents > 0 ? "danger" : "brand",
      },
    ];
  }, [students]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Overview</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Dashboard</h2>
        </div>
        <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <Users size={16} />
          Live cohort analytics
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <article
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark"
              >
                <Skeleton className="h-4 w-24" />
                <Skeleton className="mt-4 h-9 w-20" />
                <Skeleton className="mt-3 h-3 w-28" />
              </article>
            ))
          : stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </div>

      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
        <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Students</h3>
        </div>

        {error ? <p className="px-5 py-4 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500 dark:bg-slate-800/70 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Attendance</th>
                <th className="px-5 py-3 font-semibold">Avg Marks</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-36" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-4 w-14" />
                    </td>
                    <td className="px-5 py-4">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </td>
                  </tr>
                ))
              ) : null}

              {!isLoading && !students.length ? (
                <tr className="border-t border-slate-100 dark:border-slate-800">
                  <td className="px-5 py-5 text-sm text-slate-500 dark:text-slate-400" colSpan={4}>
                    No students found.
                  </td>
                </tr>
              ) : null}

              {!isLoading &&
                students.map((student) => {
                  const status = student.status;
                  return (
                    <tr
                      key={student.id}
                      className="group cursor-pointer border-t border-slate-100 text-slate-700 transition duration-200 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800/40"
                      onClick={() => navigate(`/students/${student.id}`)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          navigate(`/students/${student.id}`);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                    >
                      <td className="px-5 py-4 font-semibold text-slate-900 group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
                        {student.name}
                      </td>
                      <td className="px-5 py-4">{student.attendance}</td>
                      <td className="px-5 py-4">{student.averageMarks.toFixed(1)}%</td>
                      <td className="px-5 py-4">
                        <StatusBadge status={status} compact />
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
}

export default DashboardPage;
