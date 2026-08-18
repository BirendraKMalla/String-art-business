const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");

const {
    generateStringArt
} = require("../controllers/stringArtController");

const router = express.Router();

const upload = multer({
    dest: "uploads/"
});

router.post(
    "/generate",
    authMiddleware,
    upload.single("image"),
    generateStringArt
);

module.exports = router;