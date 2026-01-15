import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'smtp.gmail.com'
    auth: {
        user: process.env.EMAIL_USER, // Need to set this in .env
        pass: process.env.EMAIL_PASS
    }
});

export const sendStatusEmail = async (to, orderId, status, items) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`⚠️ Email credentials missing. Simulate sending email to ${to} about Order #${orderId} - Status: ${status}`);
        return;
    }

    const subject = `Actualización de Pedido #${orderId} - Tell Candles`;
    const text = `Hola! Tu pedido #${orderId} ha cambiado de estado a: "${status}".\n\nGracias por tu compra!`;

    // Simple HTML template
    const html = `
        <div style="font-family: Arial, sans-serif; color: #333;">
            <h1 style="color: #D65A68;">Tell Candles</h1>
            <h2>Actualización de tu Pedido</h2>
            <p>Hola,</p>
            <p>El estado de tu pedido <strong>#${orderId}</strong> ha cambiado a:</p>
            <h3 style="background-color: #fce4ec; padding: 10px; display: inline-block;">${status}</h3>
            <p>Gracias por confiar en nosotros!</p>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: '"Tell Candles" <no-reply@tellcandles.com>',
            to,
            subject,
            text,
            html
        });
        console.log(`📧 Email sent to ${to} for Order #${orderId}`);
    } catch (error) {
        console.error('❌ Error sending email:', error);
    }
};
