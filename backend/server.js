import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import authRouter from './routes/auth.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  console.error('MONGO_URI is not set. Please configure it in your environment.');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

app.use('/api/auth', authRouter);

// Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
