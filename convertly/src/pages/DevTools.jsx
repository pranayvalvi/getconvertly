import { useState } from "react";
import { Terminal, Lock, Code, Hash, Copy, Check, Link, Shield, Sparkles, HelpCircle, ChevronRight, QrCode, Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { Helmet } from "react-helmet-async";
import SEO from "../components/SEO";

const faqs = [
  {
    question: "Do you store the passwords or data formatted here?",
    answer: "No. Security is the foundation of our developer suite. Formatting JSON, encoding Base64/URLs, generating hashes, and compiling cryptographic passwords run 100% locally inside your web browser using HTML5 Web Crypto APIs. Your strings are never transmitted over the network.",
  },
  {
    question: "How secure is the Password Generator?",
    answer: "Extremely secure. We leverage the browser's built-in cryptographically strong pseudo-random number generator (`window.crypto.getRandomValues`) rather than native Math.random(), delivering mathematically unpredictable and high-entropy secure passkeys.",
  },
  {
    question: "Which hash algorithms are supported?",
    answer: "We support standard cryptographic hashing functions including SHA-1, SHA-256, SHA-384, and SHA-512, fully executed locally on your client machine using SubtleCrypto APIs.",
  },
];

export default function DevTools({ defaultTab = "json" }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [copied, setCopied] = useState(false);

  // QR Code
  const [qrInput, setQrInput] = useState("https://getconvertly.in");
  const [qrColor, setQrColor] = useState("#0f172a");
  const [qrBgColor, setQrBgColor] = useState("#ffffff");
  
  const downloadQR = () => {
    const canvas = document.getElementById("qr-canvas");
    if (!canvas) return;
    const pngUrl = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let downloadLink = document.createElement("a");
    downloadLink.href = pngUrl;
    downloadLink.download = `qrcode-${Date.now()}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // JSON
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");

  const formatJson = () => {
    try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); setJsonError(""); }
    catch { setJsonError("Invalid JSON"); setJsonOutput(""); }
  };
  const minifyJson = () => {
    try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput))); setJsonError(""); }
    catch { setJsonError("Invalid JSON"); setJsonOutput(""); }
  };

  // Base64
  const [b64Input, setB64Input] = useState("");
  const [b64Output, setB64Output] = useState("");
  const encodeB64 = () => { try { setB64Output(btoa(unescape(encodeURIComponent(b64Input)))); } catch { setB64Output("Error encoding"); } };
  const decodeB64 = () => { try { setB64Output(decodeURIComponent(escape(atob(b64Input)))); } catch { setB64Output("Error decoding — invalid Base64"); } };

  // Password
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdUpper, setPwdUpper] = useState(true);
  const [pwdNumbers, setPwdNumbers] = useState(true);
  const [pwdSymbols, setPwdSymbols] = useState(true);
  const [generatedPwd, setGeneratedPwd] = useState("");

  const [openFaq, setOpenFaq] = useState(null);

  const generatePassword = () => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const syms = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let chars = lower;
    if (pwdUpper) chars += upper;
    if (pwdNumbers) chars += nums;
    if (pwdSymbols) chars += syms;
    const array = new Uint32Array(pwdLength);
    crypto.getRandomValues(array);
    setGeneratedPwd(Array.from(array, (val) => chars[val % chars.length]).join(""));
  };

  // URL Encode/Decode
  const [urlInput, setUrlInput] = useState("");
  const [urlOutput, setUrlOutput] = useState("");
  const encodeUrl = () => { try { setUrlOutput(encodeURIComponent(urlInput)); } catch { setUrlOutput("Error encoding"); } };
  const decodeUrl = () => { try { setUrlOutput(decodeURIComponent(urlInput)); } catch { setUrlOutput("Error decoding — invalid URL encoding"); } };

  // Hash Generator
  const [hashInput, setHashInput] = useState("");
  const [hashOutput, setHashOutput] = useState("");
  const [hashAlgo, setHashAlgo] = useState("SHA-256");

  const generateHash = async () => {
    if (!hashInput) return;
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(hashInput);
      const hashBuffer = await crypto.subtle.digest(hashAlgo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      setHashOutput(hashArray.map(b => b.toString(16).padStart(2, "0")).join(""));
    } catch {
      setHashOutput("Error generating hash");
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    copied ? null : setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "json", label: "JSON", icon: <Code size={18} /> },
    { id: "base64", label: "Base64", icon: <Hash size={18} /> },
    { id: "url", label: "URL Encode", icon: <Link size={18} /> },
    { id: "hash", label: "Hash", icon: <Shield size={18} /> },
    { id: "password", label: "Password", icon: <Lock size={18} /> },
    { id: "qr", label: "QR Code", icon: <QrCode size={18} /> },
  ];

  return (
    <>
      <SEO
        title="Free Developer Tools: JSON, Base64, Hashes & Passwords"
        description="Format/minify JSON, encode/decode Base64 and URLs, generate SHA-256 hashes, and create secure cryptographic passwords instantly. 100% local."
        keywords="json formatter, base64 encoder, url encoder, sha256 hash generator, secure password generator, free developer tools"
        url="/dev-tools"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "GetConvertly Developer Tools",
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
      <div className="absolute bottom-24 right-10 w-80 h-80 bg-amber-200 rounded-full filter blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <Terminal className="text-amber-500" size={36} /> Developer Utilities
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">Quick, highly secure, browser-based utilities for developers with zero server transmission.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border border-slate-200/50 shadow-xl bg-white/40 backdrop-blur-md">
          <div className="flex border-b border-slate-200/60 bg-white/30 overflow-x-auto scrollbar-none">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[110px] py-4 flex items-center justify-center gap-2 font-bold transition-all duration-300
                  ${activeTab === tab.id ? "bg-amber-500 text-white shadow-lg shadow-amber-500/10" : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-800"}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8">
            {activeTab === "json" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none bg-white"
                    placeholder="Paste JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm"
                      placeholder="Output..."
                      value={jsonOutput}
                      readOnly
                    />
                    <button onClick={() => handleCopy(jsonOutput)} className="absolute top-2 right-2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600 transition-colors">
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-red-500 font-semibold">{jsonError}</span>
                  <div className="flex gap-3">
                    <button onClick={minifyJson} className="px-6 py-3 bg-slate-700 hover:bg-slate-800 text-white font-bold rounded-xl shadow transition-colors">Minify</button>
                    <button onClick={formatJson} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">Format</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "base64" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none bg-white"
                    placeholder="Input text..."
                    value={b64Input}
                    onChange={(e) => setB64Input(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm"
                      placeholder="Output..."
                      value={b64Output}
                      readOnly
                    />
                    <button onClick={() => handleCopy(b64Output)} className="absolute top-2 right-2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600 transition-colors">
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={encodeB64} className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow transition-colors">Encode</button>
                  <button onClick={decodeB64} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">Decode</button>
                </div>
              </div>
            )}

            {activeTab === "url" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <textarea
                    className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none bg-white"
                    placeholder="Input URL or text..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm"
                      placeholder="Output..."
                      value={urlOutput}
                      readOnly
                    />
                    <button onClick={() => handleCopy(urlOutput)} className="absolute top-2 right-2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600 transition-colors">
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button onClick={encodeUrl} className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow transition-colors">Encode URL</button>
                  <button onClick={decodeUrl} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">Decode URL</button>
                </div>
              </div>
            )}

            {activeTab === "hash" && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="font-bold text-slate-700 block text-sm">Algorithm</label>
                  <div className="flex gap-3 flex-wrap">
                    {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((algo) => (
                      <button
                        key={algo}
                        onClick={() => setHashAlgo(algo)}
                        className={`px-4 py-2 rounded-lg font-bold border-2 transition-colors ${hashAlgo === algo ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {algo}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none bg-white"
                  placeholder="Enter text to hash..."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                />
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/50 font-mono text-sm pr-12 outline-none"
                    placeholder="Hash output..."
                    value={hashOutput}
                    readOnly
                  />
                  <button onClick={() => handleCopy(hashOutput)} className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600 transition-colors">
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <button onClick={generateHash} className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">
                  Generate Hash
                </button>
              </div>
            )}

            {activeTab === "password" && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-6 text-2xl text-center rounded-xl border border-slate-200 bg-slate-50/50 font-mono tracking-wider font-extrabold outline-none"
                    placeholder="Click generate..."
                    value={generatedPwd}
                    readOnly
                  />
                  {generatedPwd && (
                    <button onClick={() => handleCopy(generatedPwd)} className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white rounded-lg shadow hover:bg-slate-100 text-slate-600 transition-colors">
                      {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                  )}
                </div>
                <div className="space-y-4 bg-white/70 p-6 rounded-xl border border-slate-200/50">
                  <div className="flex justify-between items-center">
                    <label className="font-bold text-slate-700">Length: {pwdLength}</label>
                    <input type="range" min="8" max="64" value={pwdLength} onChange={(e) => setPwdLength(Number(e.target.value))} className="w-1/2 accent-amber-500" />
                  </div>
                  {[
                    { label: "Include Uppercase", val: pwdUpper, set: setPwdUpper },
                    { label: "Include Numbers", val: pwdNumbers, set: setPwdNumbers },
                    { label: "Include Symbols", val: pwdSymbols, set: setPwdSymbols },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="flex items-center justify-between">
                      <label className="font-semibold text-slate-600">{label}</label>
                      <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="w-5 h-5 accent-amber-500 rounded" />
                    </div>
                  ))}
                </div>
                <button onClick={generatePassword} className="w-full px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold rounded-xl shadow transition-colors">
                  Generate Secure Password
                </button>
              </div>
            )}

            {activeTab === "qr" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <label className="font-bold text-slate-700 block text-sm">Content (URL, text, phone)</label>
                    <textarea
                      className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none bg-white"
                      placeholder="https://yourwebsite.com"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="font-bold text-slate-700 block mb-2 text-sm">QR Color</label>
                        <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} className="w-full h-12 rounded cursor-pointer" />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-2 text-sm">Background</label>
                        <input type="color" value={qrBgColor} onChange={(e) => setQrBgColor(e.target.value)} className="w-full h-12 rounded cursor-pointer" />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-center p-8 bg-white/70 rounded-3xl border border-slate-200/50 shadow-sm">
                    <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                      <QRCodeCanvas 
                        id="qr-canvas"
                        value={qrInput || "https://getconvertly.in"} 
                        size={220} 
                        fgColor={qrColor}
                        bgColor={qrBgColor}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <button onClick={downloadQR} className="mt-6 w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors flex justify-center items-center gap-2">
                      <Download size={18} /> Download QR PNG
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible FAQ Section */}
        <section className="space-y-6 pt-12 border-t border-slate-200/60">
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-amber-500" /> Dev Tools FAQ
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="glass rounded-2xl overflow-hidden border border-slate-200/50 bg-white/20">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50/50 transition-colors font-bold text-slate-700 text-sm"
                >
                  <span>{faq.question}</span>
                  <ChevronRight size={16} className={`text-slate-400 transition-transform duration-300 ${openFaq === idx ? "rotate-90 text-amber-600" : ""}`} />
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
