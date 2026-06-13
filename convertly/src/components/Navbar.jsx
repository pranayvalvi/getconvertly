import { Link } from "react-router-dom";
import { Zap, Clock } from "lucide-react";
import { useState } from "react";
import HistorySidebar from "./HistorySidebar";

export default function Navbar() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 w-full z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-tr from-brand-500 to-brand-600 p-2 rounded-xl text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <Zap size={24} className="fill-current" />
            </div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
              Convertly
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/image-tools" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              Image Tools
            </Link>
            <Link to="/pdf-tools" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              PDF Tools
            </Link>
            <Link to="/text-tools" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              Text Tools
            </Link>
            <Link to="/dev-tools" className="text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors">
              Dev Tools
            </Link>
            <button 
              onClick={() => setIsHistoryOpen(true)}
              className="ml-4 p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors flex items-center justify-center relative"
              title="Recent Conversions"
            >
              <Clock size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
    <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} />
    </>
  );
}
