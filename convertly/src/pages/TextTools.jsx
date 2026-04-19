import { useState } from "react";
import { CaseLower, CaseUpper, Copy, Trash2, AlignLeft, Replace, Filter } from "lucide-react";
import SEO from "../components/SEO";

export default function TextTools() {
  const [text, setText] = useState("");
  const [findVal, setFindVal] = useState("");
  const [replaceVal, setReplaceVal] = useState("");

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;
  const lineCount = text ? text.split("\n").length : 0;
  const sentenceCount = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;

  const handleCopy = () => navigator.clipboard.writeText(text);
  const toUpper = () => setText(text.toUpperCase());
  const toLower = () => setText(text.toLowerCase());
  const toCapitalize = () => setText(text.replace(/\b\w/g, c => c.toUpperCase()));
  const minify = () => setText(text.replace(/\s+/g, " ").trim());
  const clear = () => setText("");
  const removeDuplicateLines = () => {
    const lines = text.split("\n");
    setText([...new Set(lines)].join("\n"));
  };
  const removeBlankLines = () => {
    setText(text.split("\n").filter(line => line.trim() !== "").join("\n"));
  };
  const findAndReplace = () => {
    if (!findVal) return;
    setText(text.split(findVal).join(replaceVal));
  };
  const reverseText = () => setText(text.split("").reverse().join(""));
  const sortLines = () => setText(text.split("\n").sort().join("\n"));

  return (
    <>
      <SEO
        title="Free Text Utilities: Word Counter, Formatter & More"
        description="Count words, convert case, remove duplicates, find & replace, sort lines and more. All free and instant in your browser."
        keywords="word counter, text formatter, remove duplicate lines, find and replace, sort lines, character count, case converter"
        url="/text-tools"
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">Text Tools</h1>
          <p className="text-slate-600">Format, analyze, and transform your text instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-3 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition-all">
              <textarea
                className="w-full h-64 p-6 resize-y focus:outline-none text-slate-700 leading-relaxed font-sans"
                placeholder="Paste or type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="bg-slate-50 p-2 flex justify-end gap-2 border-t border-slate-100">
                <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                  <Copy size={16} /> Copy
                </button>
                <button onClick={clear} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium">
                  <Trash2 size={16} /> Clear
                </button>
              </div>
            </div>

            {/* Case & Format */}
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

            {/* Line Tools */}
            <div className="flex flex-wrap gap-3">
              <button onClick={removeDuplicateLines} className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
                <Filter size={18} /> Remove Duplicates
              </button>
              <button onClick={removeBlankLines} className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
                <Filter size={18} /> Remove Blank Lines
              </button>
              <button onClick={sortLines} className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
                Sort Lines A→Z
              </button>
              <button onClick={reverseText} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors flex justify-center items-center gap-2">
                Reverse Text
              </button>
            </div>

            {/* Find & Replace */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-700 flex items-center gap-2"><Replace size={18} /> Find & Replace</h3>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Find..."
                  value={findVal}
                  onChange={e => setFindVal(e.target.value)}
                  className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceVal}
                  onChange={e => setReplaceVal(e.target.value)}
                  className="p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <button onClick={findAndReplace} className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors">
                Replace All
              </button>
            </div>
          </div>

          {/* Analytics */}
          <div className="md:col-span-1 space-y-4">
            <div className="glass rounded-2xl p-6 border-t-4 border-t-purple-500">
              <h3 className="font-bold text-slate-700 mb-6 uppercase tracking-wider text-xs">Analytics</h3>
              <div className="space-y-5">
                {[
                  { label: "Words", value: wordCount },
                  { label: "Characters", value: charCount },
                  { label: "Chars (no spaces)", value: charCountNoSpaces },
                  { label: "Lines", value: lineCount },
                  { label: "Sentences", value: sentenceCount },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-3xl font-extrabold text-slate-900">{value}</div>
                    <div className="text-sm font-medium text-slate-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
