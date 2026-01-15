import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const migrateOrders = async () => {
    try {
        console.log('🔄 Starting migration: Creating orders table...');

        await db.query(`
            CREATE TABLE IF NOT EXISTS tellcandles_dev.orders (
                id SERIAL PRIMARY KEY,
                contact_info JSONB NOT NULL,
                items JSONB NOT NULL,
                total NUMERIC(10, 2) NOT NULL,
                status VARCHAR(50) DEFAULT 'Recibido',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('✅ Migration successful: orders table created.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateOrders();
