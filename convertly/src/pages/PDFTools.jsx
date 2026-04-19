import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, AlertCircle, File as FileIcon, X, FilePlus, SplitSquareHorizontal, PenTool, FileText, RotateCw } from "lucide-react";
import SEO from "../components/SEO";

export default function PDFTools() {
  const [activeTab, setActiveTab] = useState("merge");
  const [files, setFiles] = useState([]);
  const [singleFile, setSingleFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [splitPages, setSplitPages] = useState("");
  const [watermarkText, setWatermarkText] = useState("CONFIDENTIAL");
  const [rotateAngle, setRotateAngle] = useState("90");

  const resetState = () => { setFiles([]); setSingleFile(null); setDownloadUrl(null); setError(""); };
  const handleTabChange = (tabId) => { setActiveTab(tabId); resetState(); };

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
    }

    setIsProcessing(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/pdf${endpoint}`, { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) setDownloadUrl(data.downloadUrl);
      else throw new Error(data.error || "Processing failed");
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "merge", label: "Merge", icon: <FilePlus size={18} /> },
    { id: "split", label: "Split", icon: <SplitSquareHorizontal size={18} /> },
    { id: "images-to-pdf", label: "Images to PDF", icon: <FileIcon size={18} /> },
    { id: "watermark", label: "Watermark", icon: <PenTool size={18} /> },
    { id: "rotate", label: "Rotate", icon: <RotateCw size={18} /> },
  ];

  const needsMultipleFiles = activeTab === "merge" || activeTab === "images-to-pdf";
  const hasFiles = needsMultipleFiles ? files.length > 0 : !!singleFile;

  return (
    <>
      <SEO
        title="Free PDF Tools"
        description="Merge, split, watermark, rotate, and convert images to PDFs instantly online. 100% free with no registration required."
        keywords="pdf merger, split pdf online, rotate pdf, images to pdf converter, watermark pdf, free pdf tools"
        url="/pdf-tools"
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <FileText className="text-emerald-500" size={36} /> PDF Tools
          </h1>
          <p className="text-slate-600">Merge, split, watermark, rotate, and convert PDFs.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border-t-4 border-t-emerald-500">
          <div className="flex border-b border-slate-200 bg-white/50 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[120px] py-4 flex items-center justify-center gap-2 font-semibold transition-colors
                  ${activeTab === tab.id ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500" : "text-slate-500 hover:bg-slate-50"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-8">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 bg-emerald-50 rounded-2xl p-8 text-center cursor-pointer hover:bg-emerald-100 transition-colors"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept={activeTab === "images-to-pdf" ? "image/jpeg,image/png" : "application/pdf"}
                multiple={needsMultipleFiles}
                className="hidden"
              />
              <Upload size={36} className="mx-auto text-emerald-500 mb-2" />
              <h3 className="text-lg font-semibold mb-1">Click or Drag Files Here</h3>
              <p className="text-slate-500 text-sm">
                {activeTab === "images-to-pdf" ? "Select JPG or PNG images" : "Select PDF files"}
              </p>
            </div>

            {hasFiles && (
              <div className="space-y-6">
                {needsMultipleFiles ? (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-700">Files added ({files.length}):</h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {files.map((f, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-white p-3 border border-slate-200 rounded-lg shadow-sm">
                          <span className="truncate text-sm font-medium text-slate-700">{f.name}</span>
                          <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500"><X size={18} /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="truncate font-medium text-slate-700">{singleFile.name}</span>
                    <button onClick={() => setSingleFile(null)} className="text-slate-400 hover:text-red-500">Clear</button>
                  </div>
                )}

                {activeTab === "split" && (
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <label className="font-semibold text-slate-700">Pages to extract (Optional)</label>
                    <input type="text" placeholder="e.g. 1, 3, 5-8" value={splitPages} onChange={e => setSplitPages(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500" />
                    <p className="text-xs text-slate-500">Leave blank to extract all pages.</p>
                  </div>
                )}

                {activeTab === "watermark" && (
                  <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm space-y-2">
                    <label className="font-semibold text-slate-700">Watermark Text</label>
                    <input type="text" placeholder="COMPANY CONFIDENTIAL" value={watermarkText} onChange={e => setWatermarkText(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 text-lg font-bold uppercase tracking-wider" />
                  </div>
                )}

                {activeTab === "rotate" && (
                  <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <label className="font-semibold text-slate-700 block">Rotation Angle (applied to all pages)</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["90", "180", "270"].map((a) => (
                        <button
                          key={a}
                          onClick={() => setRotateAngle(a)}
                          className={`py-3 rounded-xl font-semibold border-2 transition-colors ${rotateAngle === a ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {a}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 text-sm">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}

                {!downloadUrl ? (
                  <button
                    onClick={processApi}
                    disabled={isProcessing}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? <><RefreshCw className="animate-spin" /> Processing...</> : "Process File(s)"}
                  </button>
                ) : (
                  <a href={downloadUrl} download className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center gap-2">
                    <Download size={24} /> Download Result
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
