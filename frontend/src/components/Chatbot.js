import React, { useState, useRef, useEffect } from 'react';

const BOT_RESPONSES = {
  greet: ["Hi! 👋 I'm SmartRent Assistant. I can help you find properties, understand the rental process, or answer any questions!", "Hello! Welcome to SmartRent 🏠 How can I help you today?"],
  properties: ["You can browse all available properties by clicking **Properties** in the navigation bar. Use the filters to narrow by location, price, bedrooms and property type!", "Head to the Properties page to see all listings. You can filter by location, price range, number of bedrooms, and property type."],
  apply: ["To apply for a property: 1️⃣ Find a property you like, 2️⃣ Click 'View Details', 3️⃣ Click 'Apply Now', 4️⃣ Fill in the application form. You must be logged in to apply!"],
  login: ["To log in, click the **Login** button in the top navigation. Don't have an account? Click **Register** to create one — it's free!"],
  save: ["You can save properties by clicking the ❤️ heart icon on any property card. View all your saved properties under the **Saved** section in the navigation."],
  landlord: ["Are you a landlord? Register as a landlord and you'll get access to your **Dashboard** where you can add properties, manage listings, and review tenant applications!"],
  price: ["Property prices on SmartRent are shown in Kenyan Shillings (KES). You can filter by minimum and maximum price using the search filters on the Properties page."],
  contact: ["You can contact the landlord directly from the property detail page. The landlord's name, email and phone number are shown in the Contact section."],
  review: ["After viewing a property, you can scroll down to the Reviews section and click **Write a Review** to share your experience. You must be logged in to leave a review."],
  nairobi: ["We have many properties in Nairobi including Westlands, Karen, Kilimani, Roysambu and more! Use the location filter to search for properties in your preferred area."],
  mombasa: ["We have beachfront properties in Mombasa including Nyali and other coastal areas. Use the location filter and search for 'Mombasa'!"],
  default: ["I'm not sure about that, but I'm here to help! Try asking about: finding properties, applying, saving favorites, or contacting landlords.", "Great question! For more help, try browsing the Properties page or contact our support team. I can help with: property search, applications, and account questions."],
};

const getResponse = (input) => {
  const msg = input.toLowerCase();
  if (msg.match(/hi|hello|hey|good/)) return BOT_RESPONSES.greet;
  if (msg.match(/propert|house|flat|apartment|listing|find/)) return BOT_RESPONSES.properties;
  if (msg.match(/apply|application|rent|book/)) return BOT_RESPONSES.apply;
  if (msg.match(/login|sign in|register|account|sign up/)) return BOT_RESPONSES.login;
  if (msg.match(/save|favourite|favorite|wishlist|heart/)) return BOT_RESPONSES.save;
  if (msg.match(/landlord|owner|list|upload|add property/)) return BOT_RESPONSES.landlord;
  if (msg.match(/price|cost|kes|fee|afford|cheap|budget/)) return BOT_RESPONSES.price;
  if (msg.match(/contact|phone|email|reach|call/)) return BOT_RESPONSES.contact;
  if (msg.match(/review|rating|star|comment/)) return BOT_RESPONSES.review;
  if (msg.match(/nairobi|westlands|kilimani|karen|roysambu/)) return BOT_RESPONSES.nairobi;
  if (msg.match(/mombasa|nyali|coast|beach/)) return BOT_RESPONSES.mombasa;
  return BOT_RESPONSES.default;
};

const SUGGESTIONS = ['Find properties', 'How to apply?', 'Save a property', 'I am a landlord', 'Contact landlord', 'Prices in KES'];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, from: 'bot', text: "Hi! 👋 I'm SmartRent Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text) => {
    const userMsg = text || input.trim();
    if (!userMsg) return;

    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const responses = getResponse(userMsg);
      const reply = responses[Math.floor(Math.random() * responses.length)];
      setTyping(false);
      setMessages(prev => [...prev, { id: Date.now() + 1, from: 'bot', text: reply }]);
    }, 900 + Math.random() * 600);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {/* Toggle Button */}
      <button className="chatbot-toggle" onClick={() => setOpen(!open)} title="Chat with SmartRent Assistant">
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar">🤖</div>
              <div>
                <h4>SmartRent Assistant</h4>
                <p>🟢 Online — here to help</p>
              </div>
            </div>
            <button className="chatbot-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`chat-message ${msg.from}`}>
                {msg.from === 'bot' && <div className="chat-msg-avatar">🤖</div>}
                <div className="chat-bubble">{msg.text}</div>
                {msg.from === 'user' && <div className="chat-msg-avatar" style={{ background: '#2ecc71' }}>👤</div>}
              </div>
            ))}
            {typing && (
              <div className="chat-message bot">
                <div className="chat-msg-avatar">🤖</div>
                <div className="chatbot-typing">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="suggestion-chip" onClick={() => sendMessage(s)}>{s}</button>
            ))}
          </div>

          <div className="chatbot-input-area">
            <input
              type="text"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="chatbot-send" onClick={() => sendMessage()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
