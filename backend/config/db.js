const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error('--- DATABASE CONNECTION ERROR ---');
        console.error(`Message: ${error.message}`);
        console.error('Possible Causes:');
        console.error('1. MONGODB_URI is incorrect or missing in environment variables.');
        console.error('2. IP address of the server (Render) is not whitelisted in MongoDB Atlas.');
        console.error('3. Database user credentials in the URI are incorrect.');
        console.error('---------------------------------');
        process.exit(1);
    }
};

module.exports = connectDB;
