const express = require("express");
const router = express.Router();
const { mergePdfs, imageToPdf, splitPdf, watermarkPdf, rotatePdf } = require("../controllers/pdfController");
const upload = require("../middleware/fileUpload");

router.post("/merge", upload.array("pdfs", 20), mergePdfs);
router.post("/images-to-pdf", upload.array("images", 50), imageToPdf);
router.post("/split", upload.single("pdf"), splitPdf);
router.post("/watermark", upload.single("pdf"), watermarkPdf);
router.post("/rotate", upload.single("pdf"), rotatePdf);

module.exports = router;
