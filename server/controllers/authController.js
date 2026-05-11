const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Demo users (in production, fetch from MongoDB)
const DEMO_USERS = [
  { id: '1', username: 'admin',    email: 'admin@campus.edu',    password: bcrypt.hashSync('admin123', 10), role: 'admin'    },
  { id: '2', username: 'operator', email: 'operator@campus.edu', password: bcrypt.hashSync('op123',    10), role: 'operator' },
  { id: '3', username: 'viewer',   email: 'viewer@campus.edu',   password: bcrypt.hashSync('view123',  10), role: 'viewer'   },
];

const signToken = (user) => jwt.sign(
  { id: user.id, username: user.username, email: user.email, role: user.role },
  process.env.JWT_SECRET || 'campusops_secret',
  { expiresIn: process.env.JWT_EXPIRE || '8h' }
);

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = DEMO_USERS.find(u => u.username === username || u.email === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = signToken(user);

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me
const getMe = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { login, getMe };
