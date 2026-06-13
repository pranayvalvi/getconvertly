import { Link } from "react-router-dom";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";
import SEO from "../components/SEO";

const MOCK_POSTS = [
  {
    slug: "how-to-compress-pdf-for-email",
    title: "How to Compress a PDF for Email Attachments",
    excerpt: "Learn how to reduce your PDF file size without losing quality, making it easy to send via Gmail, Outlook, or Yahoo.",
    date: "June 5, 2026",
    readTime: "3 min read"
  },
  {
    slug: "convert-images-to-webp-guide",
    title: "Why You Should Convert All Your Images to WebP",
    excerpt: "WebP offers superior compression for images on the web. Discover how you can speed up your website by converting JPEG and PNGs.",
    date: "June 2, 2026",
    readTime: "5 min read"
  },
  {
    slug: "secure-passwords-best-practices",
    title: "The Ultimate Guide to Generating Secure Passwords",
    excerpt: "Stop using your pet's name. Learn how cryptographic pseudo-random number generators keep your online accounts safe.",
    date: "May 28, 2026",
    readTime: "4 min read"
  }
];

export default function Blog() {
  return (
    <>
      <SEO
        title="Convertly Blog: Guides, Tips & Tutorials"
        description="Read our latest guides on compressing PDFs, optimizing images for the web, and developer best practices."
        keywords="compress pdf guide, webp vs jpeg, secure password tips, convertly blog"
        url="/blog"
      />
      <div className="absolute top-24 left-10 w-80 h-80 bg-blue-200 rounded-full filter blur-3xl opacity-20 pointer-events-none -z-10" />

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <BookOpen className="text-blue-500" size={36} /> Guides & Tutorials
          </h1>
          <p className="text-slate-600 max-w-md mx-auto">Helpful articles to make the most out of your digital files and workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="glass bg-white/40 border border-slate-200/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group flex flex-col">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-4">
                <Calendar size={14} /> {post.date} &bull; {post.readTime}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6 flex-1">
                {post.excerpt}
              </p>
              <div className="flex items-center text-sm font-bold text-blue-500 group-hover:gap-2 transition-all">
                Read Article <ArrowRight size={16} className="ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
