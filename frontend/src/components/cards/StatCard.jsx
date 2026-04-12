function StatCard({ label, value, trend, icon: Icon, tone = "brand" }) {
  const iconTone =
    tone === "danger"
      ? "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-200"
      : tone === "warning"
        ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-200"
        : "bg-brand-50 text-brand-600 dark:bg-brand-500/20 dark:text-brand-100";

  const trendTone =
    tone === "danger"
      ? "text-rose-600 dark:text-rose-300"
      : tone === "warning"
        ? "text-amber-600 dark:text-amber-300"
        : "text-emerald-600 dark:text-emerald-400";

  return (
    <article className="group rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-panel backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/70 dark:shadow-panel-dark">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        {Icon ? (
          <span className={`rounded-xl p-2.5 ${iconTone}`}>
            <Icon size={16} />
          </span>
        ) : null}
      </div>
      <h3 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{value}</h3>
      <p className={`mt-2 text-xs font-semibold ${trendTone}`}>{trend}</p>
    </article>
  );
}

export default StatCard;
