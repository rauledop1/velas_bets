import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

dotenv.config();

const { Pool } = pg;
const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize Schema and Tables
const initDB = async () => {
    try {
        const client = await pool.connect();

        // Create Schema
        await client.query('CREATE SCHEMA IF NOT EXISTS tellcandles_dev');

        // Create Tables
        const tables = ['products', 'workshops', 'packages'];

        for (const table of tables) {
            await client.query(`
        CREATE TABLE IF NOT EXISTS tellcandles_dev.${table} (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2),
            discount INTEGER DEFAULT 0,
            image TEXT,
            "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
        }

        client.release();
        console.log('Database initialized successfully: tellcandles_dev schema and tables ready.');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDB();

// API Routes

// GET all items from a category
app.get('/api/:type', async (req, res) => {
    const { type } = req.params;
    const validTypes = ['products', 'workshops', 'packages'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const result = await pool.query(`SELECT * FROM tellcandles_dev.${type} ORDER BY "createdAt" DESC`);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// POST new item to a category
app.post('/api/:type', async (req, res) => {
    const { type } = req.params;
    const { title, description, price, discount, image } = req.body;
    const validTypes = ['products', 'workshops', 'packages'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        const result = await pool.query(
            `INSERT INTO tellcandles_dev.${type} (title, description, price, discount, image) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [title, description, price, discount || 0, image]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// DELETE item from a category
app.delete('/api/:type/:id', async (req, res) => {
    const { type, id } = req.params;
    const validTypes = ['products', 'workshops', 'packages'];

    if (!validTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid type' });
    }

    try {
        await pool.query(`DELETE FROM tellcandles_dev.${type} WHERE id = $1`, [id]);
        res.json({ message: 'Deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
