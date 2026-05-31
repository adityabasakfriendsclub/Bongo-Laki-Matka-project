import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API = "/api";

// ─── Auth helpers ────────────────────────────────────────────────
function getToken() {
  return localStorage.getItem("bl_admin_token");
}
function setToken(t) {
  localStorage.setItem("bl_admin_token", t);
}
function clearToken() {
  localStorage.removeItem("bl_admin_token");
}

async function apiCall(path, method = "GET", body = null) {
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API}${path}`, opts);
  if (!res.ok) throw new Error((await res.json()).message || "Error");
  return res.json();
}

function todayStr() {
  return new Date()
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");
}

// ─── Shared Input/Button Styles ──────────────────────────────────
const inputCls = `
  w-full bg-[#1a0800] border border-amber-900/60 rounded-lg px-4 py-2.5
  text-amber-100 font-mono text-sm
  focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30
  placeholder:text-amber-900 transition-all
`.trim();

const smallInputCls = `
  w-full bg-[#1a0800] border border-amber-900/40 rounded px-2 py-1.5
  text-amber-100 font-mono text-xs text-center
  focus:outline-none focus:border-amber-500
  placeholder:text-amber-900/60 transition-all
`.trim();

const btnPrimary = `
  px-6 py-2.5 rounded-lg font-bold text-sm
  bg-gradient-to-r from-amber-600 to-amber-500 text-[#0d0200]
  hover:from-amber-500 hover:to-amber-400
  disabled:opacity-40 disabled:cursor-not-allowed
  transition-all shadow-lg shadow-amber-900/30
`.trim();

const btnSecondary = `
  px-4 py-2 rounded-lg font-bold text-xs
  bg-amber-950/60 border border-amber-800/50 text-amber-400
  hover:bg-amber-900/50 hover:text-amber-300
  transition-all
`.trim();

// ─── Status Badge ────────────────────────────────────────────────
function StatusMsg({ msg }) {
  if (!msg) return null;
  const ok = msg.startsWith("✓");
  return (
    <span
      className={`text-xs font-mono px-3 py-1 rounded-full ${ok ? "bg-green-900/40 text-green-400" : "bg-red-900/40 text-red-400"}`}
    >
      {msg}
    </span>
  );
}

// ─── Section Header ──────────────────────────────────────────────
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="mb-6 pb-4 border-b border-amber-900/30">
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div>
          <h3 className="font-bold text-amber-200 text-lg tracking-wide">
            {title}
          </h3>
          {subtitle && (
            <p className="text-amber-700 text-xs mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Login Form ──────────────────────────────────────────────────
function LoginForm({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async () => {
    if (!username || !password) {
      setError("Fill in both fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setToken(data.token);
      onLogin();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0d0200]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 50% 0%, rgba(180,83,9,0.15) 0%, transparent 60%)",
      }}
    >
      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,165,0,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,165,0,0.4) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative w-full max-w-md mx-4">
        {/* Logo area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 overflow-hidden shadow-xl shadow-amber-900/40 border-2 border-amber-600/50">
            <img
              src="/logo.png"
              alt="Bongo Laki"
              className="w-full h-full object-cover"
            />
          </div>
          <h1
            className="text-3xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500"
            style={{ fontFamily: "Cinzel, serif" }}
          >
            BONGO LAKI MATKA
          </h1>
          <p className="text-amber-700 text-sm mt-1 tracking-wider">
            ADMIN CONTROL PANEL
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#120400] border border-amber-900/40 rounded-2xl p-8 shadow-2xl shadow-black/60">
          <h2 className="text-amber-400 font-bold text-base mb-6 tracking-wider">
            SIGN IN
          </h2>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-lg bg-red-950/60 border border-red-800/50 text-red-300 text-sm flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-amber-600/80 text-xs font-bold mb-1.5 tracking-widest uppercase">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={inputCls}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
            <div>
              <label className="block text-amber-600/80 text-xs font-bold mb-1.5 tracking-widest uppercase">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  className={inputCls + " pr-12"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700 hover:text-amber-400 text-xs transition-colors"
                >
                  {showPass ? "HIDE" : "SHOW"}
                </button>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={
                btnPrimary + " w-full py-3 mt-2 text-base tracking-widest"
              }
              style={{ fontFamily: "Cinzel, serif" }}
            >
              {loading ? "Authenticating..." : "LOGIN →"}
            </button>
          </div>
        </div>

        <p className="text-amber-900 text-xs text-center mt-6">
          bongolaki.cc · Admin Access Only
        </p>
      </div>
    </div>
  );
}

// ─── Results Manager ─────────────────────────────────────────────
function ResultsManager() {
  const [date, setDate] = useState(todayStr());
  const [bazis, setBazis] = useState(
    Array.from({ length: 8 }, (_, i) => ({ bazi: i + 1, open: "", close: "" })),
  );
  const [isLive, setIsLive] = useState(true);
  const [globalLoading, setGlobalLoading] = useState(false);
  const [globalSaved, setGlobalSaved] = useState("");
  // Per-bazi save state: { [baziIndex]: 'saving' | 'saved' | 'error' | '' }
  const [baziStatus, setBaziStatus] = useState({});
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
    autoLoadToday();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await apiCall("/results");
      setHistory(data);
    } catch {}
  };

  // Auto-loads today's saved results on page load / refresh
  const autoLoadToday = async () => {
    try {
      const data = await apiCall("/results/old");
      const today = todayStr();
      const entry = data.find((r) => r.date === today);
      if (entry) {
        setBazis(
          Array.from({ length: 8 }, (_, i) => {
            const found = entry.results.find((r) => r.bazi === i + 1);
            return found || { bazi: i + 1, open: "", close: "" };
          }),
        );
        setIsLive(entry.isLive ?? true);
        setBaziStatus({});
      }
    } catch {}
  };

  const loadDate = async () => {
    try {
      const data = await apiCall("/results/old");
      const entry = data.find((r) => r.date === date);
      if (entry) {
        setBazis(
          Array.from({ length: 8 }, (_, i) => {
            const found = entry.results.find((r) => r.bazi === i + 1);
            return found || { bazi: i + 1, open: "", close: "" };
          }),
        );
        setIsLive(entry.isLive ?? true);
      } else {
        setBazis(
          Array.from({ length: 8 }, (_, i) => ({
            bazi: i + 1,
            open: "",
            close: "",
          })),
        );
      }
      setBaziStatus({});
    } catch {}
  };

  // Save a single bazi immediately — merges into existing date record
  const saveSingleBazi = async (i) => {
    setBaziStatus((prev) => ({ ...prev, [i]: "saving" }));
    try {
      // Fetch current saved state for this date first, then merge
      const data = await apiCall("/results/old");
      const entry = data.find((r) => r.date === date);
      // Build merged results array: existing + this bazi overwrite
      const existingResults = entry?.results || [];
      const mergedResults = Array.from({ length: 8 }, (_, idx) => {
        if (idx === i) return bazis[i]; // use current input value
        const existing = existingResults.find((r) => r.bazi === idx + 1);
        return existing || { bazi: idx + 1, open: "", close: "" };
      });
      await apiCall("/results", "POST", {
        date,
        results: mergedResults,
        isLive,
      });
      // Update local bazis with merged so state stays consistent
      setBazis(mergedResults);
      setBaziStatus((prev) => ({ ...prev, [i]: "saved" }));
      loadHistory();
      setTimeout(() => setBaziStatus((prev) => ({ ...prev, [i]: "" })), 2500);
    } catch (err) {
      setBaziStatus((prev) => ({ ...prev, [i]: "error" }));
      setTimeout(() => setBaziStatus((prev) => ({ ...prev, [i]: "" })), 3000);
    }
  };

  // Save all bazis at once
  const handleSaveAll = async () => {
    setGlobalLoading(true);
    setGlobalSaved("");
    try {
      await apiCall("/results", "POST", { date, results: bazis, isLive });
      setGlobalSaved("✓ All saved");
      loadHistory();
    } catch (err) {
      setGlobalSaved("✗ " + err.message);
    } finally {
      setGlobalLoading(false);
      setTimeout(() => setGlobalSaved(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this result entry?")) return;
    try {
      await apiCall(`/results/${id}`, "DELETE");
      loadHistory();
    } catch {}
  };

  const updateBazi = (i, field, val) => {
    // Strip any non-digit character immediately — no letters, no symbols
    const digitsOnly = val.replace(/\D/g, "");
    const next = [...bazis];
    next[i] = { ...next[i], [field]: digitsOnly };
    setBazis(next);
    // Clear saved status when user edits
    setBaziStatus((prev) => ({ ...prev, [i]: "" }));
  };

  return (
    <div>
      <SectionHeader
        icon="📊"
        title="Manage Results"
        subtitle="Enter daily open & close results for each Bazi"
      />

      {/* Date + Load */}
      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="29-May-2026"
          className={inputCls + " flex-1"}
        />
        <button onClick={loadDate} className={btnSecondary}>
          Load Date
        </button>
      </div>

      {/* Live toggle */}
      <div className="flex items-center gap-4 mb-5 p-3 rounded-lg bg-amber-950/20 border border-amber-900/20">
        <span className="text-amber-600 text-xs font-bold tracking-widest uppercase">
          Status
        </span>
        <button
          onClick={() => setIsLive(!isLive)}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
            isLive
              ? "bg-green-900/60 border border-green-700/60 text-green-300"
              : "bg-amber-950/60 border border-amber-800/40 text-amber-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400 animate-pulse" : "bg-amber-900"}`}
          />
          {isLive ? "LIVE" : "OFFLINE"}
        </button>
        <span className="text-amber-800 text-xs">
          {isLive ? "Visible to users" : "Hidden from users"}
        </span>
      </div>

      {/* Grid table — 4 cols now: BAZI | OPEN | CLOSE | SAVE */}
      <div className="rounded-xl overflow-hidden border border-amber-900/30 mb-5">
        {/* Header */}
        <div className="grid grid-cols-4 bg-amber-950/60 border-b border-amber-900/40">
          {["BAZI", "OPEN (3-digit)", "CLOSE (1-digit)", "SAVE"].map((h) => (
            <div
              key={h}
              className="text-center py-2.5 text-amber-600 text-xs font-bold tracking-widest uppercase"
            >
              {h}
            </div>
          ))}
        </div>

        {bazis.map((b, i) => {
          const status = baziStatus[i] || "";
          const isSaving = status === "saving";
          const isSaved = status === "saved";
          const isError = status === "error";
          // Both fields must be filled: open = exactly 3 digits, close = exactly 1 digit
          const hasData = b.open?.length === 3 && b.close?.length === 1;

          return (
            <div
              key={i}
              className={`grid grid-cols-4 border-b border-amber-900/20 last:border-0 transition-all ${
                isSaved
                  ? "bg-green-950/20"
                  : i % 2 === 0
                    ? "bg-amber-950/10"
                    : ""
              }`}
            >
              {/* Bazi label */}
              <div className="flex items-center justify-center py-2.5">
                <span
                  className="text-amber-500 font-bold text-sm"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  Bazi {b.bazi}
                </span>
              </div>

              {/* Open input */}
              <div className="py-2 px-2">
                <input
                  value={b.open}
                  onChange={(e) => updateBazi(i, "open", e.target.value)}
                  maxLength={3}
                  inputMode="numeric"
                  className={`${smallInputCls} ${
                    b.open?.length === 3
                      ? "border-green-700/60 text-green-300"
                      : b.open?.length > 0
                        ? "border-amber-600/60"
                        : ""
                  }`}
                  placeholder="---"
                />
              </div>

              {/* Close input */}
              <div className="py-2 px-2">
                <input
                  value={b.close}
                  onChange={(e) => updateBazi(i, "close", e.target.value)}
                  maxLength={1}
                  inputMode="numeric"
                  className={`${smallInputCls} ${
                    b.close?.length === 1
                      ? "border-green-700/60 text-green-300"
                      : b.close?.length > 0
                        ? "border-amber-600/60"
                        : ""
                  }`}
                  placeholder="-"
                />
              </div>

              {/* Per-bazi Save button */}
              <div className="flex items-center justify-center py-2 px-2">
                {isSaved ? (
                  <span className="text-green-400 text-xs font-bold">
                    ✓ Saved
                  </span>
                ) : isError ? (
                  <span className="text-red-400 text-xs font-bold">
                    ✗ Error
                  </span>
                ) : (
                  <button
                    onClick={() => saveSingleBazi(i)}
                    disabled={isSaving || !hasData}
                    title={
                      !hasData
                        ? "Enter 3-digit open and 1-digit close first"
                        : "Save this bazi"
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isSaving
                        ? "bg-amber-900/40 text-amber-700 cursor-wait"
                        : hasData
                          ? "bg-gradient-to-r from-amber-700 to-amber-600 text-[#0d0200] hover:from-amber-600 hover:to-amber-500 shadow-sm"
                          : "bg-amber-950/30 text-amber-900 cursor-not-allowed"
                    }`}
                  >
                    {isSaving ? "..." : "💾 Save"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Save All button */}
      <div className="flex items-center gap-4 mb-8 p-3 rounded-lg bg-amber-950/10 border border-amber-900/20">
        <button
          onClick={handleSaveAll}
          disabled={globalLoading}
          className={btnPrimary}
        >
          {globalLoading ? "Saving..." : "💾 Save All Bazis"}
        </button>
        <span className="text-amber-800 text-xs">Save entire day at once</span>
        <StatusMsg msg={globalSaved} />
      </div>

      {/* History */}
      <div>
        <h4 className="text-amber-700 text-xs font-bold tracking-widest uppercase mb-3">
          Recent Entries
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {history.slice(0, 15).map((entry) => (
            <div
              key={entry._id}
              className="flex items-center justify-between bg-amber-950/20 border border-amber-900/20 rounded-lg px-4 py-2.5 hover:border-amber-800/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-300 font-mono text-sm font-bold">
                  {entry.date}
                </span>
                {entry.isLive && (
                  <span className="text-xs bg-green-900/40 border border-green-800/40 text-green-400 px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                )}
                <span className="text-amber-800 text-xs font-mono">
                  {entry.results?.filter((r) => r.open || r.close).length || 0}
                  /8 bazis
                </span>
              </div>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-red-800 hover:text-red-500 text-sm transition-colors px-1"
              >
                ✕
              </button>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-amber-900 text-sm text-center py-6">
              No entries yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tips Manager ─────────────────────────────────────────────────
function TipsManager() {
  const [date, setDate] = useState(todayStr());
  const [tips, setTips] = useState(
    Array.from({ length: 8 }, (_, i) => ({ bazi: i + 1, open: "", close: "" })),
  );
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await apiCall("/tips");
      setHistory(data);
    } catch {}
  };

  const loadDate = async () => {
    try {
      const data = await apiCall(`/tips/${date}`);
      if (data.tips && data.tips.length > 0) {
        setTips(
          Array.from({ length: 8 }, (_, i) => {
            const found = data.tips.find((t) => t.bazi === i + 1);
            return found || { bazi: i + 1, open: "", close: "" };
          }),
        );
      } else {
        setTips(
          Array.from({ length: 8 }, (_, i) => ({
            bazi: i + 1,
            open: "",
            close: "",
          })),
        );
      }
    } catch {}
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved("");
    try {
      await apiCall("/tips", "POST", { date, tips });
      setSaved("✓ Saved successfully");
      loadHistory();
    } catch (err) {
      setSaved("✗ " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSaved(""), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this tip set?")) return;
    try {
      await apiCall(`/tips/${id}`, "DELETE");
      loadHistory();
    } catch {}
  };

  const updateTip = (i, field, val) => {
    const next = [...tips];
    next[i] = { ...next[i], [field]: val };
    setTips(next);
  };

  return (
    <div>
      <SectionHeader
        icon="💡"
        title="Manage Tips"
        subtitle="Set open & close tips for each Bazi by date"
      />

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          placeholder="29-May-2026"
          className={inputCls + " flex-1"}
        />
        <button onClick={loadDate} className={btnSecondary}>
          Load Date
        </button>
      </div>

      <div className="rounded-xl overflow-hidden border border-amber-900/30 mb-5">
        <div className="grid grid-cols-3 bg-amber-950/60 border-b border-amber-900/40">
          {["BAZI", "OPEN TIP", "CLOSE TIP"].map((h) => (
            <div
              key={h}
              className="text-center py-2.5 text-amber-600 text-xs font-bold tracking-widest uppercase"
            >
              {h}
            </div>
          ))}
        </div>
        {tips.map((t, i) => (
          <div
            key={i}
            className={`grid grid-cols-3 border-b border-amber-900/20 last:border-0 ${i % 2 === 0 ? "bg-amber-950/10" : ""}`}
          >
            <div className="flex items-center justify-center py-2.5">
              <span
                className="text-amber-500 font-bold text-sm"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                Bazi {t.bazi}
              </span>
            </div>
            <div className="py-2 px-3">
              <input
                value={t.open}
                onChange={(e) => updateTip(i, "open", e.target.value)}
                className={smallInputCls}
                placeholder="---"
              />
            </div>
            <div className="py-2 px-3">
              <input
                value={t.close}
                onChange={(e) => updateTip(i, "close", e.target.value)}
                className={smallInputCls}
                placeholder="-"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button onClick={handleSave} disabled={loading} className={btnPrimary}>
          {loading ? "Saving..." : "💾 Save Tips"}
        </button>
        <StatusMsg msg={saved} />
      </div>

      <div>
        <h4 className="text-amber-700 text-xs font-bold tracking-widest uppercase mb-3">
          Recent Tip Sets
        </h4>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {history.slice(0, 12).map((entry) => (
            <div
              key={entry._id}
              className="flex items-center justify-between bg-amber-950/20 border border-amber-900/20 rounded-lg px-4 py-2.5 hover:border-amber-800/40 transition-all"
            >
              <span className="text-amber-300 font-mono text-sm font-bold">
                {entry.date}
              </span>
              <button
                onClick={() => handleDelete(entry._id)}
                className="text-red-800 hover:text-red-500 text-sm transition-colors px-1"
              >
                ✕
              </button>
            </div>
          ))}
          {history.length === 0 && (
            <div className="text-amber-900 text-sm text-center py-6">
              No tip sets yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Patti Manager ────────────────────────────────────────────────
function PattiManager() {
  const [patti, setPatti] = useState({
    headers: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    rows: Array(10)
      .fill(null)
      .map(() => Array(10).fill("")),
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");

  useEffect(() => {
    fetch(`${API}/patti`)
      .then((r) => r.json())
      .then((data) => {
        if (data.headers) setPatti(data);
      })
      .catch(() => {});
  }, []);

  const updateCell = (rowIdx, colIdx, val) => {
    const next = patti.rows.map((r, ri) =>
      ri === rowIdx ? r.map((c, ci) => (ci === colIdx ? val : c)) : r,
    );
    setPatti({ ...patti, rows: next });
  };

  const handleSave = async () => {
    setLoading(true);
    setSaved("");
    try {
      await apiCall("/patti", "PUT", patti);
      setSaved("✓ Saved successfully");
    } catch (err) {
      setSaved("✗ " + err.message);
    } finally {
      setLoading(false);
      setTimeout(() => setSaved(""), 3000);
    }
  };

  return (
    <div>
      <SectionHeader
        icon="📋"
        title="Manage Patti List"
        subtitle="Edit the full Patti reference table"
      />

      <div className="overflow-x-auto rounded-xl border border-amber-900/30 mb-5">
        <table className="w-full text-xs min-w-[480px]">
          <thead>
            <tr className="bg-amber-950/60">
              {patti.headers.map((h, i) => (
                <th
                  key={i}
                  className="text-center py-2.5 text-amber-500 font-bold tracking-widest border-r border-amber-900/30 last:border-0 min-w-[48px]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patti.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-t border-amber-900/20 ${rowIdx % 2 === 0 ? "bg-amber-950/10" : ""}`}
              >
                {row.map((cell, colIdx) => (
                  <td
                    key={colIdx}
                    className="p-1.5 border-r border-amber-900/20 last:border-0"
                  >
                    <input
                      value={cell}
                      onChange={(e) =>
                        updateCell(rowIdx, colIdx, e.target.value)
                      }
                      maxLength={3}
                      className="w-full bg-[#1a0800] border border-amber-900/30 rounded px-1 py-1.5 text-amber-200 font-mono text-xs text-center focus:outline-none focus:border-amber-500 transition-all"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={handleSave} disabled={loading} className={btnPrimary}>
          {loading ? "Saving..." : "💾 Save Patti List"}
        </button>
        <StatusMsg msg={saved} />
      </div>
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────────
function NavItem({ icon, label, active, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all text-left
        ${
          active
            ? "bg-gradient-to-r from-amber-600/20 to-amber-900/20 border border-amber-700/40 text-amber-300"
            : "text-amber-700 hover:text-amber-400 hover:bg-amber-950/40"
        }`}
    >
      <span className="text-lg">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && (
        <span className="text-xs bg-amber-900/60 border border-amber-800/40 text-amber-500 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
    </button>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────
export default function AdminPage() {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(!!getToken());
  const [activeSection, setActiveSection] = useState("results");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    clearToken();
    setLoggedIn(false);
    navigate("/home");
  };

  if (!loggedIn) return <LoginForm onLogin={() => setLoggedIn(true)} />;

  const navItems = [
    { key: "results", icon: "📊", label: "Results", badge: null },
    { key: "tips", icon: "💡", label: "Tips", badge: null },
    { key: "patti", icon: "📋", label: "Patti List", badge: null },
  ];

  const sectionTitle =
    navItems.find((n) => n.key === activeSection)?.label || "";

  return (
    <div
      className="min-h-screen bg-[#0d0200] flex"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 0% 0%, rgba(120,40,0,0.2) 0%, transparent 50%)",
      }}
    >
      {/* ── Sidebar overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40 flex flex-col
          bg-[#100300] border-r border-amber-900/30
          transform transition-transform duration-300
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar header */}
        <div className="p-6 border-b border-amber-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border border-amber-600/50 shadow-lg shadow-amber-900/40 flex-shrink-0">
              <img
                src="/logo.png"
                alt="Bongo Laki"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1
                className="font-black text-amber-300 text-sm tracking-widest"
                style={{ fontFamily: "Cinzel, serif" }}
              >
                BONGO LAKI
              </h1>
              <p className="text-amber-800 text-xs">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <p className="text-amber-900 text-xs font-bold tracking-widest uppercase px-4 mb-3">
            Navigation
          </p>
          {navItems.map((item) => (
            <NavItem
              key={item.key}
              icon={item.icon}
              label={item.label}
              active={activeSection === item.key}
              badge={item.badge}
              onClick={() => {
                setActiveSection(item.key);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="p-4 border-t border-amber-900/30 space-y-2">
          <button
            onClick={() => navigate("/home")}
            className={btnSecondary + " w-full justify-center"}
          >
            ← Back to Site
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-bold text-xs bg-red-950/40 border border-red-900/40 text-red-600 hover:bg-red-900/40 hover:text-red-400 transition-all"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 bg-[#0d0200]/90 backdrop-blur-sm border-b border-amber-900/30 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-amber-700 hover:text-amber-400 hover:bg-amber-950/40 transition-all"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M2 5h16M2 10h16M2 15h16" />
                </svg>
              </button>

              {/* Breadcrumb */}
              <div>
                <p className="text-amber-800 text-xs hidden sm:block">
                  Admin Dashboard
                </p>
                <h2
                  className="text-amber-200 font-bold text-lg leading-tight"
                  style={{ fontFamily: "Cinzel, serif" }}
                >
                  {sectionTitle}
                </h2>
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-3">
              {/* Live indicator */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/40 border border-amber-900/30">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-amber-600 text-xs font-mono">
                  CONNECTED
                </span>
              </div>

              {/* Mobile logout */}
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 rounded-lg text-red-800 hover:text-red-500 hover:bg-red-950/30 transition-all text-xs"
              >
                Exit
              </button>
            </div>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-3xl mx-auto">
            {/* Stats strip (results section only) */}
            {activeSection === "results" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {[
                  { label: "Total Bazis", value: "8", icon: "🎯" },
                  {
                    label: "Today's Date",
                    value: todayStr().split("-")[0],
                    icon: "📅",
                  },
                  {
                    label: "Month",
                    value: todayStr().split("-")[1],
                    icon: "🗓",
                  },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-[#120400] border border-amber-900/30 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span>{s.icon}</span>
                      <span className="text-amber-800 text-xs uppercase tracking-wider">
                        {s.label}
                      </span>
                    </div>
                    <p className="text-amber-300 font-bold text-xl font-mono">
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Section content card */}
            <div className="bg-[#120400] border border-amber-900/30 rounded-2xl p-6 lg:p-8">
              {activeSection === "results" && <ResultsManager />}
              {activeSection === "tips" && <TipsManager />}
              {activeSection === "patti" && <PattiManager />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
