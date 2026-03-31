const mongoose = require('mongoose');
require('dotenv').config();

async function checkProperties() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const House = require('./models/House');
        const properties = await House.find().sort({ createdAt: -1 });
        
        console.log('Total properties: ' + properties.length);
        console.log('===================');
        
        properties.forEach((prop, idx) => {
            console.log((idx + 1) + '. ' + prop.title);
            console.log('   Price: KES ' + prop.price);
            console.log('   Address: ' + prop.address);
            console.log('   Images: ' + (prop.images ? prop.images.length : 0) + ' image(s)');
            if (prop.images && prop.images.length > 0) {
                console.log('   First image: ' + prop.images[0].substring(0, 80));
            }
            console.log('');
        });
        
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err.message);
    }
}

checkProperties();
