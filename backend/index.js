require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import Routes
const houseRoutes = require('./routes/houseRoutes');
const mpesaRoutes = require('./routes/mpesaRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const userRoutes = require('./routes/userRoutes'); // For Day 2/3 Auth

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); 

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Success: Connected to MongoDB!"))
    .catch((err) => console.log("Error connecting to Mongo:", err));

// Routes
app.get('/', (req, res) => {
    res.send('SmartRent Backend is LIVE!');
});

app.use('/api/houses', houseRoutes);
app.use('/api/payments', mpesaRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/users', userRoutes); // For Day 2/3 Auth

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});