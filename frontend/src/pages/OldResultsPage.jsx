import { useState, useEffect } from "react";
import { fetchOldResults } from "../api";
import { getVisibleBaziCount, getTodayStr } from "../data/constants";

export default function OldResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const todayStr = getTodayStr();
  const visibleCount = getVisibleBaziCount();

  useEffect(() => {
    fetchOldResults()
      .then((data) => setResults(data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-lg mx-auto px-3 pb-8">
      <div className="glass-card rounded-xl p-4 my-4 text-center">
        <h2 className="font-display text-2xl font-black gold-gradient mb-1">
          Old Results
        </h2>
        <p className="text-amber-600 text-sm font-body">
          Bongo Laki Today Live Result · Tips · Patti List · Old &amp; New
          Charts
        </p>
      </div>

      <div className="text-center mb-5">
        <img
          src="/logo.png"
          alt="Bongo Laki"
          className="w-16 h-16 mx-auto rounded-full mb-2 animate-float"
          style={{ boxShadow: "0 0 20px rgba(255,193,7,0.3)" }}
        />
        <h3 className="font-display font-bold text-amber-400 tracking-widest text-sm">
          BONGO LAKI
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-12 text-amber-600 font-mono text-lg">
          Loading results...
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-12 text-amber-700 font-mono">
          No results yet.
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((entry, idx) => {
            // For today's entry, only show results up to visibleCount
            const isToday = entry.date === todayStr;
            const cutoff = isToday ? visibleCount : 8;

            return (
              <div
                key={idx}
                className="ornament rounded-xl overflow-hidden"
                style={{ boxShadow: "0 0 10px rgba(255,193,7,0.05)" }}
              >
                <div className="patti-header text-center py-2">
                  <span className="font-display font-bold text-red-900">
                    {entry.date}
                  </span>
                  {isToday && (
                    <span className="ml-2 text-xs bg-red-800/50 text-red-200 px-2 py-0.5 rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                {/* Bazi numbers */}
                <div className="grid grid-cols-8 border-b border-amber-900/30">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <div
                      key={n}
                      className="bazi-num text-center py-1.5 font-display font-bold text-xs"
                    >
                      {n}
                    </div>
                  ))}
                </div>
                {/* Open row */}
                <div className="grid grid-cols-8 border-b border-amber-900/20">
                  {Array.from({ length: 8 }, (_, i) => {
                    const r = entry.results?.find((x) => x.bazi === i + 1);
                    const show = i < cutoff;
                    return (
                      <div
                        key={i}
                        className={`text-center py-2 font-mono font-bold text-xs border-r border-amber-900/20 last:border-r-0
                        ${show ? "open-val" : "cell-hidden"}`}
                      >
                        {show ? r?.open || "---" : "---"}
                      </div>
                    );
                  })}
                </div>
                {/* Close row */}
                <div className="grid grid-cols-8">
                  {Array.from({ length: 8 }, (_, i) => {
                    const r = entry.results?.find((x) => x.bazi === i + 1);
                    const show = i < cutoff;
                    return (
                      <div
                        key={i}
                        className={`text-center py-2.5 font-mono font-bold text-sm border-r border-amber-900/20 last:border-r-0
                        ${show ? "close-val" : "cell-hidden"}`}
                      >
                        {show ? r?.close || "-" : "-"}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-5 p-3 rounded-lg bg-amber-900/10 border border-amber-900/30 text-center">
        <p className="text-amber-600 text-xs font-body">
          Full old result chart available at bongolaki.cc · Updated daily
        </p>
      </div>
    </div>
  );
}
