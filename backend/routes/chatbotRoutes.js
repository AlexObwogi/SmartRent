const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const House = require('../models/House');
const auth = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');

// Simple chatbot response logic
const generateBotResponse = async (message, context) => {
    const lowerMsg = message.toLowerCase();
    
    // Property search intent
    if (lowerMsg.includes('find') || lowerMsg.includes('search') || lowerMsg.includes('looking for')) {
        if (lowerMsg.includes('house') || lowerMsg.includes('apartment') || lowerMsg.includes('property')) {
            let location = '';
            const locations = ['kilimani', 'westlands', 'karen', 'nairobi', 'ruaka', 'thika'];
            for (const loc of locations) {
                if (lowerMsg.includes(loc)) {
                    location = loc;
                    break;
                }
            }
            
            let query = {};
            if (location) {
                query.location = { $regex: location, $options: 'i' };
            }
            
            const properties = await House.find(query).limit(3);
            if (properties.length > 0) {
                let response = `I found ${properties.length} properties ${location ? 'in ' + location : 'for you'}:\n\n`;
                properties.forEach(p => {
                    response += `🏠 ${p.title}\n📍 ${p.address}\n💰 KES ${p.price}\n\n`;
                });
                response += 'Would you like more details about any of these?';
                return response;
            } else {
                return `I couldn't find properties ${location ? 'in ' + location : 'matching your search'}. Would you like to see all available properties?`;
            }
        }
    }
    
    // Price inquiry
    if (lowerMsg.includes('price') || lowerMsg.includes('cost') || lowerMsg.includes('rent')) {
        return "Property prices in Nairobi range from KES 15,000 for studios to KES 150,000+ for luxury houses. What's your budget? I can help you find something suitable!";
    }
    
    // Booking inquiry
    if (lowerMsg.includes('book') || lowerMsg.includes('view') || lowerMsg.includes('visit')) {
        return "To book a viewing, please login to your account and click 'Book Viewing' on any property you're interested in. The landlord will get back to you within 24 hours!";
    }
    
    // Payment inquiry
    if (lowerMsg.includes('pay') || lowerMsg.includes('mpesa') || lowerMsg.includes('payment')) {
        return "You can pay rent through M-Pesa using the Pay Bill number displayed on your dashboard after booking. Would you like help with the payment process?";
    }
    
    // Help
    if (lowerMsg.includes('help') || lowerMsg.includes('what can you do')) {
        return "I can help you with:\n🔍 Finding properties\n💰 Checking rental prices\n📅 Booking viewings\n💳 Payment information\n🏠 Property details\n\nWhat would you like to know?";
    }
    
    // Default response
    return "Thank you for your message! How can I help you find the perfect property in Kenya? You can ask me about property listings, prices, booking viewings, or payment options.";
};

// Start a new chat session
router.post('/start', auth, async (req, res) => {
    try {
        const sessionId = uuidv4();
        const chat = new Chat({
            user: req.user.id,
            sessionId: sessionId,
            title: 'New Conversation',
            messages: []
        });
        
        await chat.save();
        
        const welcomeMessage = "Welcome to SmartRent! 🏠 I'm your virtual assistant. How can I help you today? You can ask me about properties, pricing, booking viewings, or payment options.";
        
        chat.messages.push({
            sender: 'bot',
            message: welcomeMessage,
            timestamp: new Date()
        });
        
        await chat.save();
        
        res.json({
            sessionId: chat.sessionId,
            message: welcomeMessage
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Send message to chatbot
router.post('/message', auth, async (req, res) => {
    try {
        const { sessionId, message } = req.body;
        
        let chat = await Chat.findOne({ sessionId, user: req.user.id });
        if (!chat) {
            return res.status(404).json({ message: 'Chat session not found' });
        }
        
        // Add user message
        chat.messages.push({
            sender: 'user',
            message: message,
            timestamp: new Date()
        });
        
        // Generate bot response
        const botResponse = await generateBotResponse(message, chat.context);
        
        // Add bot response
        chat.messages.push({
            sender: 'bot',
            message: botResponse,
            timestamp: new Date()
        });
        
        // Update context
        if (message.toLowerCase().includes('budget')) {
            const budgetMatch = message.match(/\d+/);
            if (budgetMatch) {
                chat.context.set('budget', budgetMatch[0]);
            }
        }
        
        if (message.toLowerCase().includes('location')) {
            const locations = ['kilimani', 'westlands', 'karen', 'nairobi', 'ruaka'];
            for (const loc of locations) {
                if (message.toLowerCase().includes(loc)) {
                    chat.context.set('preferredLocation', loc);
                    break;
                }
            }
        }
        
        await chat.save();
        
        res.json({
            message: botResponse,
            sessionId: chat.sessionId
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get chat history
router.get('/history', auth, async (req, res) => {
    try {
        const chats = await Chat.find({ user: req.user.id })
            .sort({ lastMessageAt: -1 })
            .select('sessionId title status lastMessageAt startedAt');
        res.json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific chat session
router.get('/session/:sessionId', auth, async (req, res) => {
    try {
        const chat = await Chat.findOne({ 
            sessionId: req.params.sessionId, 
            user: req.user.id 
        });
        
        if (!chat) {
            return res.status(404).json({ message: 'Chat session not found' });
        }
        
        res.json(chat);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// End chat session
router.put('/session/:sessionId/end', auth, async (req, res) => {
    try {
        const chat = await Chat.findOneAndUpdate(
            { sessionId: req.params.sessionId, user: req.user.id },
            { 
                status: 'resolved',
                endedAt: new Date()
            },
            { new: true }
        );
        
        res.json({ message: 'Chat session ended', chat });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add feedback for chat session
router.post('/session/:sessionId/feedback', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        
        const chat = await Chat.findOneAndUpdate(
            { sessionId: req.params.sessionId, user: req.user.id },
            {
                feedback: { rating, comment }
            },
            { new: true }
        );
        
        res.json({ message: 'Thank you for your feedback!', chat });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;