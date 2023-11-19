const mongoose = require('mongoose');
require('dotenv').config();
const express = require('express');
mongoose.set('strictQuery', false);
mongoose.connect(process.env.REACT_APP_MONGO_URI).then(() => {
  console.log('CONNECTED TO DATABASE!')});
const app = express();

var cors = require('cors')

const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())
app.use(express.json())

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})