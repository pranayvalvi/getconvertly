import { useState } from "react";
import { Terminal, Lock, Code, Hash, Copy, Check } from "lucide-react";
import SEO from "../components/SEO";

export default function DevTools() {
  const [activeTab, setActiveTab] = useState("json");
  const [copied, setCopied] = useState(false);

  // Tab: JSON
  const [jsonInput, setJsonInput] = useState("");
  const [jsonOutput, setJsonOutput] = useState("");
  const [jsonError, setJsonError] = useState("");

  const formatJson = () => {
    try { setJsonOutput(JSON.stringify(JSON.parse(jsonInput), null, 2)); setJsonError(""); } 
    catch (e) { setJsonError("Invalid JSON"); }
  };

  // Tab: Base64
  const [b64Input, setB64Input] = useState("");
  const [b64Output, setB64Output] = useState("");

  const encodeB64 = () => {
    try { setB64Output(btoa(b64Input)); } catch(e) { setB64Output("Error encoding text"); }
  }
  const decodeB64 = () => {
    try { setB64Output(atob(b64Input)); } catch(e) { setB64Output("Error decoding text"); }
  }

  // Tab: Password
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
    
    let pwd = "";
    for (let i = 0; i < pwdLength; i++) {
      pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPwd(pwd);
  };

  const handleCopy = (text) => {
    if(!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = [
    { id: "json", label: "JSON Formatter", icon: <Code size={18} /> },
    { id: "base64", label: "Base64", icon: <Hash size={18} /> },
    { id: "password", label: "Password Gen", icon: <Lock size={18} /> },
  ];

  return (
    <>
      <SEO 
        title="Free Developer Tools"
        description="Format JSON, encode and decode Base64 strings, and generate secure passwords instantly in your browser."
        keywords="json formatter online, base64 encoder, base64 decoder, secure password generator, free developer tools"
        url="/dev-tools"
      />
      <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <Terminal className="text-amber-500" size={36} /> Developer Tools
        </h1>
        <p className="text-slate-600">Quick and completely secure text utilities.</p>
      </div>

      <div className="glass rounded-3xl overflow-hidden border-t-4 border-t-amber-500">
        <div className="flex border-b border-slate-200 bg-white/50">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-4 flex items-center justify-center gap-2 font-semibold transition-colors
                ${activeTab === tab.id ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500' : 'text-slate-500 hover:bg-slate-50'}`}
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
                  className="w-full h-64 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm" 
                  placeholder="Paste unformatted JSON here..."
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
              <div className="flex justify-between items-center">
                <span className="text-red-500 font-medium">{jsonError}</span>
                <button onClick={formatJson} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">
                  Format JSON
                </button>
              </div>
            </div>
          )}

          {activeTab === "base64" && (
            <div className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <textarea 
                  className="w-full h-48 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-amber-500 font-mono text-sm" 
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
                <button onClick={encodeB64} className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow transition-colors">
                  Encode to Base64
                </button>
                <button onClick={decodeB64} className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors">
                  Decode Base64
                </button>
              </div>
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
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-slate-600">Include Uppercase</label>
                    <input type="checkbox" checked={pwdUpper} onChange={(e) => setPwdUpper(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-slate-600">Include Numbers</label>
                    <input type="checkbox" checked={pwdNumbers} onChange={(e) => setPwdNumbers(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="font-medium text-slate-600">Include Symbols</label>
                    <input type="checkbox" checked={pwdSymbols} onChange={(e) => setPwdSymbols(e.target.checked)} className="w-5 h-5 accent-amber-500" />
                  </div>
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
