// controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new student
// @route   POST /api/auth/register
// controllers/authController.js
// ... (keep imports)

exports.register = async (req, res) => {
  // Destructure name, email, password AND the new secretKey from the body
  const { name, email, password, secretKey } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // --- Start of New Logic ---
    let userRole = 'student'; // Default role is student

    // Check if a secret key was provided and if it matches the one in .env
    if (secretKey && secretKey === process.env.ADMIN_SECRET_KEY) {
      userRole = 'admin';
    }
    // --- End of New Logic ---

    user = new User({
      name,
      email,
      password,
      role: userRole, // Assign the role determined above
    });

    await user.save();

    const payload = {
      user: { id: user.id, role: user.role },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// ... (keep login function)
// @desc    Authenticate user & get token (Login)
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Compare entered password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};