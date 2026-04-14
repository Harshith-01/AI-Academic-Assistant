import { useEffect, useMemo, useState } from "react";
import { Grid2x2, ListFilter, LoaderCircle, Search } from "lucide-react";
import StudentGridCard from "../components/students/StudentGridCard";
import StudentsTable from "../components/students/StudentsTable";
import Skeleton from "../components/ui/Skeleton";
import { fetchStudents } from "../services/api";

function StudentsPage() {
  const [view, setView] = useState("table");
  const [query, setQuery] = useState("");
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
        console.error("Students load error:", loadError);
        setError(
          loadError?.response?.data?.detail || loadError?.message || "Unable to fetch students from backend."
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    if (!query.trim()) {
      return students;
    }
    const lowerQuery = query.toLowerCase();
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(lowerQuery) ||
        student.email.toLowerCase().includes(lowerQuery) ||
        student.cohort.toLowerCase().includes(lowerQuery) ||
        student.id.toLowerCase().includes(lowerQuery)
    );
  }, [query, students]);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Roster</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Students</h2>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1 dark:border-slate-700 dark:bg-slate-900">
          <button
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "table"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
            onClick={() => setView("table")}
            type="button"
          >
            <ListFilter size={14} />
            Table
          </button>
          <button
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              view === "grid"
                ? "bg-brand-600 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
            onClick={() => setView("grid")}
            type="button"
          >
            <Grid2x2 size={14} />
            Grid
          </button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none ring-brand-500 transition focus:border-brand-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-brand-500"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search by name, email, or cohort"
          type="search"
          value={query}
        />
      </div>

      {error ? <p className="text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
      {isLoading ? (
        <div className="space-y-4">
          <p className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <LoaderCircle className="animate-spin" size={14} />
            Loading students...
          </p>
          {view === "table" ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark">
              <Skeleton className="h-6 w-40" />
              <div className="mt-4 space-y-3">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <article
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark"
                >
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="mt-3 h-4 w-24" />
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                  <Skeleton className="mt-5 h-9 w-36" />
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {!isLoading && (
        <>
          {view === "table" ? (
            <StudentsTable students={filteredStudents} />
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredStudents.map((student) => (
                <StudentGridCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default StudentsPage;
