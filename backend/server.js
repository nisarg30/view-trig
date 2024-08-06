const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const Data = require('./model.js');

dotenv.config({ path: './.env' });
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Replace with your MongoDB connection string
const mongoURI = `mongodb+srv://${process.env.use}:${process.env.pass}@cluster0.lsqbqko.mongodb.net/trigger?retryWrites=true&w=majority`;

function formatEpoch(epoch) {
  const date = new Date(epoch * 1000); // Convert seconds to milliseconds

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.get('/data', async (req, res) => {
  try {
    const nifty1 = await Data.findOne({ stockname: 'NIFTY_1' }).exec();
    const nifty5 = await Data.findOne({ stockname: 'NIFTY_5' }).exec();
    
    if (!nifty1 || !nifty5) {
      return res.status(404).json({ message: 'Stock data not found' });
    }

    // Extract last 10 logs and format the timestamp
    const last10Nifty1 = nifty1.log.slice(-10).map(entry => ({
      ...entry.toObject(), // Convert Mongoose document to plain object
      time: formatEpoch(entry.time)
    }));

    const last10Nifty5 = nifty5.log.slice(-10).map(entry => ({
      ...entry.toObject(), // Convert Mongoose document to plain object
      time: formatEpoch(entry.time)
    }));

    // console.log('Last 10 entries for NIFTY_1:', last10Nifty1);
    // console.log('Last 10 entries for NIFTY_5:', last10Nifty5);
    res.json({
      NIFTY_1: last10Nifty1,
      NIFTY_5: last10Nifty5
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
