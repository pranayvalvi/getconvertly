import { useState, useEffect } from "react";
import { UploadCloud } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function GlobalDropzone({ children }) {
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;
      if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter === 0) {
        setIsDragging(false);
      }
    };

    const handleDragOver = (e) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter = 0;

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        const type = file.type;
        // Dispatch event for local dropzones
        const event = new CustomEvent("globalFileDrop", { detail: { file, files: e.dataTransfer.files } });
        window.dispatchEvent(event);

        // Let the local dropzone handle it if we're already on a tool page
        if (location.pathname.includes('/image-tools') || location.pathname.includes('/pdf-tools')) {
          return;
        }

        // Auto-detect and navigate
        if (type.startsWith("image/")) {
          navigate("/image-tools");
        } else if (type === "application/pdf" || file.name.endsWith(".docx")) {
          navigate("/pdf-tools");
        }
      }
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, [navigate, location.pathname]);

  return (
    <>
      {isDragging && (
        <div className="fixed inset-0 z-[100] bg-emerald-500/90 backdrop-blur-sm flex flex-col items-center justify-center border-8 border-dashed border-white m-4 rounded-3xl animate-in fade-in duration-200">
          <UploadCloud size={80} className="text-white mb-6 animate-bounce" />
          <h2 className="text-4xl font-extrabold text-white text-center">Drop file anywhere</h2>
          <p className="text-emerald-100 mt-4 text-xl">We'll automatically open the right tool for you!</p>
        </div>
      )}
      {children}
    </>
  );
}
