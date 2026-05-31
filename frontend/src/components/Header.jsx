import { NavLink } from "react-router-dom";

const tabs = [
  { label: "Home", path: "/home" },
  { label: "Free Tips", path: "/free-tips" },
  { label: "Patti List", path: "/patti-list" },
  { label: "Old Results", path: "/old-results" },
];

export default function Header() {
  return (
    <header className="header-bg sticky top-0 z-50 shadow-lg">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="Bongo Laki"
            className="w-10 h-10 rounded-full object-cover animate-float"
          />
          <div>
            <h1 className="font-display text-lg font-bold gold-gradient leading-tight">
              BONGO LAKI MATKA
            </h1>
            <p className="text-xs text-amber-500/70 font-body">
              bongolaki.matka
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="live-dot" />
          <span className="text-red-400 text-sm font-bold font-mono">LIVE</span>
        </div>
      </div>

      {/* Nav tabs */}
      <nav className="flex border-t border-amber-900/40 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `nav-tab flex-1 min-w-max px-3 py-2 text-xs font-bold font-body uppercase tracking-wider whitespace-nowrap text-center
              ${isActive ? "active text-amber-400" : "text-dark-700 hover:text-amber-500"}`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
