const path = require("path");
const Design = require("../models/Design");
const cloudinary = require("../config/Cloudinary");
const fs = require("fs");

const {
  prepareImage,
  makeStringArt,
  drawSequence,
  saveCanvas,
} = require("../utils/stringArt");

const generateStringArt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    // ----------------------------------------
    // Upload original image to Cloudinary
    // ----------------------------------------

    const originalUpload = await cloudinary.uploader.upload(req.file.path, {
      folder: "string-art/originals",
    });

    // ----------------------------------------
    // String-art configuration
    // ----------------------------------------

    const size = 700;
    const nailCount = 300;
    const maxLines = 3500;
    const lineWeight = 35;

    // ----------------------------------------
    // Prepare uploaded image
    // ----------------------------------------

    console.log("Preparing image...");

    const target = await prepareImage(req.file.path, size);

    // ----------------------------------------
    // Generate nail sequence
    // ----------------------------------------

    console.log("Generating string-art...");

    const result = makeStringArt(target, size, nailCount, maxLines, {
      lineWeight,
      stopAtBestQuality: false,
    });

    // ----------------------------------------
    // Draw final string art
    // ----------------------------------------

    console.log("Drawing final image...");

    const canvas = drawSequence(
      result.sequence,
      result.coords,
      result.size,
      result.lineWeight,
    );

    // ----------------------------------------
    // Save generated PNG temporarily
    // ----------------------------------------

    const outputPath = path.join(__dirname, "../../string-art-output.png");

    await saveCanvas(canvas, result.size, outputPath);

    // ----------------------------------------
    // Upload generated PNG to Cloudinary
    // ----------------------------------------

    const stringArtUpload = await cloudinary.uploader.upload(outputPath, {
      folder: "string-art/generated",
    });

    // ----------------------------------------
    // Create Design in MongoDB
    // ----------------------------------------

    const design = await Design.create({
      user: req.userId,

      originalImage: originalUpload.secure_url,

      stringArtImage: stringArtUpload.secure_url,

      nailSequence: result.sequence,

      canvas: {
        shape: "circle",
        diameter: 24,
        nails: result.nailCount,
        lines: result.sequence.length - 1,
      },

      lineWeight: result.lineWeight,

      size: result.size,
    });

    // ----------------------------------------
    // Delete temporary files
    // ----------------------------------------

    fs.unlinkSync(req.file.path);

    fs.unlinkSync(outputPath);

    // ----------------------------------------
    // Response
    // ----------------------------------------

    res.status(201).json({
      message: "String art generated successfully",

      designId: design._id,

      linesGenerated: result.sequence.length - 1,

      nailCount: result.nailCount,

      size: result.size,

      lineWeight: result.lineWeight,

      imageUrl: design.stringArtImage,
    });
  } catch (error) {
    console.error("String art generation failed:", error);

    res.status(500).json({
      message: "String art generation failed",

      error: error.message,
    });
  }
};

module.exports = {
  generateStringArt,
};
