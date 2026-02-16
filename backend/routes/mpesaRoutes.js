const express = require('express');
const router = express.Router();
const axios = require('axios');

// Helper function to get a Safaricom-formatted timestamp (YYYYMMDDHHMMSS)
const getTimestamp = () => {
    const date = new Date();
    return date.getFullYear() +
        ("0" + (date.getMonth() + 1)).slice(-2) +
        ("0" + date.getDate()).slice(-2) +
        ("0" + date.getHours()).slice(-2) +
        ("0" + date.getMinutes()).slice(-2) +
        ("0" + date.getSeconds()).slice(-2);
};

// Middleware to get the "Access Token"
const getMpesaToken = async (req, res, next) => {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${key}:${secret}`).toString('base64');

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        req.token = response.data.access_token;
        next();
    } catch (err) {
        console.error("Token Error:", err.response ? err.response.data : err.message);
        res.status(500).json({ message: "Token Generation Failed" });
    }
};

// Main Route to trigger the STK Push
router.post('/stkpush', getMpesaToken, async (req, res) => {
    const phone = req.body.phone; // Format: 2547XXXXXXXX
    const amount = req.body.amount;
    
    const timestamp = getTimestamp();
    const shortCode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;
    
    // Create the Password
    const password = Buffer.from(shortCode + passkey + timestamp).toString('base64');

    try {
        const { data } = await axios.post(
            "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
            {
                "BusinessShortCode": shortCode,
                "Password": password,
                "Timestamp": timestamp,
                "TransactionType": "CustomerPayBillOnline",
                "Amount": amount,
                "PartyA": phone, 
                "PartyB": shortCode,
                "PhoneNumber": phone,
                "CallBackURL": "https://mydomain.com/path", // We will fix this for real callbacks later
                "AccountReference": "SmartRent",
                "TransactionDesc": "Rent Payment"
            },
            {
                headers: { Authorization: `Bearer ${req.token}` }
            }
        );

        res.status(200).json(data);
    } catch (err) {
        console.error("STK Error:", err.response ? err.response.data : err.message);
        res.status(500).json({ message: "STK Push Failed", error: err.message });
    }
});

module.exports = router;