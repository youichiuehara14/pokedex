import express from 'express';

import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import path from 'path';
import customPokemonRoute from './routes/customPokemonRoute.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
// app.use(cors());
app.use(express.json());

app.use('/api/v1/custom-pokemon', customPokemonRoute);

const __dirname = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));
  app.get('/{*splat}', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
