import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import apiRoutes from './routes/api.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

// Optional MongoDB Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log('MongoDB connection error:', err));
} else {
    console.log('No MONGO_URI provided, skipping database connection.');
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
