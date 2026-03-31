const mongoose = require('mongoose');
require('dotenv').config();

async function cleanAllDemoImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const House = require('./models/House');
        
        // Remove all images from all properties
        const result = await House.updateMany(
            {},
            { 
                images: [],
                videoUrl: null
            }
        );
        
        console.log('✅ Cleaned ' + result.modifiedCount + ' properties');
        console.log('All demo images have been removed from the database!');
        
        // Show the cleaned properties
        const properties = await House.find();
        console.log('\n=== Current Properties (All cleaned) ===');
        properties.forEach(p => {
            console.log('  ' + p.title + ' - Images: ' + (p.images ? p.images.length : 0));
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

cleanAllDemoImages();
