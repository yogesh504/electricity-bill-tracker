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

app.use('/api/auth', require('./routes/auth'));
app.use('/api/readings', require('./routes/readings'));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
