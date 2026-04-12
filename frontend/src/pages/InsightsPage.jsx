import { useState } from "react";
import { Brain, ChartSpline, Sparkles, Loader2, Play } from "lucide-react";
import { analyzeClass } from "../services/api";

function InsightsPage() {
  const [cards, setCards] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeClass();
      setCards(data.cards);
      setSummary(data.summary);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.detail || "Failed to analyze class data.");
    } finally {
      setLoading(false);
    }
  };

  const icons = [<ChartSpline size={17} key={1} />, <Brain size={17} key={2} />, <Sparkles size={17} key={3} />];

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Intelligence Layer</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Class Insights</h2>
        </div>
        
        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:shadow-brand-500/40 focus:outline-none focus:ring-4 focus:ring-brand-500/20 disabled:pointer-events-none disabled:opacity-70"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Play className="transition-transform group-hover:scale-110" size={18} />
          )}
          {loading ? "Analyzing Class..." : "Analyze Entire Class"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-500/10 dark:text-red-400">
          {error}
        </div>
      )}

      {!cards && !loading && !error && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-8 text-center dark:border-slate-800 dark:bg-slate-900/20">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-brand-50 p-4 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400">
            <Brain size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Insights Generated</h3>
          <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
            Click the Analyze button above to process all student data and generate AI-powered insights about class performance.
          </p>
        </div>
      )}

      {loading && !cards && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <Loader2 className="mb-4 h-10 w-10 animate-spin text-brand-500" />
          <p className="animate-pulse text-sm font-medium text-slate-500 dark:text-slate-400">Running Gemini AI models...</p>
        </div>
      )}

      {cards && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((item, index) => (
            <article
              key={index}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-panel transition-all hover:-translate-y-1 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark"
            >
              <div className="mb-5 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-600 shadow-sm dark:bg-brand-500/20 dark:text-brand-300">
                {icons[index % icons.length]}
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.title}</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{item.value}</h3>
              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{item.subtitle}</p>
            </article>
          ))}
        </div>
      )}

      {summary && (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-panel dark:border-slate-800 dark:bg-slate-900 dark:shadow-panel-dark relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles size={120} />
          </div>
          <div className="relative z-10">
            <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white">
              <Brain className="text-brand-500" size={20} />
              Narrative Summary
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {summary}
            </p>
          </div>
        </article>
      )}
    </section>
  );
}

export default InsightsPage;
