const express = require("express");
const app = express();
require("dotenv").config();
const Transaction = require("./models/Transaction");
const mongoose = require("mongoose");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.get("/api/test", (req, res) => {
  res.send("Hello World i am coming for yooo");
});
//end point for posting a transaction
app.post("/api/transaction", async (req, res) => {
  const { name, description, datetime, price } = req.body;
  console.log(process.env.MONGO_URL);
  await mongoose.connect(process.env.MONGO_URL);
  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    price,
  });
  res.json(transaction);
});
//end point for getting all transactions
app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});
//end point for updating a transaction
app.put("/api/transaction/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, datetime, price } = req.body;
  await mongoose.connect(process.env.MONGO_URL);
  const updatedTransaction = await Transaction.findByIdAndUpdate(
    id,
    { name, description, datetime, price },
    { new: true } // This option returns the updated document
  );
  res.json(updatedTransaction);
});

//end point for deleting a transaction
app.delete("/api/transaction/:id", async (req, res) => {
  const { id } = req.params;
  await mongoose.connect(process.env.MONGO_URL);
  const deletedTransaction = await Transaction.findByIdAndDelete(id);
  if (deletedTransaction) {
    res.json({ message: "Transaction deleted successfully" });
  } else {
    res.status(404).json({ message: "Transaction not found" });
  }
});

port = 4040;
app.listen(port);
