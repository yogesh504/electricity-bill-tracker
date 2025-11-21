const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
// CORS - allow all origins (you can restrict this later for security)
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/electricityTracker';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/', (req, res) => {
  res.json({ message: 'Electricity Bill Tracker API running' });
});

// API base route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'Electricity Bill Tracker API',
    endpoints: {
      auth: '/api/auth',
      readings: '/api/readings'
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Check MongoDB connection
    const mongoose = require('mongoose');
    const mongoStatus = mongoose.connection.readyState;
    const mongoStates = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };

    res.json({
      status: 'ok',
      mongodb: {
        status: mongoStates[mongoStatus] || 'unknown',
        connected: mongoStatus === 1
      },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      error: err.message
    });
  }
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/readings', require('./routes/readings'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
