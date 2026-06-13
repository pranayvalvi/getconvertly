import { useState, useRef, useEffect } from "react";
import { Upload, Download, RefreshCw, AlertCircle, Image as ImageIcon, Crop, FileArchive, Scissors, FlipHorizontal, RotateCw, Moon, Sparkles, HelpCircle, ChevronRight } from "lucide-react";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";
import { useHistory } from "../hooks/useHistory";

const faqs = [
  {
    question: "Does compressing images reduce their visual quality?",
    answer: "Our engine uses Sharp, the fastest and most robust image processing library. When you set the quality slider (e.g., 60%), it optimizes the compression table and strips unnecessary metadata, achieving up to 80% file size reduction with zero visible loss in clarity.",
  },
  {
    question: "Which image formats are supported by GetConvertly?",
    answer: "We support converting, resizing, and optimizing all popular formats including JPEG/JPG, PNG, WebP, and animated GIF formats. The maximum uploaded file size is 50MB.",
  },
  {
    question: "How does the Circular Profile Picture Maker work?",
    answer: "It scales your uploaded image to your custom size (e.g. 500x500px) using high-fidelity cover aspect fitting, applies a mathematically perfect circular SVG vector mask, and outputs a transparent PNG format ready to use on any social media profile.",
  },
];

export default function ImageTools({ defaultTab = "compress" }) {
  const { addHistoryItem } = useHistory();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const [quality, setQuality] = useState(60);
  const [targetFormat, setTargetFormat] = useState("png");
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");
  const [profileSize, setProfileSize] = useState(500);
  const [flipDirection, setFlipDirection] = useState("horizontal");
  const [rotateAngle, setRotateAngle] = useState("90");

  const [openFaq, setOpenFaq] = useState(null);

  const resetState = () => { setDownloadUrl(null); setError(""); setFile(null); };
  const handleTabChange = (tabId) => { setActiveTab(tabId); resetState(); };

  useEffect(() => {
    const handleGlobalDrop = (e) => {
      const selectedFile = e.detail.file;
      if (selectedFile && selectedFile.type.startsWith("image/")) {
        setFile(selectedFile);
        setDownloadUrl(null);
        setError("");
      }
    };
    window.addEventListener("globalFileDrop", handleGlobalDrop);
    return () => window.removeEventListener("globalFileDrop", handleGlobalDrop);
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile); setDownloadUrl(null); setError("");
    } else {
      setError("Please select a valid image file.");
    }
  };

  const processImage = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError("");
    const formData = new FormData();
    formData.append("image", file);
    let endpoint = "";

    if (activeTab === "compress") { endpoint = "/compress"; formData.append("quality", quality); }
    else if (activeTab === "convert") { endpoint = "/convert"; formData.append("format", targetFormat); }
    else if (activeTab === "resize") {
      endpoint = "/resize";
      if (resizeWidth) formData.append("width", resizeWidth);
      if (resizeHeight) formData.append("height", resizeHeight);
    }
    else if (activeTab === "profile") { endpoint = "/profile-pic"; formData.append("size", profileSize); }
    else if (activeTab === "grayscale") { endpoint = "/grayscale"; }
    else if (activeTab === "flip") { endpoint = "/flip"; formData.append("direction", flipDirection); }
    else if (activeTab === "rotate") { endpoint = "/rotate"; formData.append("angle", rotateAngle); }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/image${endpoint}`, { method: "POST", body: formData });
      const data = await response.json();
      if (response.ok) {
        addHistoryItem({
          filename: data.filename || `image-${Date.now()}.${targetFormat || 'png'}`,
          downloadUrl: data.downloadUrl,
          toolName: `Image ${activeTab}`
        });
        setDownloadUrl(data.downloadUrl);
      } else {
        throw new Error(data.error || "Failed to process image");
      }
    } catch (err) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsProcessing(false);
    }
  };

  const tabs = [
    { id: "compress", label: "Compress", icon: <FileArchive size={18} /> },
    { id: "convert", label: "Convert", icon: <ImageIcon size={18} /> },
    { id: "resize", label: "Resize", icon: <Scissors size={18} /> },
    { id: "profile", label: "Profile Pic", icon: <Crop size={18} /> },
    { id: "grayscale", label: "Grayscale", icon: <Moon size={18} /> },
    { id: "flip", label: "Flip", icon: <FlipHorizontal size={18} /> },
    { id: "rotate", label: "Rotate", icon: <RotateCw size={18} /> },
  ];

  return (
    <>
      <SEO
        title="Free Image Tools: Compress, Convert & Resize Online"
        description="Compress JPG/PNG, convert formats, resize pixel ratios, grayscale, crop profile pictures, flip, and rotate images online instantly. 100% free."
        keywords="image compressor, convert png to jpg, resize image online, flip image, rotate image, grayscale image, profile picture maker, resize jpeg"
        url="/image-tools"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "GetConvertly Image Tools",
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
      <div className="absolute top-24 left-10 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <ImageIcon className="text-blue-500" size={36} /> Image Utilities
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">Compress, resize, convert format, flip, rotate and mask your images instantly.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl bg-white/40 backdrop-blur-md">
          <div className="flex border-b border-slate-200/60 bg-white/30 overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex-1 min-w-[110px] py-4 flex items-center justify-center gap-2 font-bold transition-all duration-300
                  ${activeTab === tab.id ? "bg-blue-500 text-white shadow-lg shadow-blue-500/10" : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-800"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 space-y-8">
            {!file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { 
                  e.preventDefault(); 
                  const selectedFile = e.dataTransfer.files[0]; 
                  if (selectedFile && selectedFile.type.startsWith("image/")) { 
                    setFile(selectedFile); setDownloadUrl(null); setError(""); 
                  } else { 
                    setError("Please select a valid image file."); 
                  } 
                }}
                className="border-2 border-dashed border-blue-300 bg-blue-50/50 rounded-2xl p-12 text-center cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-all duration-300"
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <Upload size={48} className="mx-auto text-blue-500 mb-4 animate-bounce" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">Click or Drag Image Here</h3>
                <p className="text-slate-500 text-sm">Supports JPG, PNG, WebP, GIF up to 50MB</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="truncate font-semibold text-slate-700">{file.name}</div>
                  <button onClick={() => setFile(null)} className="text-sm font-bold text-slate-400 hover:text-red-500 transition-colors">Clear</button>
                </div>

                {activeTab === "compress" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-700">Quality Ratio</label>
                      <span className="text-blue-600 font-extrabold text-lg">{quality}%</span>
                    </div>
                    <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                )}

                {activeTab === "convert" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <label className="font-bold text-slate-700 block">Target Format</label>
                    <select value={targetFormat} onChange={(e) => setTargetFormat(e.target.value)} className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none">
                      <option value="png">PNG</option>
                      <option value="jpeg">JPG / JPEG</option>
                      <option value="webp">WebP</option>
                      <option value="gif">GIF</option>
                    </select>
                  </div>
                )}

                {activeTab === "resize" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <p className="text-sm text-slate-500">Leave one field empty to maintain the image aspect ratio automatically.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1 text-sm">Width (px)</label>
                        <input type="number" placeholder="Auto" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1 text-sm">Height (px)</label>
                        <input type="number" placeholder="Auto" value={resizeHeight} onChange={(e) => setResizeHeight(e.target.value)} className="w-full p-3 border border-slate-200 rounded-xl outline-none" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "profile" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <p className="text-sm text-slate-500">Image will be cropped to a perfect circle with a transparent background.</p>
                    <div className="flex justify-between items-center">
                      <label className="font-bold text-slate-700">Size (Width & Height)</label>
                      <span className="text-blue-600 font-extrabold text-lg">{profileSize}px</span>
                    </div>
                    <input type="range" min="100" max="1000" step="50" value={profileSize} onChange={(e) => setProfileSize(Number(e.target.value))} className="w-full accent-blue-500" />
                  </div>
                )}

                {activeTab === "grayscale" && (
                  <div className="bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <p className="text-slate-600 text-sm">Converts your image to black & white. Output will be generated in transparent PNG format.</p>
                  </div>
                )}

                {activeTab === "flip" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <label className="font-bold text-slate-700 block">Flip Direction</label>
                    <div className="grid grid-cols-2 gap-4">
                      {["horizontal", "vertical"].map((d) => (
                        <button
                          key={d}
                          onClick={() => setFlipDirection(d)}
                          className={`py-3 rounded-xl font-bold border-2 transition-all duration-300 capitalize ${flipDirection === d ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "rotate" && (
                  <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50 shadow-sm">
                    <label className="font-bold text-slate-700 block">Rotation Angle</label>
                    <div className="grid grid-cols-3 gap-4">
                      {["90", "180", "270"].map((a) => (
                        <button
                          key={a}
                          onClick={() => setRotateAngle(a)}
                          className={`py-3 rounded-xl font-bold border-2 transition-all duration-300 ${rotateAngle === a ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                        >
                          {a}°
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} /> {error}
                  </div>
                )}

                {!downloadUrl ? (
                  <button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-blue-500/20 hover:-translate-y-0.5 transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                  >
                    {isProcessing ? <><RefreshCw className="animate-spin" /> Processing...</> : "Process Image"}
                  </button>
                ) : (
                  <a href={downloadUrl} download className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 transition-all hover:shadow-emerald-500/20 hover:-translate-y-0.5">
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
            <HelpCircle size={24} className="text-blue-500" /> Image Tools FAQ
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl overflow-hidden border border-slate-200/50 bg-white/20">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors font-bold text-slate-700 text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-90 text-blue-600" : ""}`} />
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
