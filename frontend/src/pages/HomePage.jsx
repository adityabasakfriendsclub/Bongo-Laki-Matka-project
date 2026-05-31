import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  BAZI_TIMES,
  getVisibleBaziCount,
  getTodayStr,
} from "../data/constants";
import { fetchTodayResult } from "../api";

function getCurrentBaziIndex() {
  const now = new Date();
  const total = now.getHours() * 60 + now.getMinutes();
  const times = BAZI_TIMES.map((b) => b.minutesSinceMidnight);
  for (let i = times.length - 1; i >= 0; i--) {
    if (total >= times[i]) return i;
  }
  return -1;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(
    Array(8).fill({ open: "", close: "" }),
  );
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");
  const [visibleCount, setVisibleCount] = useState(getVisibleBaziCount());
  const currentBazi = getCurrentBaziIndex();

  const loadResults = async () => {
    try {
      const data = await fetchTodayResult();
      if (data.results && data.results.length > 0) {
        const normalized = Array.from({ length: 8 }, (_, i) => {
          const found = data.results.find((r) => r.bazi === i + 1);
          return found || { bazi: i + 1, open: "", close: "" };
        });
        setResults(normalized);
      }
      setLastUpdated(new Date().toLocaleTimeString());
    } catch {
      setLastUpdated(new Date().toLocaleTimeString());
    }
    // Refresh visible count each time we reload
    setVisibleCount(getVisibleBaziCount());
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadResults().finally(() => setRefreshing(false));
  };

  useEffect(() => {
    loadResults();
    const interval = setInterval(loadResults, 60000);
    return () => clearInterval(interval);
  }, []);

  // Mask results for bazis that haven't happened yet
  const displayResults = results.map((r, i) => {
    if (i < visibleCount) return r;
    return { open: "", close: "" }; // not yet released
  });

  return (
    <div className="max-w-lg mx-auto px-3 pb-8">
      {/* Logo + tagline */}
      <div className="text-center py-5">
        <img
          src="/logo.png"
          alt="Bongo Laki"
          className="w-24 h-24 mx-auto rounded-full object-cover animate-float mb-3"
          style={{ boxShadow: "0 0 30px rgba(255,193,7,0.4)" }}
        />
        <h2 className="font-display text-2xl font-black gold-gradient">
          BONGO LAKI MATKA
        </h2>
        <p className="text-amber-600 text-sm mt-1 font-body">
          Today Result Live · Old Result · Patti List
        </p>
        <p className="text-amber-400 text-sm font-bold">bongolaki.cc</p>
      </div>

      {/* Live badge */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-700/40 rounded-full px-4 py-1">
          <div className="live-dot" />
          <span className="text-red-400 font-bold text-sm font-mono">LIVE</span>
          {lastUpdated && (
            <span className="text-amber-700 text-xs">
              · Updated {lastUpdated}
            </span>
          )}
        </div>
      </div>

      {/* Result table */}
      <div
        className="ornament rounded-xl overflow-hidden mb-5"
        style={{ boxShadow: "0 0 20px rgba(255,193,7,0.1)" }}
      >
        <div className="patti-header text-center py-3">
          <span className="font-display text-xl font-bold text-amber-900">
            {getTodayStr()}
          </span>
        </div>
        {/* Bazi numbers row */}
        <div className="grid grid-cols-8 border-b border-amber-900/40">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n, i) => (
            <div
              key={n}
              className={`text-center py-2 font-display font-bold text-sm
              ${currentBazi === i ? "text-amber-300 bg-amber-900/30" : "text-amber-200"}`}
            >
              {n}
            </div>
          ))}
        </div>
        {/* Open row */}
        <div className="grid grid-cols-8 border-b border-amber-900/40">
          {displayResults.map((r, i) => (
            <div
              key={i}
              className={`result-cell text-center py-3 font-mono text-xs font-bold
              ${i >= visibleCount ? "text-amber-800" : currentBazi === i ? "text-white" : "text-amber-200"}`}
            >
              {i < visibleCount ? r.open || "---" : "---"}
            </div>
          ))}
        </div>
        {/* Close row */}
        <div className="grid grid-cols-8">
          {displayResults.map((r, i) => (
            <div
              key={i}
              className={`result-cell text-center py-3 font-mono text-lg font-bold
              ${i >= visibleCount ? "text-amber-800" : currentBazi === i ? "text-white" : "text-amber-200"}`}
            >
              {i < visibleCount ? r.close || "-" : "-"}
            </div>
          ))}
        </div>
      </div>

      {/* Refresh button */}
      <button
        onClick={handleRefresh}
        className={`btn-gold w-full py-3 rounded-xl text-base mb-4 ${refreshing ? "opacity-70" : ""}`}
      >
        {refreshing ? "⟳  Refreshing..." : "↻  Refresh Results"}
      </button>

      {/* Nav buttons */}
      <div className="flex flex-col gap-3 mb-6">
        <button
          onClick={() => navigate("/free-tips")}
          className="w-full py-3 rounded-xl font-display font-bold text-base text-amber-200
            bg-gradient-to-r from-green-900 to-green-800 border border-green-700
            hover:shadow-lg hover:shadow-green-900/50 transition-all"
        >
          ✦ Free Tips
        </button>
        <button
          onClick={() => navigate("/patti-list")}
          className="w-full py-3 rounded-xl font-display font-bold text-base text-amber-200
            bg-gradient-to-r from-amber-900 to-amber-800 border border-amber-700
            hover:shadow-lg hover:shadow-amber-900/50 transition-all"
        >
          ✦ Patti List
        </button>
        <button
          onClick={() => navigate("/old-results")}
          className="w-full py-3 rounded-xl font-display font-bold text-base text-amber-200
            bg-gradient-to-r from-teal-900 to-teal-800 border border-teal-700
            hover:shadow-lg hover:shadow-teal-900/50 transition-all"
        >
          ✦ Old &amp; Previous Results
        </button>
      </div>

      {/* Time table */}
      <div className="ornament rounded-xl overflow-hidden">
        <div className="patti-header text-center py-2">
          <span className="font-display font-bold text-amber-900 text-sm tracking-wider">
            BONGO LAKI RESULT TIME TABLE
          </span>
        </div>
        {BAZI_TIMES.map((item, i) => (
          <div
            key={i}
            className={`grid grid-cols-2 border-b border-amber-900/30 last:border-0
              ${currentBazi === i ? "bg-amber-900/20" : i % 2 === 0 ? "bg-transparent" : "bg-amber-950/30"}`}
          >
            <div
              className={`text-center py-2 font-display font-bold text-sm
              ${currentBazi === i ? "text-amber-300" : "text-amber-500"}`}
            >
              {item.bazi}
            </div>
            <div
              className={`text-center py-2 font-mono font-bold text-sm
              ${currentBazi === i ? "text-amber-300" : "text-amber-400"}`}
            >
              {item.time}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <img
          src="/logo.png"
          alt="Bongo Laki"
          className="w-12 h-12 mx-auto rounded-full mb-2 opacity-60"
        />
        <p className="text-amber-800 text-xs font-body">
          © 2026 Bongo Laki Matka · bongolaki.cc
        </p>
      </div>
    </div>
  );
}
