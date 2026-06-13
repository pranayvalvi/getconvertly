import { useState, useRef, useEffect } from "react";
import { Upload, Download, RefreshCw, AlertCircle, File as FileIcon, X, FilePlus, SplitSquareHorizontal, PenTool, FileText, RotateCw, Sparkles, HelpCircle, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";
import { useHistory } from "../hooks/useHistory";

const faqs = [
  {
    question: "Is there a limit to how many PDFs I can merge at once?",
    answer: "You can merge up to 20 PDF files together in a single conversion pass. The combined uploaded file size limit is 50MB.",
  },
  {
    question: "Can I convert protected or password-locked PDFs?",
    answer: "For security and privacy reasons, we do not parse or process password-encrypted files. Please unlock your PDF before uploading it for splitting, merging, or watermarking.",
  },
  {
    question: "How does the watermark text positioning operate?",
    answer: "Our watermark tool automatically places a bold, translucent, and professional 45-degree angled text stamp (customized by you) directly in the center of every page of your PDF without covering the underlying text content.",
  },
];

export default function PDFTools({ defaultTab = "merge" }) {
  const { addHistoryItem } = useHistory();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [files, setFiles] = useState([]);
  const [singleFile, setSingleFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [splitPages, setSplitPages] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [rotateAngle, setRotateAngle] = useState("90");

  const [openFaq, setOpenFaq] = useState(null);

  const resetState = () => { setFiles([]); setSingleFile(null); setDownloadUrl(null); setError(""); setProgress(0); };
  const handleTabChange = (tabId) => { setActiveTab(tabId); resetState(); };

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      const selectedFiles = Array.from(e.detail.files);
      if (activeTab === "merge" || activeTab === "images-to-pdf") {
        setFiles(prev => [...prev, ...selectedFiles]);
      } else {
        setSingleFile(selectedFiles[0]);
      }
      setDownloadUrl(null);
      setError("");
    };
    window.addEventListener("globalFileDrop", handleGlobalDrop);
    return () => window.removeEventListener("globalFileDrop", handleGlobalDrop);
  }, [activeTab]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (activeTab === "merge" || activeTab === "images-to-pdf") {
      setFiles(prev => [...prev, ...selectedFiles]);
    } else {
      setSingleFile(selectedFiles[0]);
    }
    setDownloadUrl(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (files.length === 1) setDownloadUrl(null);
  };

  const processApi = async () => {
    setError("");
    const formData = new FormData();
    let endpoint = "";

    if (activeTab === "merge") {
      if (files.length < 2) return setError("Select at least 2 PDFs");
      files.forEach(f => formData.append("pdfs", f));
      endpoint = "/merge";
    } else if (activeTab === "images-to-pdf") {
      if (files.length < 1) return setError("Select at least 1 image");
      files.forEach(f => formData.append("images", f));
      endpoint = "/images-to-pdf";
    } else if (activeTab === "split") {
      if (!singleFile) return setError("Select a PDF");
      formData.append("pdf", singleFile);
      formData.append("pages", splitPages);
      endpoint = "/split";
    } else if (activeTab === "watermark") {
      if (!singleFile) return setError("Select a PDF");
      formData.append("pdf", singleFile);
      formData.append("text", watermarkText);
      endpoint = "/watermark";
    } else if (activeTab === "rotate") {
      if (!singleFile) return setError("Select a PDF");
      formData.append("pdf", singleFile);
      formData.append("angle", rotateAngle);
      endpoint = "/rotate";
    } else if (activeTab === "pdf-to-docx") {
      if (!singleFile) return setError("Select a PDF");
      formData.append("pdf", singleFile);
      endpoint = "/pdf-to-docx";
    } else if (activeTab === "docx-to-pdf") {
      if (!singleFile) return setError("Select a Word document (.docx)");
      formData.append("word", singleFile);
      endpoint = "/docx-to-pdf";
    }

    setIsProcessing(true);
    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) return 95;
        return prev + Math.floor(Math.random() * 8) + 2;
      });
    }, 500);

    try {
      const rawApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const API_URL = rawApiUrl.replace(/\/$/, "");
      const response = await fetch(`${API_URL}/api/pdf${endpoint}`, { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        clearInterval(progressInterval);
        setProgress(100);
        addHistoryItem({
          filename: data.filename || `converted-${Date.now()}.pdf`,
          downloadUrl: data.downloadUrl,
          toolName: `PDF ${activeTab}`
        });
        setTimeout(() => setDownloadUrl(data.downloadUrl), 500);
      } else {
        throw new Error(data.error || "Processing failed");
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setTimeout(() => setIsProcessing(false), 500);
    }
  };

  const tabs = [
    { id: "merge", label: "Merge", icon: <FilePlus size={18} /> },
    { id: "split", label: "Split", icon: <SplitSquareHorizontal size={18} /> },
    { id: "images-to-pdf", label: "Images to PDF", icon: <FileIcon size={18} /> },
    { id: "watermark", label: "Watermark", icon: <PenTool size={18} /> },
    { id: "rotate", label: "Rotate", icon: <RotateCw size={18} /> },
    { id: "pdf-to-docx", label: "PDF to Word", icon: <FileText size={18} /> },
    { id: "docx-to-pdf", label: "Word to PDF", icon: <FileIcon size={18} /> },
  ];

  const needsMultipleFiles = activeTab === "merge" || activeTab === "images-to-pdf";
  const hasFiles = needsMultipleFiles ? files.length > 0 : !!singleFile;

  let acceptType = "application/pdf";
  if (activeTab === "images-to-pdf") acceptType = "image/jpeg,image/png";
  else if (activeTab === "docx-to-pdf") acceptType = ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  let dropzoneInstruction = "Select PDF files";
  if (activeTab === "images-to-pdf") dropzoneInstruction = "Select JPG or PNG images";
  else if (activeTab === "docx-to-pdf") dropzoneInstruction = "Select Word (.docx) document";

  return (
    <>
      <SEO
        title="Free PDF & Word Tools: Merge, Convert, Split, Watermark"
        description="Merge multiple PDFs, split page ranges, watermark pages, rotate view, convert images to PDF, and convert PDF ↔ Word online instantly. 100% free."
        keywords="pdf merger, split pdf online, rotate pdf, images to pdf converter, watermark pdf, pdf to word, word to pdf, free pdf tools"
        url="/pdf-tools"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "GetConvertly PDF & Word Tools",
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
      <div className="absolute top-24 right-10 w-80 h-80 bg-emerald-200 rounded-full filter blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <FileText className="text-emerald-500" size={36} /> PDF & Word Utilities
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">Merge, split, watermark, rotate, and perform pixel-perfect conversions.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl bg-white/40 backdrop-blur-md">
          <div className="flex border-b border-slate-200/60 bg-white/30 overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[120px] py-4 flex items-center justify-center gap-2 font-bold transition-all duration-300
                  ${activeTab === tab.id ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/10" : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-800"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-8">
            {!hasFiles ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  const selectedFiles = Array.from(e.dataTransfer.files);
                  if (activeTab === "merge" || activeTab === "images-to-pdf") {
                    setFiles(prev => [...prev, ...selectedFiles]);
                  } else {
                    setSingleFile(selectedFiles[0]);
                  }
                  setDownloadUrl(null);
                  setError("");
                }}
                className="border-2 border-dashed border-emerald-300 bg-emerald-50/50 rounded-2xl p-12 text-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept={acceptType}
                  multiple={needsMultipleFiles}
                  className="hidden"
                />
                <Upload size={48} className="mx-auto text-emerald-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Click or Drag Files Here</h3>
                <p className="text-slate-500 text-sm">{dropzoneInstruction}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {needsMultipleFiles ? (
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-700">Files added ({files.length}):</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {files.map((f, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                          <span className="truncate text-sm font-semibold text-slate-700">{f.name}</span>
                          <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500 transition-colors"><X size={18} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="truncate font-semibold text-slate-700">{singleFile.name}</span>
                    <button onClick={() => setSingleFile(null)} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Clear</button>
                  </div>
                )}

                {activeTab === "split" && (
                  <div className="bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm space-y-2">
                    <label className="font-bold text-slate-700 text-sm">Pages to extract (Optional)</label>
                    <input type="text" placeholder="e.g. 1, 3, 5-8" value={splitPages} onChange={e => setSplitPages(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none" />
                    <p className="text-xs text-slate-400">Leave blank to extract all pages.</p>
                  </div>
                )}

                {activeTab === "watermark" && (
                  <div className="bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm space-y-2">
                    <label className="font-bold text-slate-700 text-sm">Watermark Text</label>
                    <input type="text" placeholder="COMPANY CONFIDENTIAL" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none text-lg font-bold uppercase tracking-wider" />
                  </div>
                )}

                {activeTab === "rotate" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <label className="font-bold text-slate-700 block text-sm">Rotation Angle (applied to all pages)</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["90", "180", "270"].map((a) => (
                        <button
                          key={a}
                          onClick={() => setRotateAngle(a)}
                          className={`py-3 rounded-xl font-bold border-2 transition-all duration-300 ${rotateAngle === a ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {a}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "pdf-to-docx" && (
                  <div className="bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm space-y-2">
                    <p className="text-slate-600 text-sm">Converts your PDF document into an editable Microsoft Word (.docx) file containing all extracted text with fluid paragraphs.</p>
                  </div>
                )}

                {activeTab === "docx-to-pdf" && (
                  <div className="bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm space-y-2">
                    <p className="text-slate-600 text-sm">Converts your Microsoft Word (.docx) document into a standard, ready-to-share PDF document preserving rich text styles.</p>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}

                {!downloadUrl ? (
                  <div className="space-y-3">
                    <button
                      onClick={processApi}
                      disabled={isProcessing}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                      {isProcessing ? <><RefreshCw className="animate-spin" /> Processing...</> : "Process File(s)"}
                    </button>
                    {isProcessing && (
                      <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden shadow-inner">
                        <div 
                          className="bg-emerald-600 h-3 rounded-full transition-all duration-300 ease-out flex items-center justify-end px-2" 
                          style={{ width: `${progress}%` }}
                        >
                          {progress > 10 && <span className="text-[10px] font-bold text-white drop-shadow-sm">{progress}%</span>}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <a href={downloadUrl} download className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center gap-2 transition-all hover:shadow-emerald-500/20 hover:-translate-y-0.5">
                    <Download size={24} /> Download Result
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Collapsible FAQ Section */}
        <section className="space-y-6 pt-12 border-t border-slate-200/60">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-emerald-500" /> PDF Tools FAQ
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl overflow-hidden border border-slate-200/50 bg-white/20">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors font-bold text-slate-700 text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-90 text-emerald-600" : ""}`} />
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
