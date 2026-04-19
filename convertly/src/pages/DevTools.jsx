import { useState } from "react";
import { Terminal, Lock, Code, Hash, Copy, Check, Link, Shield } from "lucide-react";
import SEO from "../components/SEO";

export default function DevTools() {
  const [activeTab, setActiveTab] = useState("json");
  const [copied, setCopied] = useState(false);

  // JSON
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");

  const formatJson = () => {
    try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); setJsonError(""); }
    catch (e) { setJsonError("Invalid JSON"); setJsonOutput(""); }
  };
  const minifyJson = () => {
    try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput))); setJsonError(""); }
    catch (e) { setJsonError("Invalid JSON"); setJsonOutput(""); }
  };

  // Base64
  const [b64Input, setB64Input] = useState("");
  const [b64Output, setB64Output] = useState("");
  const encodeB64 = () => { try { setB64Output(btoa(unescape(encodeURIComponent(b64Input)))); } catch (e) { setB64Output("Error encoding"); } };
  const decodeB64 = () => { try { setB64Output(decodeURIComponent(escape(atob(b64Input)))); } catch (e) { setB64Output("Error decoding — invalid Base64"); } };

  // Password
  const [pwdLength, setPwdLength] = useState(16);
  const [pwdUpper, setPwdUpper] = useState(true);
  const [pwdNumbers, setPwdNumbers] = useState(true);
  const [pwdSymbols, setPwdSymbols] = useState(true);
  const [generatedPwd, setGeneratedPwd] = useState("");

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
  const encodeUrl = () => { try { setUrlOutput(encodeURIComponent(urlInput)); } catch (e) { setUrlOutput("Error encoding"); } };
  const decodeUrl = () => { try { setUrlOutput(decodeURIComponent(urlInput)); } catch (e) { setUrlOutput("Error decoding — invalid URL encoding"); } };

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
    } catch (e) {
      setHashOutput("Error generating hash");
    }
  };

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "json", label: "JSON", icon: <Code size={18} /> },
    { id: "base64", label: "Base64", icon: <Hash size={18} /> },
    { id: "url", label: "URL Encode", icon: <Link size={18} /> },
    { id: "hash", label: "Hash", icon: <Shield size={18} /> },
    { id: "password", label: "Password", icon: <Lock size={18} /> },
  ];

  return (
    <>
      <SEO
        title="Free Developer Tools"
        description="Format JSON, encode/decode Base64 and URLs, generate SHA-256 hashes, and create secure passwords instantly in your browser."
        keywords="json formatter, base64 encoder, url encoder, sha256 hash generator, secure password generator, free developer tools"
        url="/dev-tools"
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
            <Terminal className="text-amber-500" size={36} /> Developer Tools
          </h1>
          <p className="text-slate-600">Quick, secure, browser-based utilities for developers.</p>
        </div>

        <div className="glass rounded-3xl overflow-hidden border-t-4 border-t-amber-500">
          <div className="flex border-b border-slate-200 bg-white/50 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[110px] py-4 flex items-center justify-center gap-2 font-semibold transition-colors
                  ${activeTab === tab.id ? "bg-amber-50 text-amber-700 border-b-2 border-amber-500" : "text-slate-500 hover:bg-slate-50"}`}
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
                    className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none"
                    placeholder="Paste JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm"
                      placeholder="Output..."
                      value={jsonOutput}
                      readOnly
                    />
                    <button onClick={() => handleCopy(jsonOutput)} className="absolute top-2 right-2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600">
                      {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between items-center gap-3">
                  <span className="text-red-500 font-medium">{jsonError}</span>
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
                    className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none"
                    placeholder="Input text..."
                    value={b64Input}
                    onChange={(e) => setB64Input(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm"
                      placeholder="Output..."
                      value={b64Output}
                      readOnly
                    />
                    <button onClick={() => handleCopy(b64Output)} className="absolute top-2 right-2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600">
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
                    className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none"
                    placeholder="Input URL or text..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                  />
                  <div className="relative">
                    <textarea
                      className="w-full h-48 p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm"
                      placeholder="Output..."
                      value={urlOutput}
                      readOnly
                    />
                    <button onClick={() => handleCopy(urlOutput)} className="absolute top-2 right-2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600">
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
                  <label className="font-semibold text-slate-700 block">Algorithm</label>
                  <div className="flex gap-3 flex-wrap">
                    {["SHA-1", "SHA-256", "SHA-384", "SHA-512"].map((algo) => (
                      <button
                        key={algo}
                        onClick={() => setHashAlgo(algo)}
                        className={`px-4 py-2 rounded-lg font-semibold border-2 transition-colors ${hashAlgo === algo ? "border-amber-500 bg-amber-50 text-amber-700" : "border-slate-200 text-slate-600 hover:bg-slate-50"}`}
                      >
                        {algo}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm focus:outline-none"
                  placeholder="Enter text to hash..."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value)}
                />
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 font-mono text-sm pr-12"
                    placeholder="Hash output..."
                    value={hashOutput}
                    readOnly
                  />
                  <button onClick={() => handleCopy(hashOutput)} className="absolute top-1/2 right-3 -translate-y-1/2 p-2 bg-white rounded-md shadow hover:bg-slate-100 text-slate-600">
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                </div>
                <button onClick={generateHash} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">
                  Generate Hash
                </button>
              </div>
            )}

            {activeTab === "password" && (
              <div className="max-w-xl mx-auto space-y-6">
                <div className="relative">
                  <input
                    type="text"
                    className="w-full p-6 text-2xl text-center rounded-xl border border-slate-200 bg-slate-50 font-mono tracking-wider font-bold"
                    placeholder="Click generate..."
                    value={generatedPwd}
                    readOnly
                  />
                  {generatedPwd && (
                    <button onClick={() => handleCopy(generatedPwd)} className="absolute top-1/2 right-4 -translate-y-1/2 p-3 bg-white rounded-lg shadow hover:bg-slate-100 text-slate-600">
                      {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    </button>
                  )}
                </div>
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center">
                    <label className="font-semibold text-slate-700">Length: {pwdLength}</label>
                    <input type="range" min="8" max="64" value={pwdLength} onChange={(e) => setPwdLength(Number(e.target.value))} className="w-1/2 accent-amber-500" />
                  </div>
                  {[
                    { label: "Include Uppercase", val: pwdUpper, set: setPwdUpper },
                    { label: "Include Numbers", val: pwdNumbers, set: setPwdNumbers },
                    { label: "Include Symbols", val: pwdSymbols, set: setPwdSymbols },
                  ].map(({ label, val, set }) => (
                    <div key={label} className="flex items-center justify-between">
                      <label className="font-medium text-slate-600">{label}</label>
                      <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                    </div>
                  ))}
                </div>
                <button onClick={generatePassword} className="w-full px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white text-lg font-bold rounded-xl shadow transition-colors">
                  Generate Secure Password
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
