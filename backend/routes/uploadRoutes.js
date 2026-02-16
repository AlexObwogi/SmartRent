const express = require('express');
const router = express.Router();
// We take the "upload" tool we just exported above
const { upload } = require('../utils/cloudinary');

// This is the route for uploading a photo
router.post('/image', upload.single('houseImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        res.status(200).json({ 
            message: "Success! Image uploaded to the cloud.", 
            imageUrl: req.file.path 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;