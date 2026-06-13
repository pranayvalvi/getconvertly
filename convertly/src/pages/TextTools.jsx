import { useState } from "react";
import { CaseLower, CaseUpper, Copy, Trash2, AlignLeft, Replace, Filter, Sparkles, HelpCircle, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";

const faqs = [
  {
    question: "Are my text and documents safe to paste here?",
    answer: "Yes. All text utilities on GetConvertly run 100% locally inside your web browser. Any text you paste, type, format, or process never leaves your device and is never sent to our servers. Your data is completely safe and private.",
  },
  {
    question: "How does the duplicate line remover operate?",
    answer: "It scans your text line-by-line, identifies redundant lines using a unique Set collection algorithm, and outputs a unique list while preserving your original line sorting.",
  },
  {
    question: "What does the 'Minify Space' utility do?",
    answer: "It removes excessive trailing spaces, reduces multiple consecutive whitespace characters (like tabs or extra spaces) into a single standard space, and trims the margins of your text block, making it ideal for compacting text or code strings.",
  },
];

export default function TextTools() {
  const [text, setText] = useState("");
  const [findVal, setFindVal] = useState("");
  const [replaceVal, setReplaceVal] = useState("");

  const [openFaq, setOpenFaq] = useState(null);

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
        title="Free Text Utilities: Word Counter, Case & Formatting"
        description="Analyze and format your text instantly. Count words, transform case, remove duplicate lines, sort, minify, and find/replace text. 100% client-side."
        keywords="word counter, text formatter, remove duplicate lines, find and replace, sort lines, character count, case converter"
        url="/text-tools"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "GetConvertly Text Tools",
          "operatingSystem": "All",
          "applicationCategory": "MultimediaApplication",
          "browserRequirements": "Requires HTML5",
          "offers": {
            "@type": "Offer",
            "price": "0.00",
            "priceCurrency": "USD"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })}</script>
      </Helmet>

      {/* Decorative Blob */}
      <div className="absolute top-24 left-10 w-80 h-80 bg-purple-200 rounded-full filter blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
        
          <h1 className="text-4xl font-extrabold text-slate-900">Text Utilities</h1>
          <p className="text-slate-600 max-w-md mx-auto">Format, analyze, and manipulate your text strings instantly locally in your browser.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 overflow-hidden focus-within:ring-2 focus-within:ring-purple-500/50 transition-all duration-300">
              <textarea
                className="w-full h-64 p-6 resize-y focus:outline-none text-slate-700 leading-relaxed font-sans bg-transparent"
                placeholder="Paste or type your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="bg-slate-50 p-2 flex justify-end gap-2 border-t border-slate-100 bg-white/40">
                <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold">
                  <Copy size={16} /> Copy
                </button>
                <button onClick={clear} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-semibold">
                  <Trash2 size={16} /> Clear
                </button>
              </div>
            </div>

            {/* Case & Format */}
            <div className="flex flex-wrap gap-4">
              <button onClick={toUpper} className="flex-1 py-3.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center gap-2">
                <CaseUpper size={18} /> UPPERCASE
              </button>
              <button onClick={toLower} className="flex-1 py-3.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center gap-2">
                <CaseLower size={18} /> lowercase
              </button>
              <button onClick={toCapitalize} className="flex-1 py-3.5 px-4 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl font-bold transition-all shadow-sm flex justify-center items-center gap-2">
                <span className="text-xl leading-none">Aa</span> Title Case
              </button>
              <button onClick={minify} className="flex-1 py-3.5 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold shadow-md transition-all flex justify-center items-center gap-2">
                <AlignLeft size={18} /> Minify Space
              </button>
            </div>

            {/* Line Tools */}
            <div className="flex flex-wrap gap-4">
              <button onClick={removeDuplicateLines} className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
                <Filter size={18} /> Remove Duplicates
              </button>
              <button onClick={removeBlankLines} className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
                <Filter size={18} /> Remove Blank Lines
              </button>
              <button onClick={sortLines} className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
                Sort Lines A→Z
              </button>
              <button onClick={reverseText} className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all flex justify-center items-center gap-2">
                Reverse Text
              </button>
            </div>

            {/* Find & Replace */}
            <div className="bg-white/50 p-6 rounded-2xl border border-slate-200/50 shadow-md space-y-4 backdrop-blur-sm">
              <h3 className="font-extrabold text-slate-800 flex items-center gap-2"><Replace size={18} className="text-purple-500" /> Find & Replace</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Find text..."
                  value={findVal}
                  onChange={e => setFindVal(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                />
                <input
                  type="text"
                  placeholder="Replace with..."
                  value={replaceVal}
                  onChange={e => setReplaceVal(e.target.value)}
                  className="p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white"
                />
              </div>
              <button onClick={findAndReplace} className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all shadow-md">
                Replace All
              </button>
            </div>
          </div>

          {/* Analytics Column */}
          <div className="md:col-span-1">
            <div className="glass rounded-3xl p-6 border-t-4 border-t-purple-500 bg-white/30 backdrop-blur-md border border-slate-200/50 shadow-lg">
              <h3 className="font-extrabold text-slate-800 mb-6 uppercase tracking-wider text-xs flex items-center gap-1.5">
                Analytics
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Words", value: wordCount },
                  { label: "Characters", value: charCount },
                  { label: "Chars (no spaces)", value: charCountNoSpaces },
                  { label: "Lines", value: lineCount },
                  { label: "Sentences", value: sentenceCount },
                ].map(({ label, value }) => (
                  <div key={label} className="border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                    <div className="text-3xl font-black text-slate-900">{value}</div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible FAQ Section */}
        <section className="space-y-6 pt-12 border-t border-slate-200/60">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-purple-500" /> Text Tools FAQ
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl overflow-hidden border border-slate-200/50 bg-white/20">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors font-bold text-slate-700 text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-90 text-purple-600" : ""}`} />
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${openFaq === idx ? "max-h-40 border-t border-slate-100 p-5 bg-white/10" : "max-h-0"}`}>
                  <p className="text-slate-600 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
