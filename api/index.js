const express = require('express');
const app = express();
require('dotenv').config();
const  Transaction = require('./models/Transaction');
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors());
app.use(express.json());
app.get('/api/test', (req, res) => {
  res.send('Hello World i am coming for yooo');
});
app.post('/api/transaction', async(req, res) => {
    const { name, description, datetime,price } = req.body;
    console.log(process.env.MONGO_URL);
    await mongoose.connect(process.env.MONGO_URL)
    const transaction=await Transaction.create({ name, description, datetime,price });
    res.json(transaction);
});

port=4040;
app.listen(port);