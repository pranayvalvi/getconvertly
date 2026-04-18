const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const compressImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const inputPath = req.file.path;
    const filename = `compressed-${Date.now()}.jpg`;
    const outputPath = path.join("uploads", filename);

    const quality = parseInt(req.body.quality) || 60;

    await sharp(inputPath)
      .jpeg({ quality })
      .toFile(outputPath);

    // Try to cleanup the original file
    try {
      fs.unlinkSync(inputPath);
    } catch (cleanupErr) {
      console.error("Failed to delete input file:", cleanupErr);
    }

    res.json({
      success: true,
      downloadUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Compression error:", error);
    res.status(500).json({ error: error.message });
  }
};

const convertFormat = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const inputPath = req.file.path;
    const format = req.body.format || "png"; // Target format
    const filename = `converted-${Date.now()}.${format}`;
    const outputPath = path.join("uploads", filename);

    const s = sharp(inputPath);
    if (format === "jpeg" || format === "jpg") s.jpeg();
    else if (format === "png") s.png();
    else if (format === "webp") s.webp();
    else if (format === "gif") s.gif();

    await s.toFile(outputPath);

    try { fs.unlinkSync(inputPath); } catch(e) {}

    res.json({
      success: true,
      downloadUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Format conversion error:", error);
    res.status(500).json({ error: error.message });
  }
};

const resizeImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const inputPath = req.file.path;
    const width = parseInt(req.body.width);
    const height = parseInt(req.body.height);
    const filename = `resized-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);

    const s = sharp(inputPath);
    if (width && height) s.resize(width, height);
    else if (width) s.resize(width, null);
    else if (height) s.resize(null, height);

    await s.png().toFile(outputPath);

    try { fs.unlinkSync(inputPath); } catch(e) {}

    res.json({
      success: true,
      downloadUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Resize error:", error);
    res.status(500).json({ error: error.message });
  }
};

const createProfilePic = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const inputPath = req.file.path;
    const size = parseInt(req.body.size) || 500;
    const filename = `profile-${Date.now()}.png`;
    const outputPath = path.join("uploads", filename);

    const circleSvg = `<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" /></svg>`;
    const circleSvgBuffer = Buffer.from(circleSvg);

    await sharp(inputPath)
      .resize(size, size, { fit: 'cover' })
      .composite([{
        input: circleSvgBuffer,
        blend: 'dest-in'
      }])
      .png()
      .toFile(outputPath);

    try { fs.unlinkSync(inputPath); } catch(e) {}

    res.json({
      success: true,
      downloadUrl: `${req.protocol}://${req.get('host')}/uploads/${filename}`,
      filename,
    });
  } catch (error) {
    console.error("Profile pic error:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { compressImage, convertFormat, resizeImage, createProfilePic };
