// create-admin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const inquirer = require('inquirer');
const User = require('./models/User'); // Adjust path if needed
const connectDB = require('./config/db'); // Adjust path if needed

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();

    const answers = await inquirer.prompt([
      { type: 'input', name: 'name', message: "Enter admin's name:" },
      { type: 'input', name: 'email', message: "Enter admin's email:" },
      { type: 'password', name: 'password', message: "Enter admin's password:", mask: '*' },
    ]);

    const { name, email, password } = answers;

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.error('Error: An admin with this email already exists.');
      mongoose.disconnect();
      return;
    }

    const admin = new User({
      name,
      email,
      password,
      role: 'admin', // Explicitly set the role to admin
    });

    await admin.save();
    console.log('✅ Admin user created successfully!');
    mongoose.disconnect();

  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
    process.exit(1);
  }
};

createAdmin();