const mongoose = require('mongoose');
require('dotenv').config();

async function checkImages() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const House = require('./models/House');
        const properties = await House.find();
        
        console.log('=== PROPERTY IMAGES ===');
        console.log('Total properties: ' + properties.length);
        
        for (let i = 0; i < properties.length; i++) {
            const p = properties[i];
            console.log('');
            console.log('Property: ' + p.title);
            console.log('ID: ' + p._id);
            console.log('Images count: ' + (p.images ? p.images.length : 0));
            if (p.images && p.images.length > 0) {
                for (let j = 0; j < p.images.length; j++) {
                    console.log('Image ' + (j+1) + ': ' + p.images[j]);
                }
            }
        }
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkImages();
