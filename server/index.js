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
        console.log('📸 Upload request received');
        if (!req.file) {
            console.log('❌ No file in request');
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log(`📦 File size: ${req.file.size} bytes, Mime: ${req.file.mimetype}`);

        const formData = new FormData();
        // Send request as a file upload (Buffer) with filename
        formData.append('image', req.file.buffer, {
            filename: req.file.originalname || 'upload.jpg'
        });

        console.log('🚀 Sending to ImgBB...');
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.IMGBB_TOKEN}`, formData, {
            headers: formData.getHeaders()
        });

        if (response.data && response.data.data && response.data.data.url) {
            console.log('✅ Upload success:', response.data.data.url);
            res.json({ url: response.data.data.url });
        } else {
            throw new Error('ImgBB API response invalid');
        }

    } catch (error) {
        console.error('❌ ImgBB Upload Error Detail:', error.response ? error.response.data : error.message);
        res.status(500).json({
            error: 'Failed to upload image',
            details: error.message
        });
    }
});

// Products Endpoints
app.get('/api/products', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tellcandles_dev.products WHERE active = TRUE ORDER BY "createdAt" DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.get('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('SELECT * FROM tellcandles_dev.products WHERE id = $1 AND active = TRUE', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.post('/api/products', async (req, res) => {
    const { title, description, price, discount, image, type, options } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO tellcandles_dev.products (title, description, price, discount, image, type, "createdAt", active, options) VALUES ($1, $2, $3, $4, $5, $6, $7, TRUE, $8) RETURNING *',
            [title, description, price, discount, image, type, new Date(), JSON.stringify(options || [])]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('UPDATE tellcandles_dev.products SET active = FALSE WHERE id = $1', [id]);
        res.json({ success: true, message: 'Product soft deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

import { sendStatusEmail } from './email.js';

// ... (existing helper function / middle of file)

// Orders Endpoints

// Create Order
app.post('/api/orders', async (req, res) => {
    const { contactInfo, items, total } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO tellcandles_dev.orders (contact_info, items, total, status) VALUES ($1, $2, $3, $4) RETURNING *',
            [JSON.stringify(contactInfo), JSON.stringify(items), total, 'Recibido']
        );
        const newOrder = result.rows[0];

        // Notify User (Async)
        sendStatusEmail(contactInfo.email, newOrder.id, 'Recibido', items);

        res.json(newOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// List Orders (Admin)
// In a real app, this should be protected
app.get('/api/orders', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM tellcandles_dev.orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update Order Status
app.put('/api/orders/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const result = await db.query(
            'UPDATE tellcandles_dev.orders SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Order not found' });
        }

        const updatedOrder = result.rows[0];

        // Notify User
        // Need to parse contact_info to get email
        const contactInfo = updatedOrder.contact_info; // pg driver parses JSON automatically usually, but let's be safe
        const email = contactInfo.email || (typeof contactInfo === 'string' ? JSON.parse(contactInfo).email : null);

        if (email) {
            sendStatusEmail(email, updatedOrder.id, status, updatedOrder.items);
        }

        res.json(updatedOrder);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
