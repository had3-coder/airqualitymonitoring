require('dotenv').config();
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/air-quality')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);

// Notification Settings API
app.post('/api/notification-settings', authMiddleware, async (req, res) => {
    try {
        const { 
            emailSystemAlerts, 
            emailAddress, 
            smsDeviceAlerts, 
            phoneNumber, 
            device1PushAlerts,
            device1Token,
            device2PushAlerts,
            device2Token 
        } = req.body;
        
        // Save to database (implement your database logic here)
        // For ESP8266/SIM800L integration:
        // 1. Store device tokens for push notifications
        // 2. Configure SMS gateway
        // 3. Set up email service
        
        res.status(200).json({ status: 'success' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Protected dashboard route
app.get('/dashboard', authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});