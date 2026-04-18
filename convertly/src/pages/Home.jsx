import { Link } from "react-router-dom";
import { Image, FileText, Type, ChevronRight, Terminal } from "lucide-react";

const tools = [
  {
    title: "Image Tools",
    description: "Compress, resize, format, and generate profile pictures instantly.",
    icon: <Image className="text-blue-500" size={32} />,
    href: "/image-tools",
    color: "bg-blue-50 border-blue-100",
  },
  {
    title: "PDF Tools",
    description: "Merge, split, watermark, and convert images to PDF seamlessly.",
    icon: <FileText className="text-emerald-500" size={32} />,
    href: "/pdf-tools",
    color: "bg-emerald-50 border-emerald-100",
  },
  {
    title: "Text Tools",
    description: "Word count, formatting, minification and quick text manipulation.",
    icon: <Type className="text-purple-500" size={32} />,
    href: "/text-tools",
    color: "bg-purple-50 border-purple-100",
  },
  {
    title: "Developer Tools",
    description: "Format JSON, encode/decode Base64, and generate secure passwords.",
    icon: <Terminal className="text-amber-500" size={32} />,
    href: "/dev-tools",
    color: "bg-amber-50 border-amber-100",
  },
];

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="text-center space-y-6 pt-12 pb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
          The Only <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-700">All-In-One</span> Tool You Need
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Compress, merge, and convert your files lightning fast directly from your browser. 
          100% Free. No sign up required.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, idx) => (
          <Link 
            key={idx} 
            to={tool.href}
            className={`group relative overflow-hidden rounded-2xl p-8 border ${tool.color} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            <div className="bg-white w-16 h-16 rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              {tool.icon}
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">{tool.title}</h3>
            <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
              {tool.description}
            </p>
            <div className="flex items-center text-slate-900 font-semibold group-hover:text-brand-600 transition-colors">
              Open Toolbox <ChevronRight size={20} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
