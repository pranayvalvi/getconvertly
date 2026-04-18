import { useState } from "react";
import { CaseLower, CaseUpper, Copy, Trash2, AlignLeft } from "lucide-react";

export default function TextTools() {
  const [text, setText] = useState("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toCapitalize = () => {
    setText(text.replace(/\b\w/g, c => c.toUpperCase()));
  };
  const minify = () => {
    setText(text.replace(/\s+/g, " ").trim());
  };
  const clear = () => setText("");

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900">Text Tools</h1>
        <p className="text-slate-600">Instantly format, minify, and analyze your text locally.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
            <textarea
              className="w-full h-80 p-6 resize-y focus:outline-none text-slate-700 leading-relaxed font-sans"
              placeholder="Paste or type your text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="bg-slate-50 p-2 flex justify-end gap-2 border-t border-slate-100">
              <button 
                onClick={handleCopy}
                className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Copy size={16} /> Copy
              </button>
              <button 
                onClick={clear}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Trash2 size={16} /> Clear
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={toUpper} className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
              <CaseUpper size={18} /> UPPERCASE
            </button>
            <button onClick={toLower} className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
              <CaseLower size={18} /> lowercase
            </button>
            <button onClick={toCapitalize} className="flex-1 py-3 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
              <span className="text-xl leading-none">Aa</span> Title Case
            </button>
            <button onClick={minify} className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md transition-colors flex justify-center items-center gap-2">
              <AlignLeft size={18} /> Minify Space
            </button>
          </div>
        </div>

        <div className="md:col-span-1 space-y-4">
          <div className="glass rounded-2xl p-6 border-t-4 border-t-purple-500">
            <h3 className="font-bold text-slate-700 mb-6 uppercase tracking-wider text-xs">Analytics</h3>
            
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-extrabold text-slate-900">{wordCount}</div>
                <div className="text-sm font-medium text-slate-500">Words</div>
              </div>
              
              <div>
                <div className="text-3xl font-extrabold text-slate-900">{charCount}</div>
                <div className="text-sm font-medium text-slate-500">Characters</div>
              </div>
              
              <div>
                <div className="text-3xl font-extrabold text-slate-900">{charCountNoSpaces}</div>
                <div className="text-sm font-medium text-slate-500">Chars (no spaces)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
