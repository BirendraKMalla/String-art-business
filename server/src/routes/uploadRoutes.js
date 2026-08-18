const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/Cloudinary");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image uploaded"
            });
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "string-art"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );

            stream.end(req.file.buffer);
        });

        res.json({
            message: "Image uploaded successfully",
            imageUrl: result.secure_url
        });

    } catch (error) {
        res.status(500).json({
            message: "Image upload failed",
            error: error.message
        });
    }
});

module.exports = router;