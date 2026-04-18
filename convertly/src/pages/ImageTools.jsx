import { useState, useRef } from "react";
import { Upload, Download, RefreshCw, AlertCircle, Image as ImageIcon, Crop, FileArchive, Scissors } from "lucide-react";
import SEO from "../components/SEO";

export default function ImageTools() {
  const [activeTab, setActiveTab] = useState("compress");
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Compress State
  const [quality, setQuality] = useState(60);

  // Convert State
  const [targetFormat, setTargetFormat] = useState("png");

  // Resize State
  const [resizeWidth, setResizeWidth] = useState("");
  const [resizeHeight, setResizeHeight] = useState("");

  // Profile Pic State
  const [profileSize, setProfileSize] = useState(500);

  const resetState = () => {
    setDownloadUrl(null);
    setError("");
    setFile(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    resetState();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile);
      setDownloadUrl(null);
      setError("");
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
    if (activeTab === "compress") {
      endpoint = "/compress";
      formData.append("quality", quality);
    } else if (activeTab === "convert") {
      endpoint = "/convert";
      formData.append("format", targetFormat);
    } else if (activeTab === "resize") {
      endpoint = "/resize";
      if (resizeWidth) formData.append("width", resizeWidth);
      if (resizeHeight) formData.append("height", resizeHeight);
    } else if (activeTab === "profile") {
      endpoint = "/profile-pic";
      formData.append("size", profileSize);
    }

    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${API_URL}/api/image${endpoint}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
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
  ];

  return (
    <>
      <SEO 
        title="Free Image Tools"
        description="Compress, convert, and resize images or make perfect profile pictures online for free. Support for JPG, PNG, WebP safely in your browser."
        keywords="image compressor, convert png to jpg, resize image online, profile picture maker, free image tools"
        url="/image-tools"
      />
      <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <ImageIcon className="text-blue-500" size={36} /> Image Tools
        </h1>
        <p className="text-slate-600">Compress, resize, convert, and crop images.</p>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-t-4 border-t-blue-500">
        <div className="flex border-b border-slate-200 bg-white/50 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex-1 min-w-[120px] py-4 flex items-center justify-center gap-2 font-semibold transition-colors
                ${activeTab === tab.id ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-8 space-y-8">
          {!file ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-300 bg-blue-50 rounded-2xl p-12 text-center cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*" 
                className="hidden" 
              />
              <Upload size={48} className="mx-auto text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Click or Drag Image Here</h3>
              <p className="text-slate-500">Supports JPG, PNG, WebP up to 50MB</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="truncate font-medium text-slate-700">{file.name}</div>
                <button 
                  onClick={() => setFile(null)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  Clear
                </button>
              </div>

              {activeTab === "compress" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <div className="flex justify-between">
                    <label className="font-semibold text-slate-700">Quality</label>
                    <span className="text-blue-600 font-bold">{quality}%</span>
                  </div>
                  <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
              )}

              {activeTab === "convert" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <label className="font-semibold text-slate-700 block">Target Format</label>
                  <select 
                    value={targetFormat} 
                    onChange={(e) => setTargetFormat(e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="png">PNG</option>
                    <option value="jpeg">JPG / JPEG</option>
                    <option value="webp">WebP</option>
                    <option value="gif">GIF</option>
                  </select>
                </div>
              )}

              {activeTab === "resize" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                  <p className="text-sm text-slate-500 mb-2">Leave one field empty to maintain aspect ratio.</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Width (px)</label>
                      <input type="number" placeholder="Auto" value={resizeWidth} onChange={(e) => setResizeWidth(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Height (px)</label>
                      <input type="number" placeholder="Auto" value={resizeHeight} onChange={(e) => setResizeHeight(e.target.value)} className="w-full p-3 border border-slate-200 rounded-lg" />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "profile" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                   <p className="text-sm text-slate-500 mb-2">Image will be cropped to a circle with transparent background.</p>
                  <div className="flex justify-between">
                    <label className="font-semibold text-slate-700">Size (Width & Height)</label>
                    <span className="text-blue-600 font-bold">{profileSize}px</span>
                  </div>
                  <input type="range" min="100" max="1000" step="50" value={profileSize} onChange={(e) => setProfileSize(Number(e.target.value))} className="w-full accent-blue-500" />
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                  <AlertCircle size={20} />
                  {error}
                </div>
              )}

              {!downloadUrl ? (
                <button 
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold text-lg shadow-lg transition-all disabled:opacity-70 flex justify-center items-center gap-2"
                >
                  {isProcessing ? <><RefreshCw className="animate-spin" /> Processing...</> : "Process Image"}
                </button>
              ) : (
                <a 
                  href={downloadUrl}
                  download
                  className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2"
                >
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
