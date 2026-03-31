const express = require('express');
const router = express.Router();
const Media = require('../models/Media');
const House = require('../models/House');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'smartrent/properties',
        allowed_formats: ['jpg', 'jpeg', 'png', 'mp4', 'mov', 'webm'],
        resource_type: 'auto'
    }
});

const upload = multer({ storage: storage });

// Upload media for a property
router.post('/upload/:propertyId', auth, upload.array('files', 10), async (req, res) => {
    try {
        const property = await House.findById(req.params.propertyId);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        if (req.user.role !== 'admin' && property.landlord.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }
        
        const uploadedFiles = [];
        const imageUrls = [];
        
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image';
            
            const media = new Media({
                property: req.params.propertyId,
                landlord: property.landlord,
                mediaType: mediaType,
                url: file.path,
                publicId: file.filename,
                order: i,
                mimeType: file.mimetype,
                fileSize: file.size,
                status: 'approved'
            });
            
            await media.save();
            uploadedFiles.push(media);
            
            if (mediaType === 'image') {
                imageUrls.push(file.path);
            }
        }
        
        if (imageUrls.length > 0) {
            await House.findByIdAndUpdate(req.params.propertyId, {
                $push: { images: { $each: imageUrls } }
            });
        }
        
        res.status(201).json({
            message: 'Upload successful',
            files: uploadedFiles,
            images: imageUrls
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get media for a property
router.get('/property/:propertyId', async (req, res) => {
    try {
        const media = await Media.find({ property: req.params.propertyId, status: 'approved' }).sort({ order: 1 });
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete media (landlord or admin only)
router.delete('/:mediaId', auth, async (req, res) => {
    try {
        const media = await Media.findById(req.params.mediaId);
        if (!media) {
            return res.status(404).json({ message: 'Media not found' });
        }
        
        const property = await House.findById(media.property);
        if (!property) {
            return res.status(404).json({ message: 'Property not found' });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && property.landlord.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this media' });
        }
        
        // Delete from Cloudinary
        try {
            await cloudinary.uploader.destroy(media.publicId);
        } catch (cloudinaryError) {
            console.error('Cloudinary delete error:', cloudinaryError);
            // Continue with database deletion even if Cloudinary fails
        }
        
        // Remove from property's images array if it's an image
        if (media.mediaType === 'image') {
            await House.findByIdAndUpdate(media.property, {
                $pull: { images: media.url }
            });
        }
        
        await media.deleteOne();
        
        res.json({ 
            message: 'Media deleted successfully',
            mediaType: media.mediaType
        });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all media for a landlord (optional)
router.get('/landlord/my-media', auth, async (req, res) => {
    try {
        if (req.user.role !== 'landlord' && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Only landlords can view their media' });
        }
        
        const media = await Media.find({ landlord: req.user.id })
            .populate('property', 'title address')
            .sort({ createdAt: -1 });
        res.json(media);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;