import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db.js';

dotenv.config();

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seed...');

        // 1. Create Table if not exists
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await db.query(schemaSql);
        console.log('✅ Schema ensured.');

        // 2. Read Data
        const dataPath = path.join(__dirname, '../public/data.json');
        const rawData = fs.readFileSync(dataPath, 'utf8');
        const data = JSON.parse(rawData);

        // 4. Insert Data
        const allItems = [
            ...data.products.map(i => ({ ...i, type: 'Producto' })),
            ...data.workshops.map(i => ({ ...i, type: 'Taller' })),
            ...data.packages.map(i => ({ ...i, type: 'Paquete' }))
        ];

        for (const item of allItems) {
            // Check if item already exists by title to avoid duplicates
            const existing = await db.query('SELECT id FROM products WHERE title = $1', [item.title]);
            if (existing.rows.length > 0) {
                console.log(`⚠️  Skipping "${item.title}" (already exists)`);
                continue;
            }

            // Clean price (remove currency symbol if present, ensure number)
            const price = parseFloat(item.price.toString().replace('$', ''));
            const discount = parseInt(item.discount || 0);

            await db.query(
                'INSERT INTO products (title, description, price, discount, image, type) VALUES ($1, $2, $3, $4, $5, $6)',
                [item.title, item.description, price, discount, item.image || '', item.type]
            );
            console.log(`✨ Inserted: ${item.title} (${item.type})`);
        }

        console.log('✅ Seeding complete!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
};

seedDatabase();
