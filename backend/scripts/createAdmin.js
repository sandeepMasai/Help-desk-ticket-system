const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();
const connectDB = require('../config/db');

// Connect to MongoDB and create admin
const createAdmin = async () => {
    try {
        await connectDB();
        console.log('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin user already exists:', existingAdmin.email);
            await mongoose.connection.close();
            process.exit(0);
        }

        // Create admin user
        const admin = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123', // Will be hashed automatically
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');
        console.log('\n⚠️  Please change the password after first login!');

        await mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        await mongoose.connection.close();
        process.exit(1);
    }
};

createAdmin();

