const { PDFDocument, StandardFonts, rgb, degrees } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const docx = require("docx");
const mammoth = require("mammoth");
const PDFKitDocument = require("pdfkit");
const muhammara = require("muhammara");
const sharp = require("sharp");

const deleteAfterDelay = (filePath, delayMs = 60000) => {
  setTimeout(() => {
    try { fs.unlinkSync(filePath); } catch (e) {}
  }, delayMs);
};

const cleanupFiles = (files) => {
  if (!files) return;
  for (const file of files) {
    try { fs.unlinkSync(file.path); } catch (e) {}
  }
};

const cleanupSingleFile = (file) => {
  if (!file) return;
  try { fs.unlinkSync(file.path); } catch (e) {}
};

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
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    fs.writeFileSync(outputPath, mergedPdfBytes);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF merge error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  } finally {
    if (req.files) {
      cleanupFiles(req.files);
    }
  }
};

const imageToPdf = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No images uploaded." });
    }
    const SUPPORTED = ["image/jpeg", "image/png"];
    const unsupported = req.files.filter((f) => !SUPPORTED.includes(f.mimetype));
    if (unsupported.length > 0) {
      return res.status(400).json({ error: "Only JPEG and PNG images are supported for PDF conversion." });
    }
    const pdfDoc = await PDFDocument.create();
    for (const file of req.files) {
      let imgBytes = fs.readFileSync(file.path);
      
      // Resize large images to avoid OOM (Out of Memory) crashes on free-tier hosts like Render
      const metadata = await sharp(imgBytes).metadata();
      const MAX_DIMENSION = 2000;
      if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
        imgBytes = await sharp(imgBytes)
          .resize({
            width: metadata.width > metadata.height ? MAX_DIMENSION : undefined,
            height: metadata.height >= metadata.width ? MAX_DIMENSION : undefined,
            withoutEnlargement: true,
          })
          .toFormat(file.mimetype === "image/jpeg" ? "jpeg" : "png")
          .toBuffer();
      }

      const image = file.mimetype === "image/jpeg"
        ? await pdfDoc.embedJpg(imgBytes)
        : await pdfDoc.embedPng(imgBytes);
      const { width, height } = image.scale(1);
      const page = pdfDoc.addPage([width, height]);
      page.drawImage(image, { x: 0, y: 0, width, height });
    }
    const pdfBytes = await pdfDoc.save();
    const filename = `imagesToPdf-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    fs.writeFileSync(outputPath, pdfBytes);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Image to PDF error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  } finally {
    if (req.files) {
      cleanupFiles(req.files);
    }
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
    if (pageIndicesToExtract.length === 0) {
      pageIndicesToExtract = Array.from({ length: totalPages }, (_, i) => i);
    }
    const newPdf = await PDFDocument.create();
    const extractedPages = await newPdf.copyPages(pdfDoc, pageIndicesToExtract);
    extractedPages.forEach((page) => newPdf.addPage(page));
    const finalBytes = await newPdf.save();
    const filename = `split-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF split error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

const watermarkPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    const text = (req.body.text || "WATERMARK").slice(0, 100);
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
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Watermark error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

const rotatePdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    const angle = parseInt(req.body.angle) || 90;
    if (![90, 180, 270].includes(angle)) {
      return res.status(400).json({ error: "Angle must be 90, 180, or 270." });
    }
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    for (const page of pages) {
      const currentRotation = page.getRotation().angle;
      page.setRotation(degrees((currentRotation + angle) % 360));
    }
    const finalBytes = await pdfDoc.save();
    const filename = `rotated-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF rotate error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

const pdfToDocx = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const secret = process.env.CONVERT_API_SECRET;
    if (secret) {
      console.log("Using ConvertAPI for high-fidelity PDF to DOCX conversion...");
      const pdfBuffer = fs.readFileSync(req.file.path);
      const formData = new FormData();
      formData.append("File", new Blob([pdfBuffer], { type: req.file.mimetype }), req.file.originalname);

      const response = await fetch(`https://v2.convertapi.com/convert/pdf/to/docx?Secret=${secret}`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ConvertAPI error: ${errorText}`);
      }

      const data = await response.json();
      if (!data.Files || data.Files.length === 0) {
        throw new Error("No files returned from ConvertAPI");
      }

      const fileData = data.Files[0].FileData;
      const fileBuffer = Buffer.from(fileData, "base64");

      const filename = `pdfToWord-${Date.now()}.docx`;
      const outputPath = path.join(__dirname, "..", "uploads", filename);
      fs.writeFileSync(outputPath, Buffer.from(fileBuffer));
      deleteAfterDelay(outputPath);

      return res.json({
        success: true,
        downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
        filename,
      });
    }

    // --- FALLBACK TO PURE JS ENGINE ---
    console.log("ConvertAPI secret is missing. Falling back to pure-JS parser...");
    const pdfBuffer = fs.readFileSync(req.file.path);
    const parser = new pdfParse.PDFParse({ data: pdfBuffer });
    const textResult = await parser.getText();
    const extractedText = textResult.text || "";
    await parser.destroy();

    if (!extractedText.trim()) {
      return res.status(400).json({ error: "The uploaded PDF has no extractable text." });
    }

    const paragraphsText = extractedText.split(/\n\s*\n/);
    const children = paragraphsText
      .map((pText) => {
        const cleaned = pText.replace(/\n+/g, " ").replace(/\s+/g, " ").trim();
        if (!cleaned) return null;
        return new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: cleaned,
              font: "Calibri",
              size: 24, // 12pt
            }),
          ],
          spacing: { after: 120 }, // 6pt after spacing
        });
      })
      .filter(Boolean);

    if (children.length === 0) {
      children.push(
        new docx.Paragraph({
          children: [
            new docx.TextRun({
              text: "Empty PDF content",
              font: "Calibri",
              size: 24,
            }),
          ],
        })
      );
    }

    const doc = new docx.Document({
      sections: [
        {
          properties: {},
          children: children,
        },
      ],
    });

    const b64String = await docx.Packer.toBase64String(doc);
    const docxBuffer = Buffer.from(b64String, "base64");
    const filename = `pdfToWord-${Date.now()}.docx`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);

    fs.writeFileSync(outputPath, docxBuffer);
    deleteAfterDelay(outputPath);

    res.json({
      success: true,
      downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("PDF to DOCX error:", error);
    res.status(500).json({ error: "Something went wrong during PDF-to-Word conversion." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

const parseInlineStyles = (html) => {
  const tokens = [];
  const regex = /(<\/?strong>|<\/?em>|[^<]+)/gi;
  let match;
  let isBold = false;
  let isItalic = false;

  while ((match = regex.exec(html)) !== null) {
    const token = match[0];
    const lowerToken = token.toLowerCase();
    if (lowerToken === "<strong>") {
      isBold = true;
    } else if (lowerToken === "</strong>") {
      isBold = false;
    } else if (lowerToken === "<em>") {
      isItalic = true;
    } else if (lowerToken === "</em>") {
      isItalic = false;
    } else {
      tokens.push({
        text: token,
        bold: isBold,
        italic: isItalic
      });
    }
  }
  return tokens;
};

const docxToPdf = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No Word file uploaded" });
    }

    const secret = process.env.CONVERT_API_SECRET;
    if (secret) {
      console.log("Using ConvertAPI for high-fidelity DOCX to PDF conversion...");
      const docxBuffer = fs.readFileSync(req.file.path);
      const formData = new FormData();
      formData.append("File", new Blob([docxBuffer], { type: req.file.mimetype }), req.file.originalname);

      const response = await fetch(`https://v2.convertapi.com/convert/docx/to/pdf?Secret=${secret}`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`ConvertAPI error: ${errorText}`);
      }

      const data = await response.json();
      if (!data.Files || data.Files.length === 0) {
        throw new Error("No files returned from ConvertAPI");
      }

      const fileData = data.Files[0].FileData;
      const fileBuffer = Buffer.from(fileData, "base64");

      const filename = `wordToPdf-${Date.now()}.pdf`;
      const outputPath = path.join(__dirname, "..", "uploads", filename);
      fs.writeFileSync(outputPath, Buffer.from(fileBuffer));
      deleteAfterDelay(outputPath);

      return res.json({
        success: true,
        downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
        filename,
      });
    }

    // --- FALLBACK TO PURE JS ENGINE ---
    console.log("ConvertAPI secret is missing. Falling back to pure-JS parser...");
    const docxPath = req.file.path;
    const mammothResult = await mammoth.convertToHtml({ path: docxPath });
    const html = mammothResult.value || "";

    if (!html.trim()) {
      return res.status(400).json({ error: "The uploaded Word file has no content." });
    }

    const filename = `wordToPdf-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);

    const doc = new PDFKitDocument({ margin: 50 });
    const writeStream = fs.createWriteStream(outputPath);
    doc.pipe(writeStream);

    const blockRegex = /<(p|h1|h2|h3|li)[^>]*>(.*?)<\/\1>/gi;
    let match;
    const blocks = [];
    while ((match = blockRegex.exec(html)) !== null) {
      blocks.push({
        tag: match[1].toLowerCase(),
        content: match[2]
      });
    }

    if (blocks.length === 0) {
      blocks.push({ tag: "p", content: html });
    }

    blocks.forEach((block) => {
      let fontSize = 11;
      let isHeading = false;
      let isListItem = false;

      if (block.tag === "h1") {
        fontSize = 22;
        isHeading = true;
      } else if (block.tag === "h2") {
        fontSize = 16;
        isHeading = true;
      } else if (block.tag === "h3") {
        fontSize = 14;
        isHeading = true;
      } else if (block.tag === "li") {
        isListItem = true;
      }

      const cleanedContent = block.content
        .replace(/<a[^>]*>(.*?)<\/a>/gi, "$1")
        .replace(/<span[^>]*>(.*?)<\/span>/gi, "$1")
        .replace(/<br\s*\/?>/gi, " ");

      const tokens = parseInlineStyles(cleanedContent);
      if (tokens.length === 0) return;

      if (isListItem) {
        doc.font("Helvetica-Bold").fontSize(11).text("• ", { continued: true });
      }

      tokens.forEach((run, runIdx) => {
        const isLast = runIdx === tokens.length - 1;
        let fontName = "Helvetica";
        const boldState = run.bold || isHeading;

        if (boldState && run.italic) fontName = "Helvetica-BoldOblique";
        else if (boldState) fontName = "Helvetica-Bold";
        else if (run.italic) fontName = "Helvetica-Oblique";

        doc.font(fontName).fontSize(fontSize);
        doc.text(run.text, { continued: !isLast });
      });

      doc.moveDown(isHeading ? 0.8 : 0.5);
    });

    doc.end();

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
    });

    deleteAfterDelay(outputPath);

    res.json({
      success: true,
      downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("DOCX to PDF error:", error);
    res.status(500).json({ error: "Something went wrong during Word-to-PDF conversion." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

const unlockPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    const password = req.body.password || "";
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes, { password });
    const finalBytes = await pdfDoc.save();
    const filename = `unlocked-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    fs.writeFileSync(outputPath, finalBytes);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF unlock error:", error);
    res.status(500).json({ error: "Failed to unlock. Incorrect password or invalid PDF." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

const protectPdf = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF uploaded." });
    const password = req.body.password;
    if (!password) return res.status(400).json({ error: "Password is required to protect the PDF." });
    
    const filename = `protected-${Date.now()}.pdf`;
    const outputPath = path.join(__dirname, "..", "uploads", filename);
    
    muhammara.recrypt(req.file.path, outputPath, {
      userPassword: password,
      ownerPassword: password,
      userProtectionFlag: 4
    });
    
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("PDF protect error:", error);
    res.status(500).json({ error: "Something went wrong while protecting the PDF." });
  } finally {
    if (req.file) {
      cleanupSingleFile(req.file);
    }
  }
};

module.exports = { mergePdfs, imageToPdf, splitPdf, watermarkPdf, rotatePdf, pdfToDocx, docxToPdf, unlockPdf, protectPdf };
