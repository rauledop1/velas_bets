import dotenv from 'dotenv';
import pg from 'pg';
import axios from 'axios';
import FormData from 'form-data';

dotenv.config();

const { Pool } = pg;

console.log('🔍 Starting Diagnostics...');

// 1. Check ENV Variables
console.log('--------------------------------');
console.log('Checking Environment Variables:');
if (process.env.DATABASE_URL) console.log('✅ DATABASE_URL is set.');
else console.error('❌ DATABASE_URL is MISSING!');

if (process.env.IMGBB_TOKEN) console.log('✅ IMGBB_TOKEN is set.');
else console.error('❌ IMGBB_TOKEN is MISSING!');

// 2. Test Database Connection
console.log('--------------------------------');
console.log('Testing PostgreSQL Connection...');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000 // 5s timeout
});

(async () => {
    let client;
    try {
        client = await pool.connect();
        const res = await client.query('SELECT NOW()');
        console.log('✅ Database Connected Successfully!');
        console.log('   Server Time:', res.rows[0].now);
        // client.release(); // Keep open for later insert
    } catch (err) {
        console.error('❌ Database Connection FAILED:', err.message);
        if (err.message.includes('password')) console.log('   (Hint: Check your database password)');
        if (err.message.includes('addr')) console.log('   (Hint: Check the hostname)');
    }

    // 3. Test ImgBB Upload
    console.log('--------------------------------');
    console.log('Testing ImgBB Upload...');
    try {
        // Create a 1x1 pixel transparent GIF
        const base64Image = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        const buffer = Buffer.from(base64Image, 'base64');

        const formData = new FormData();
        formData.append('image', buffer, { filename: 'test_pixel.gif' });

        const url = `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_TOKEN}`;

        const response = await axios.post(url, formData, {
            headers: formData.getHeaders()
        });

        if (response.data && response.data.data && response.data.data.url) {
            const imageUrl = response.data.data.url;
            console.log('✅ ImgBB Upload Success!');
            console.log('   URL:', imageUrl);

            // 4. Test Database Insert with this URL
            console.log('--------------------------------');
            console.log('Testing Database Insert...');
            try {
                const insertRes = await client.query(
                    'INSERT INTO tellcandles_dev.products (title, description, price, discount, image, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
                    ['Diagnostic Test', 'Created by diagnose.js', 99.99, 0, imageUrl, 'Producto']
                );
                console.log('✅ Database Insert Success!');
                console.log('   New Product ID:', insertRes.rows[0].id);

                // Cleanup (optional, but good to keep DB clean)
                // await client.query('DELETE FROM products WHERE id = $1', [insertRes.rows[0].id]);
                // console.log('   (Cleaned up test record)');

            } catch (dbErr) {
                console.error('❌ Database Insert FAILED:', dbErr.message);
            }

        } else {
            console.error('❌ ImgBB Response unexpected:', response.data);
        }

    } catch (err) {
        console.error('❌ ImgBB Upload FAILED:', err.response ? err.response.data : err.message);
    }

    console.log('--------------------------------');
    console.log('Diagnostics Complete.');
    if (client) client.release();
    process.exit(0);
})();
