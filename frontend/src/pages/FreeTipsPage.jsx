import { useState, useEffect } from "react";
import { fetchTips } from "../api";
import { getVisibleBaziCount, getTodayStr } from "../data/constants";

function getDateList() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    dates.push(
      d
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        })
        .replace(/ /g, "-"),
    );
  }
  return dates;
}

export default function FreeTipsPage() {
  const dates = getDateList();
  const todayStr = getTodayStr();
  // Convert today to 2-digit year format used in date list
  const todayShort = new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "2-digit",
    })
    .replace(/ /g, "-");

  const [selectedDate, setSelectedDate] = useState(dates[0]);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(false);

  // Visible count only matters for today
  const isToday = selectedDate === todayShort;
  const visibleCount = isToday ? getVisibleBaziCount() : 8;

  useEffect(() => {
    setLoading(true);
    fetchTips(selectedDate)
      .then((data) => setTips(data.tips || []))
      .catch(() => setTips([]))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  const getTip = (bazi) =>
    tips.find((t) => t.bazi === bazi) || { open: "", close: "" };

  return (
    <div className="max-w-lg mx-auto px-3 pb-8">
      <div className="glass-card rounded-xl p-4 my-4 text-center">
        <h2 className="font-display text-2xl font-black gold-gradient mb-1">
          Free Tips
        </h2>
        <p className="text-amber-600 text-sm font-body">
          Bongo Laki Tips · Result · Fast Update · bongolaki.cc
        </p>
      </div>

      {/* Date selector */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex gap-2 pb-2">
          {dates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all
                ${selectedDate === date ? "btn-gold" : "bg-amber-950/50 border border-amber-800/40 text-amber-600 hover:text-amber-400"}`}
            >
              {date}
            </button>
          ))}
        </div>
      </div>

      <div
        className="ornament rounded-xl overflow-hidden"
        style={{ boxShadow: "0 0 20px rgba(255,193,7,0.1)" }}
      >
        <div className="patti-header text-center py-3">
          <span className="font-display text-xl font-bold text-amber-900">
            {selectedDate}
          </span>
        </div>
        <div className="grid grid-cols-3">
          {/* Header */}
          <div className="text-center py-2 bg-amber-950/50 border-b border-r border-amber-900/30">
            <span className="text-amber-500 font-bold text-xs font-mono">
              BAZI
            </span>
          </div>
          <div className="text-center py-2 bg-amber-950/50 border-b border-r border-amber-900/30">
            <span className="text-amber-500 font-bold text-xs font-mono">
              OPEN
            </span>
          </div>
          <div className="text-center py-2 bg-amber-950/50 border-b border-amber-900/30">
            <span className="text-amber-500 font-bold text-xs font-mono">
              CLOSE
            </span>
          </div>

          {loading ? (
            <div className="col-span-3 text-center py-8 text-amber-600 font-mono">
              Loading...
            </div>
          ) : (
            [1, 2, 3, 4, 5, 6, 7, 8].map((b, i) => {
              const tip = getTip(b);
              const isLast = i === 7;
              // For today: only show tips for bazis that have passed their time
              const isVisible = i < visibleCount;

              return (
                <>
                  <div
                    key={`n-${i}`}
                    className={`text-center py-3 border-r border-amber-900/20 font-display font-bold text-sm
                    ${i % 2 === 0 ? "bg-amber-950/20" : ""} ${isLast ? "" : "border-b"}`}
                  >
                    <span className="text-amber-400">Bazi {b}</span>
                  </div>
                  <div
                    key={`o-${i}`}
                    className={`text-center py-3 border-r border-amber-900/20 font-mono font-bold text-lg
                    ${i % 2 === 0 ? "bg-amber-950/20" : ""} ${isLast ? "" : "border-b"}
                    ${!isVisible ? "text-amber-800" : tip.open ? "text-amber-300" : "text-amber-700"}`}
                  >
                    {isVisible ? tip.open || "-" : "-"}
                  </div>
                  <div
                    key={`c-${i}`}
                    className={`text-center py-3 border-amber-900/20 font-mono font-bold text-lg
                    ${i % 2 === 0 ? "bg-amber-950/20" : ""} ${isLast ? "" : "border-b"}
                    ${!isVisible ? "text-amber-800" : tip.close ? "text-amber-300" : "text-amber-700"}`}
                  >
                    {isVisible ? tip.close || "-" : "-"}
                  </div>
                </>
              );
            })
          )}
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg bg-amber-900/10 border border-amber-900/30 text-center">
        <p className="text-amber-600 text-xs font-body">
          Tips updated before each Bazi · bongolaki.cc
        </p>
      </div>
    </div>
  );
}
