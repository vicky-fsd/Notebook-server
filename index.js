const mongoose = require('mongoose');
const express = require('express');
const redis = require('redis');
const cors = require('cors'); 
require('dotenv').config();

mongoose.set('strictQuery', false);

// MongoDB Connection
mongoose.connect(process.env.REACT_APP_MONGO_URI).then(() => {
  console.log('CONNECTED TO DATABASE!');
});

// Redis Connection
const redisClient = redis.createClient({
  host: 'localhost', // Redis server host
  port: 6379,         // Redis server port
  password: 'v2i4g0n6e9s6h', // Uncomment and provide your Redis password if authentication is required
});

redisClient.on('error', function (err) {
  console.error('Redis Connection Error:', err);
});

redisClient.on('connect', function () {
  console.log('Connected to Redis');
});

// Express App
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
