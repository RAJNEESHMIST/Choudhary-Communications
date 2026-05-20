import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDb } from './config/db.js';
import productsRouter from './routes/products.js';
import offersRouter from './routes/offers.js';
import servicesRouter from './routes/services.js';
import settingsRouter from './routes/settings.js';
import authRouter from './routes/auth.js';

dotenv.config();
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/offers', offersRouter);
app.use('/api/services', servicesRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Choudhary Communications API' });
});

const port = process.env.PORT || 5000;
const useFallback = process.env.FALLBACK_DB === 'true';
const mongoUri = useFallback ? '' : process.env.MONGODB_URI;

async function startServer() {
  if (mongoUri) {
    try {
      await connectDb(mongoUri);
      app.listen(port, () => console.log(`API running on port ${port}`));
    } catch (error) {
      console.error('Database connection failed:', error.message);
      console.error('If Atlas IP whitelist is enabled, verify your MONGODB_URI and network access.');
      process.exit(1);
    }
  } else {
    if (useFallback) {
      console.warn('FALLBACK_DB=true detected. Starting server with in-memory fallback data.');
    } else {
      console.warn('MONGODB_URI not configured. Starting server with in-memory fallback data.');
    }

    app.listen(port, () => console.log(`API running on port ${port} (fallback mode)`));
  }
}

startServer();