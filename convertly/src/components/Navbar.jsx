import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Navbar() {
  return (
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

        </div>
      </div>
    </nav>
  );
}
