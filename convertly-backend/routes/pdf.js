const express = require("express");
const router = express.Router();
const { mergePdfs, imageToPdf, splitPdf, watermarkPdf } = require("../controllers/pdfController");
const upload = require("../middleware/fileUpload");

router.post("/merge", upload.array("pdfs", 20), mergePdfs); // Up to 20 PDFs
router.post("/images-to-pdf", upload.array("images", 50), imageToPdf); // Up to 50 Images
router.post("/split", upload.single("pdf"), splitPdf);
router.post("/watermark", upload.single("pdf"), watermarkPdf);

module.exports = router;
