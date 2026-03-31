const mongoose = require('mongoose');
require('dotenv').config();

async function cleanDemoImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const House = require('./models/House');
        
        // Remove all demo images and set empty array
        const result = await House.updateMany(
            {},
            { images: [] }
        );
        
        console.log('Cleaned ' + result.modifiedCount + ' properties');
        console.log('All demo images removed. Ready for real uploads!');
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

cleanDemoImages();
