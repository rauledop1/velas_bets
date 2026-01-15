import dotenv from 'dotenv';
import db from './db.js';

dotenv.config();

const migrateOptions = async () => {
    try {
        console.log('🔄 Starting migration: Adding options column...');

        await db.query(`ALTER TABLE tellcandles_dev.products ADD COLUMN IF NOT EXISTS options JSONB DEFAULT '[]'`);

        console.log('✅ Migration successful: options column added.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
};

migrateOptions();
