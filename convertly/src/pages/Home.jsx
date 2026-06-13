import { useState } from "react";
import { Link } from "react-router-dom";
import { Image, FileText, Type, ChevronRight, Terminal, Shield, Zap, Sparkles, HelpCircle } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";

const tools = [
  {
    title: "Image Tools",
    description: "Compress, resize, format, flip, rotate, and crop profile pictures with zero quality loss.",
    icon: <Image className="text-blue-500" size={32} />,
    href: "/image-tools",
    color: "bg-blue-50/70 border-blue-100 hover:border-blue-300 hover:shadow-blue-100/50",
    badge: "sharp engine",
  },
  {
    title: "PDF & Word Tools",
    description: "Merge, split, watermark, rotate, convert images to PDF, and convert PDF ↔ Word.",
    icon: <FileText className="text-emerald-500" size={32} />,
    href: "/pdf-tools",
    color: "bg-emerald-50/70 border-emerald-100 hover:border-emerald-300 hover:shadow-emerald-100/50",
    badge: "1:1 layout",
  },
  {
    title: "Text Tools",
    description: "Word count, formatting, minification, sorting, case conversions and text transformations.",
    icon: <Type className="text-purple-500" size={32} />,
    href: "/text-tools",
    color: "bg-purple-50/70 border-purple-100 hover:border-purple-300 hover:shadow-purple-100/50",
    badge: "local client",
  },
  {
    title: "Developer Tools",
    description: "Format JSON, encode/decode Base64/URLs, generate secure passwords and SHA hashes.",
    icon: <Terminal className="text-amber-500" size={32} />,
    href: "/dev-tools",
    color: "bg-amber-50/70 border-amber-100 hover:border-amber-300 hover:shadow-amber-100/50",
    badge: "100% secure",
  },
];

const faqs = [
  {
    question: "Is GetConvertly completely free to use?",
    answer: "Yes, GetConvertly is 100% free with no registration, no subscription, and no hidden fees required. You can start converting and formatting documents immediately in your browser.",
  },
  {
    question: "Are my uploaded files safe and secure?",
    answer: "Absolutely. We guarantee a Zero File Retention policy. All files uploaded to our servers are permanently deleted the moment your conversion finishes. Furthermore, text and developer utilities are processed 100% locally in your browser – your data never leaves your computer.",
  },
  {
    question: "How does the PDF to Word converter achieve high-fidelity layouts?",
    answer: "Our Word & PDF conversions utilize ConvertAPI, a world-class dedicated rendering engine that maps exact fonts, structures, tables, page margins, and complex layout alignments 'as-is' so your files remain visually identical.",
  },
  {
    question: "Do you have file size restrictions?",
    answer: "We support uploads up to 50MB per file, which is exceptionally generous and fully covers almost all images, multi-page PDFs, and massive Microsoft Word documents.",
  },
];

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <>
      <SEO
        title="Free Online PDF, Image & Developer Tools"
        description="Convertly is your free all-in-one suite for 1:1 PDF/Word conversions, image compression, JSON formatting, and developer utilities. Secure and signup-free."
        keywords="free online tools, pdf merger, image compressor, json formatter, base64 encoder, pdf to word, word to pdf, profile picture maker"
        url="/"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Convertly",
          "url": "https://getconvertly.in",
          "description": "Free all-in-one suite for PDF, image, text, and developer tools.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://getconvertly.in/?q={search_term_string}",
            "query-input": "required name=search_term_string"
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

      {/* Background Decorative Blob Ornaments */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-blob animation-delay-2000 pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="space-y-24 max-w-6xl mx-auto">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-16 pb-6 relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-50 to-brand-100/50 border border-brand-200/50 rounded-full text-brand-700 text-sm font-semibold mb-2 shadow-sm">
            <Sparkles size={16} className="text-brand-500 animate-pulse" /> 100% Free All-In-One Toolkit
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-none">
            Transform Files with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700">
              Absolute Precision
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Compress images, merge PDFs, convert files, and format text instantly directly from your browser. 
            No signups. No hidden credit card hooks. Zero logs.
          </p>
          
        </section>

        {/* UTILITY GRID SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {tools.map((tool, idx) => (
            <Link 
              key={idx} 
              to={tool.href}
              className={`group relative overflow-hidden rounded-3xl p-8 border ${tool.color} transition-all duration-300 hover:shadow-2xl hover:-translate-y-2.5 bg-white/50 backdrop-blur-sm`}
            >
              <div className="absolute top-4 right-4 bg-white/80 border border-slate-200/50 px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider text-slate-500 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300">
                {tool.badge}
              </div>
              <div className="bg-white w-16 h-16 rounded-2xl shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300">
                {tool.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-brand-600 transition-colors">{tool.title}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                {tool.description}
              </p>
              <div className="flex items-center text-slate-900 font-bold group-hover:text-brand-700 transition-colors">
                Open Toolbox <ChevronRight size={18} className="ml-1 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </section>

        {/* Collapsible FAQ Section (Google Rank Catalyst) */}
        <section className="space-y-8 pt-12 border-t border-slate-200/60">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
              <HelpCircle size={28} className="text-brand-500" /> Frequently Asked Questions
            </h2>
            <p className="text-slate-500">Everything you need to know about Convertly safety, tools, and processing.</p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="glass rounded-2xl overflow-hidden border border-slate-200/50 transition-all duration-300 hover:border-slate-300"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center bg-white/30 hover:bg-slate-50/50 transition-colors font-bold text-slate-800"
                >
                  <span>{faq.question}</span>
                  <ChevronRight 
                    size={20} 
                    className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-90 text-brand-600" : ""}`} 
                  />
                </button>
                <div 
                  className={`transition-all duration-300 overflow-hidden ${openFaq === idx ? "max-h-40 border-t border-slate-100 bg-white/20 p-6" : "max-h-0"}`}
                >
                  <p className="text-slate-600 leading-relaxed text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </>
  );
}
