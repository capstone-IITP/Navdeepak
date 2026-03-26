import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import apiRoutes from './routes/api.js';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to PostgreSQL
connectDB();

// API Routes
app.use('/api', apiRoutes);

// Optional: Serve static files in production
// app.use(express.static(path.join(__dirname, '../dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../dist/index.html'));
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
