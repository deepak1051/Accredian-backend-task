import express from 'express';
import pool from './config/db.js';

import authRoutes from './routes/authRoutes.js';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello from honepage');
});

app.use('/users', authRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`running on port ${port}`));
