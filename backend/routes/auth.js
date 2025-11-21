const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();

// Initialize Google OAuth client with validation
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  console.error('WARNING: GOOGLE_CLIENT_ID environment variable is not set!');
}
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    let existing;
    try {
      existing = await User.findOne({ email });
    } catch (dbError) {
      console.error('Database error finding existing user:', dbError);
      return res.status(500).json({ 
        message: "Database error", 
        error: dbError.message,
        hint: "Check MongoDB connection"
      });
    }

    if (existing)
      return res.status(400).json({ message: "Email already registered" });

    let hashed;
    try {
      hashed = await bcrypt.hash(password, 10);
    } catch (bcryptError) {
      console.error('Bcrypt hash error:', bcryptError);
      return res.status(500).json({ 
        message: "Password hashing error", 
        error: bcryptError.message 
      });
    }

    let user;
    try {
      user = await User.create({ email, password: hashed });
    } catch (createError) {
      console.error('User creation error:', createError);
      return res.status(500).json({ 
        message: "User creation error", 
        error: createError.message 
      });
    }

    let token;
    try {
      token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "changeme",
        { expiresIn: "7d" }
      );
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        message: "Token generation error", 
        error: jwtError.message 
      });
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    // Check if user exists
    let user;
    try {
      user = await User.findOne({ email });
    } catch (dbError) {
      console.error('Database error finding user:', dbError);
      return res.status(500).json({ 
        message: "Database error", 
        error: dbError.message,
        hint: "Check MongoDB connection"
      });
    }

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Check if user has a password (for Google-only users)
    if (!user.password) {
      return res.status(400).json({ 
        message: "This account was created with Google. Please use Google Sign-In." 
      });
    }

    // Compare passwords
    let match;
    try {
      match = await bcrypt.compare(password, user.password);
    } catch (bcryptError) {
      console.error('Bcrypt error:', bcryptError);
      return res.status(500).json({ 
        message: "Password verification error", 
        error: bcryptError.message 
      });
    }

    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    let token;
    try {
      token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "changeme",
        { expiresIn: "7d" }
      );
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return res.status(500).json({ 
        message: "Token generation error", 
        error: jwtError.message 
      });
    }

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ 
      message: "Server error", 
      error: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }
});

router.post("/google", async (req, res) => {
  try {
    // Check if Google Client ID is configured
    if (!GOOGLE_CLIENT_ID) {
      return res.status(500).json({ 
        message: "Google OAuth not configured", 
        error: "GOOGLE_CLIENT_ID environment variable is missing" 
      });
    }

    const { credential } = req.body;
    if (!credential)
      return res.status(400).json({ message: "No credential provided" });

    // Verify the Google token
    let ticket;
    try {
      ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: GOOGLE_CLIENT_ID,
      });
    } catch (verifyError) {
      console.error('Google token verification error:', verifyError);
      return res.status(400).json({ 
        message: "Invalid Google token", 
        error: verifyError.message 
      });
    }

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email)
      return res.status(400).json({ message: "Google account has no email" });

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        googleId: payload.sub,
        name: payload.name,
        picture: payload.picture,
      });
    } else {
      user.googleId = user.googleId || payload.sub;
      user.name = payload.name || user.name;
      user.picture = payload.picture || user.picture;
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "changeme",
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error('Google login error:', err);
    // Provide more detailed error information
    const errorMessage = err.message || 'Unknown error';
    const errorDetails = {
      message: "Google login failed",
      error: errorMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    res.status(500).json(errorDetails);
  }
});

module.exports = router;
