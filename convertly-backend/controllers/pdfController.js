const { PDFDocument, StandardFonts, rgb, degrees } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const mergePdfs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2) {
      return res.status(400).json({ error: "Please upload at least two PDF files to merge." });
    }

    const mergedPdf = await PDFDocument.create();

    for (const file of req.files) {
      const pdfBytes = fs.readFileSync(file.path);
      const pdf = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    
    const filename = `merged-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    
    fs.writeFileSync(outputPath, mergedPdfBytes);

    // Try to cleanup the original files
    for (const file of req.files) {
      try {
        fs.unlinkSync(file.path);
      } catch (cleanupErr) {
        console.error("Failed to delete input file:", file.path, cleanupErr);
      }
    }

    res.json({
      success: true,
      downloadUrl: `http://localhost:5000/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("PDF merge error:", error);
    res.status(500).json({ error: error.message });
  }
};

const imageToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) return res.status(400).json({ error: "No images uploaded." });

    const pdfDoc = await PDFDocument.create();

    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);
      let image;
      if (file.mimetype === 'image/jpeg') {
        image = await pdfDoc.embedJpg(imgBytes);
      } else if (file.mimetype === 'image/png') {
        image = await pdfDoc.embedPng(imgBytes);
      } else {
        continue; // Skip unsupported format for now
      }

      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }

    const pdfBytes = await pdfDoc.save();
    const filename = `imagesToPdf-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    fs.writeFileSync(outputPath, pdfBytes);

    for (const file of req.files) {
      try { fs.unlinkSync(file.path); } catch(e) {}
    }

    res.json({ success: true, downloadUrl: `http://localhost:5000/uploads/${filename}`, filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const splitPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    
    // Pages parameter should be a comma separated list like '1,3,5' or '1-3'
    const pagesRange = req.body.pages || "";
    
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();

    let pageIndicesToExtract = [];
    if (pagesRange) {
      const parts = pagesRange.split(',');
      for (const part of parts) {
        if (part.includes('-')) {
          const [startStr, endStr] = part.split('-');
          const start = parseInt(startStr, 10);
          const end = parseInt(endStr, 10);
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) pageIndicesToExtract.push(i - 1);
          }
        } else {
          const pageNum = parseInt(part, 10);
          if (!isNaN(pageNum)) pageIndicesToExtract.push(pageNum - 1);
        }
      }
    }

    // Filter valid bounds and unique
    pageIndicesToExtract = [...new Set(pageIndicesToExtract)].filter(i => i >= 0 && i < totalPages);
    if (pageIndicesToExtract.length === 0) {
      // Default extract all pages
      pageIndicesToExtract = Array.from({length: totalPages}, (_, i) => i);
    }

    const newPdf = await PDFDocument.create();
    const extractedPages = await newPdf.copyPages(pdfDoc, pageIndicesToExtract);
    extractedPages.forEach((page) => newPdf.addPage(page));

    const finalBytes = await newPdf.save();
    const filename = `split-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);

    try { fs.unlinkSync(req.file.path); } catch(e) {}

    res.json({ success: true, downloadUrl: `http://localhost:5000/uploads/${filename}`, filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const watermarkPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });

    const text = req.body.text || "WATERMARK";
    
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const pages = pdfDoc.getPages();

    for (const page of pages) {
      const { width, height } = page.getSize();
      const fontSize = 60;
      const textWidth = helveticaFont.widthOfTextAtSize(text, fontSize);
      const textHeight = helveticaFont.heightAtSize(fontSize);
      
      page.drawText(text, {
        x: (width / 2) - (textWidth / 2),
        y: (height / 2) - (textHeight / 2),
        size: fontSize,
        font: helveticaFont,
        color: rgb(0.5, 0.5, 0.5),
        opacity: 0.3,
        rotate: degrees(45),
      });
    }

    const finalBytes = await pdfDoc.save();
    const filename = `watermarked-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);

    try { fs.unlinkSync(req.file.path); } catch(e) {}

    res.json({ success: true, downloadUrl: `http://localhost:5000/uploads/${filename}`, filename });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { mergePdfs, imageToPdf, splitPdf, watermarkPdf };
