const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Initialize Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('../firebase-service-account.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://project-aqi-43620.firebaseio.com'
  });
}

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userRecord = await admin.auth().createUser({
      email,
      password
    });

    res.status(201).json({ 
      uid: userRecord.uid,
      email: userRecord.email 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Signin route
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user by email
    const user = await admin.auth().getUserByEmail(email);
    
    // In production, you would verify the password here
    // This is simplified for demonstration
    
    res.status(200).json({ 
      uid: user.uid,
      email: user.email 
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Password reset route
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const link = await admin.auth().generatePasswordResetLink(email);
    
    res.status(200).json({ 
      status: 'success',
      message: 'Password reset link generated',
      resetLink: link
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
