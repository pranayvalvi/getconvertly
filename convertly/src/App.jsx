import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ImageTools from "./pages/ImageTools";
import PDFTools from "./pages/PDFTools";
import TextTools from "./pages/TextTools";
import DevTools from "./pages/DevTools";

function App() {
  return (
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
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
