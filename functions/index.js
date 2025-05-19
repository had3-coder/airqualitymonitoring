const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password'
    }
});

// Function to send email
exports.sendEmailNotification = functions.https.onRequest((request, response) => {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: request.body.email,
        subject: 'Test Email',
        text: 'This is a test email from Firebase Functions!'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return response.status(500).send(error.toString());
        }
        response.status(200).send('Email sent: ' + info.response);
    });
});
