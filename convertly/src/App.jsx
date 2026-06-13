import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ImageTools from "./pages/ImageTools";
import PDFTools from "./pages/PDFTools";
import TextTools from "./pages/TextTools";
import DevTools from "./pages/DevTools";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import GlobalDropzone from "./components/GlobalDropzone";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function App() {
  return (
    <HelmetProvider>
      <Router>
        <GlobalDropzone>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                
                {/* Main Tool Hubs */}
                <Route path="/image-tools" element={<ImageTools />} />
                <Route path="/pdf-tools" element={<PDFTools />} />
                <Route path="/text-tools" element={<TextTools />} />
                <Route path="/dev-tools" element={<DevTools />} />
                
                {/* SEO Dedicated Tool Pages */}
                <Route path="/merge-pdf-online" element={<PDFTools defaultTab="merge" />} />
                <Route path="/split-pdf-free" element={<PDFTools defaultTab="split" />} />
                <Route path="/compress-jpeg-free" element={<ImageTools defaultTab="compress" />} />
                <Route path="/circular-profile-picture-maker" element={<ImageTools defaultTab="profile" />} />
                <Route path="/qr-code-generator-online" element={<DevTools defaultTab="qr" />} />

                {/* Blog Routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />

                {/* Legal Pages */}
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </GlobalDropzone>
        <Analytics />
      </Router>
    </HelmetProvider>
  );
}

export default App;
