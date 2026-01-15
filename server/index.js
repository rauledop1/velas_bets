import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import db from './db.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// File Upload Handling (Memory Storage for quick proxy)
const upload = multer({ storage: multer.memoryStorage() });

// IMGBB Proxy Endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const imageBuffer = req.file.buffer.toString('base64');
        const formData = new FormData();
        formData.append('image', imageBuffer);

        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_TOKEN}`, formData, {
            headers: formData.getHeaders()
        });

        if (response.data && response.data.data && response.data.data.url) {
            res.json({ url: response.data.data.url });
        } else {
            throw new Error('ImgBB API response invalid');
        }

    } catch (error) {
        console.error('ImgBB Upload Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});

// Products Endpoints
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/products', async (req, res) => {
    const { title, description, price, discount, image, type } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO products (title, description, price, discount, image, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, price, discount, image, type]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
