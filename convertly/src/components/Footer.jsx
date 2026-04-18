import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-auto bg-white border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group w-fit">
              <div className="bg-gradient-to-tr from-brand-500 to-brand-600 p-2 rounded-xl text-white shadow-md">
                <Zap size={20} className="fill-current" />
              </div>
              <span className="font-bold text-lg text-slate-800">
                Convertly
              </span>
            </Link>
            <p className="text-slate-500 max-w-sm">
              The completely free, all-in-one platform for rapid, secure, and ephemeral file conversions.
            </p>
          </div>

          {/* Tools Menu */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Toolbox</h4>
            <ul className="space-y-3">
              <li><Link to="/image-tools" className="text-slate-500 hover:text-brand-600 transition-colors">Image Tools</Link></li>
              <li><Link to="/pdf-tools" className="text-slate-500 hover:text-brand-600 transition-colors">PDF Tools</Link></li>
              <li><Link to="/text-tools" className="text-slate-500 hover:text-brand-600 transition-colors">Text Tools</Link></li>
              <li><Link to="/dev-tools" className="text-slate-500 hover:text-brand-600 transition-colors">Developer Tools</Link></li>
            </ul>
          </div>

          {/* Legal Menu */}
          <div className="space-y-4">
            <h4 className="font-semibold text-slate-900">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="/privacy-policy" className="text-slate-500 hover:text-brand-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-slate-500 hover:text-brand-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} Convertly. All rights reserved.
          </p>
          <div className="text-slate-400 text-sm">
            Zero File Retention Guarantee.
          </div>
        </div>
      </div>
    </footer>
  );
}
