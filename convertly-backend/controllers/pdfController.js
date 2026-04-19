const { PDFDocument, StandardFonts, rgb, degrees } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const deleteAfterDelay = (filePath, delayMs = 60000) => {
  setTimeout(() => {
    try { fs.unlinkSync(filePath); } catch (e) {}
  }, delayMs);
};

const cleanupFiles = (files) => {
  for (const file of files) {
    try { fs.unlinkSync(file.path); } catch (e) {}
  }
};

const mergePdfs = async (req, res) => {
  try {
    if (!req.files || req.files.length < 2)
      return res.status(400).json({ error: "Please upload at least two PDF files to merge." });
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
    cleanupFiles(req.files);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF merge error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const imageToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ error: "No images uploaded." });
    const SUPPORTED = ["image/jpeg", "image/png"];
    const unsupported = req.files.filter((f) => !SUPPORTED.includes(f.mimetype));
    if (unsupported.length > 0) {
      cleanupFiles(req.files);
      return res.status(400).json({ error: "Only JPEG and PNG images are supported for PDF conversion." });
    }
    const pdfDoc = await PDFDocument.create();
    for (const file of req.files) {
      const imgBytes = fs.readFileSync(file.path);
      const image = file.mimetype === "image/jpeg"
        ? await pdfDoc.embedJpg(imgBytes)
        : await pdfDoc.embedPng(imgBytes);
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }
    const pdfBytes = await pdfDoc.save();
    const filename = `imagesToPdf-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    fs.writeFileSync(outputPath, pdfBytes);
    cleanupFiles(req.files);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Image to PDF error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const splitPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    const pagesRange = req.body.pages || "";
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const totalPages = pdfDoc.getPageCount();
    let pageIndicesToExtract = [];
    if (pagesRange) {
      const parts = pagesRange.split(",");
      for (const part of parts) {
        if (part.includes("-")) {
          const [startStr, endStr] = part.split("-");
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
    pageIndicesToExtract = [...new Set(pageIndicesToExtract)].filter((i) => i >= 0 && i < totalPages);
    if (pageIndicesToExtract.length === 0)
      pageIndicesToExtract = Array.from({ length: totalPages }, (_, i) => i);
    const newPdf = await PDFDocument.create();
    const extractedPages = await newPdf.copyPages(pdfDoc, pageIndicesToExtract);
    extractedPages.forEach((page) => newPdf.addPage(page));
    const finalBytes = await newPdf.save();
    const filename = `split-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF split error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
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
        x: width / 2 - textWidth / 2,
        y: height / 2 - textHeight / 2,
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
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Watermark error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const rotatePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    const angle = parseInt(req.body.angle) || 90;
    if (![90, 180, 270].includes(angle))
      return res.status(400).json({ error: "Angle must be 90, 180, or 270." });
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }
    const finalBytes = await pdfDoc.save();
    const filename = `rotated-${Date.now()}.pdf`;
    const outputPath = path.join("uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);
    try { fs.unlinkSync(req.file.path); } catch (e) {}
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF rotate error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = { mergePdfs, imageToPdf, splitPdf, watermarkPdf, rotatePdf };
