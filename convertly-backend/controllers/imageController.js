const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const deleteAfterDelay = (filePath, delayMs = 60000) => {
  setTimeout(() => {
    try { fs.unlinkSync(filePath); } catch (e) {}
  }, delayMs);
};

const cleanupInput = (filePath) => {
  try { fs.unlinkSync(filePath); } catch (e) {}
};

const compressImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const filename = `compressed-${Date.now()}.jpg`;
    const outputPath = path.join("uploads", filename);
    const quality = parseInt(req.body.quality) || 60;
    await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Compression error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const convertFormat = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const format = req.body.format || "png";
    const filename = `converted-${Date.now()}.${format}`;
    const outputPath = path.join("uploads", filename);
    const s = sharp(inputPath);
    if (format === "jpeg" || format === "jpg") s.jpeg();
    else if (format === "png") s.png();
    else if (format === "webp") s.webp();
    else if (format === "gif") s.gif();
    else return res.status(400).json({ error: "Unsupported output format." });
    await s.toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Format conversion error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const resizeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    if (!width && !height) return res.status(400).json({ error: "Provide at least width or height." });
    const filename = `resized-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);
    const s = sharp(inputPath);
    if (width && height) s.resize(width, height);
    else if (width) s.resize(width, null);
    else s.resize(null, height);
    await s.png().toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Resize error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const createProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const size = parseInt(req.body.size) || 500;
    const filename = `profile-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);
    const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" /></svg>`;
    await sharp(inputPath)
      .resize(size, size, { fit: "cover" })
      .composite([{ input: Buffer.from(circleSvg), blend: "dest-in" }])
      .png()
      .toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Profile pic error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const grayscaleImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const filename = `grayscale-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);
    await sharp(inputPath).grayscale().png().toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Grayscale error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const flipImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const direction = req.body.direction || "horizontal";
    const filename = `flipped-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);
    const s = sharp(inputPath);
    if (direction === "horizontal") s.flop();
    else s.flip();
    await s.png().toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Flip error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

const rotateImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const inputPath = req.file.path;
    const angle = parseInt(req.body.angle) || 90;
    if (![90, 180, 270].includes(angle)) return res.status(400).json({ error: "Angle must be 90, 180, or 270." });
    const filename = `rotated-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);
    await sharp(inputPath).rotate(angle).png().toFile(outputPath);
    cleanupInput(inputPath);
    deleteAfterDelay(outputPath);
    res.json({ success: true, downloadUrl: `${req.protocol}://${req.get("host")}/uploads/${filename}`, filename });
  } catch (error) {
    console.error("Rotate error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};

module.exports = { compressImage, convertFormat, resizeImage, createProfilePic, grayscaleImage, flipImage, rotateImage };
