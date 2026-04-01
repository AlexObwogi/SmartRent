require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const houseRoutes = require('./routes/houseRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes');

// Import New Routes
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const mediaRoutes = require('./routes/mediaRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const adminRoutes = require('./routes/adminRoutes');
const savedRoutes = require('./routes/savedRoutes');
const landlordRoutes = require('./routes/landlordRoutes');

const app = express();

// Middleware - FIXED CORS FOR MOBILE ACCESS
app.use(cors({
    origin: '*', // Allow all origins (for mobile and other devices)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); 

// Connect to MongoDB with improved options
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
    family: 4,
    retryWrites: true,
    w: 'majority'
})
.then(() => console.log("Success: Connected to MongoDB!"))
.catch((err) => console.log("Error connecting to Mongo:", err.message));

// Routes
app.get('/', (req, res) => {
    res.send('SmartRent Backend is LIVE!');
});

// Existing Routes
app.use('/api/houses', houseRoutes);
app.use('/api/mpesa', mpesaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/landlord', landlordRoutes);

// Database Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);

// Feature Routes
app.use('/api/media', mediaRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Redirect /api/properties to /api/houses for frontend compatibility
app.get('/api/properties', (req, res) => {
    res.redirect('/api/houses');
});

app.post('/api/properties', (req, res) => {
    res.redirect('/api/houses');
});

app.get('/api/properties/:id', (req, res) => {
    res.redirect(`/api/houses/${req.params.id}`);
});

app.put('/api/properties/:id', (req, res) => {
    res.redirect(`/api/houses/${req.params.id}`);
});

app.delete('/api/properties/:id', (req, res) => {
    res.redirect(`/api/houses/${req.params.id}`);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});