const express = require("express");
const router = express.Router();
const { compressImage, convertFormat, resizeImage, createProfilePic, grayscaleImage, flipImage, rotateImage } = require("../controllers/imageController");
const upload = require("../middleware/fileUpload");

router.post("/compress", upload.single("image"), compressImage);
router.post("/convert", upload.single("image"), convertFormat);
router.post("/resize", upload.single("image"), resizeImage);
router.post("/profile-pic", upload.single("image"), createProfilePic);
router.post("/grayscale", upload.single("image"), grayscaleImage);
router.post("/flip", upload.single("image"), flipImage);
router.post("/rotate", upload.single("image"), rotateImage);

module.exports = router;
