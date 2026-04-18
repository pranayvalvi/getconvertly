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

function App() {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/image-tools" element={<ImageTools />} />
              <Route path="/pdf-tools" element={<PDFTools />} />
              <Route path="/text-tools" element={<TextTools />} />
              <Route path="/dev-tools" element={<DevTools />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
      <Analytics />
    </HelmetProvider>
  );
}

export default App;
