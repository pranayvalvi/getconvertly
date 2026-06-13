import { Clock, Download, Trash2, X, File, Image as ImageIcon } from "lucide-react";
import { useHistory } from "../hooks/useHistory";

export default function HistorySidebar({ isOpen, onClose }) {
  const { history, clearHistory } = useHistory();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 flex flex-col border-l border-slate-100 transform transition-transform duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Clock className="text-blue-500" size={24} /> Recent Files
          </h2>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center text-slate-500 mt-12 space-y-4">
              <Clock size={48} className="mx-auto text-slate-300" />
              <p>No recent conversions found.</p>
              <p className="text-sm text-slate-400">Files you convert will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex gap-3 items-start">
                    <div className="mt-1">
                      {item.toolName?.toLowerCase().includes("image") ? (
                        <ImageIcon className="text-blue-500" size={20} />
                      ) : (
                        <File className="text-emerald-500" size={20} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 truncate text-sm" title={item.filename}>
                        {item.filename}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 flex justify-between">
                        <span className="capitalize text-blue-600 font-semibold">{item.toolName}</span>
                        <span>{item.timeAgo}</span>
                      </p>
                    </div>
                  </div>
                  <a 
                    href={item.downloadUrl}
                    download
                    className="mt-3 w-full py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 border border-slate-200 hover:border-blue-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={16} /> Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-6 border-t border-slate-100 bg-slate-50">
            <button 
              onClick={clearHistory}
              className="w-full py-3 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-50 rounded-xl transition-colors"
            >
              <Trash2 size={18} /> Clear History
            </button>
          </div>
        )}
      </div>
    </>
  );
}
