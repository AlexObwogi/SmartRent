const mongoose = require('mongoose');
require('dotenv').config();

async function updatePropertyImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const House = require('./models/House');
        
        // Get all properties
        const properties = await House.find();
        console.log(Found  properties);
        
        // Working image URLs
        const workingImages = [
            'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
            'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
            'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500',
            'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=500'
        ];
        
        // Update each property
        for (let i = 0; i < properties.length; i++) {
            const property = properties[i];
            const imageIndex = i % workingImages.length;
            
            await House.findByIdAndUpdate(property._id, {
                images: [workingImages[imageIndex]]
            });
            
            console.log( Updated: );
        }
        
        console.log('All properties updated!');
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

updatePropertyImages();
