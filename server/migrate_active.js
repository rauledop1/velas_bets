import db from './db.js';

const migrate = async () => {
    try {
        console.log('🔄 Migrating: Adding "active" column...');

        await db.query(`ALTER TABLE tellcandles_dev.products ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE`);

        // Ensure all existing nulls are true
        await db.query(`UPDATE tellcandles_dev.products SET active = TRUE WHERE active IS NULL`);

        console.log('✅ Migration successful: "active" column added and populated.');
        process.exit(0);
    } catch (e) {
        console.error('❌ Migration failed:', e);
        process.exit(1);
    }
};

migrate();
