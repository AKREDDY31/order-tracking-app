const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const app = express();
const PORT = 5000;
const SECRET_KEY = 'secret-key';  // Use a strong secret key in production

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Load Orders Data
const orders = JSON.parse(fs.readFileSync('./orders.json', 'utf-8'));

// Hardcoded Single User (In real-world → use database)
const USER = {
  username: 'Thala',
  password: bcrypt.hashSync('Thala7', 8) // Hashed password
};
// Authentication Middleware
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');

  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (err) {
    res.status(403).send('Invalid Token');
  }
}

// 👉 Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const validUser = username === USER.username && bcrypt.compareSync(password, USER.password);

  if (validUser) {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid Credentials');
  }
});

// 👉 Get Orders by Status + Pagination
app.get('/api/orders', auth, (req, res) => {
  const { status, page = 1 } = req.query;
  const pageSize = 50;

  const filteredOrders = status
    ? orders.filter(o => o.status === status)
    : orders;

  const paginatedOrders = filteredOrders.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    orders: paginatedOrders,
    total: filteredOrders.length
  });
});

// 👉 Search Orders by Customer, Product, Status + Pagination
app.get('/api/orders/search', auth, (req, res) => {
  const { customer_id, product_id, status, page = 1 } = req.query;
  const pageSize = 50;

  let results = orders;

  if (customer_id) results = results.filter(o => o.customer_id.includes(customer_id));
  if (product_id) results = results.filter(o => o.product_id.includes(product_id));
  if (status) results = results.filter(o => o.status === status);

  const paginatedResults = results.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    orders: paginatedResults,
    total: results.length
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
