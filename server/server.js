const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'secret-key';  // Replace with strong key in real apps

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Serve Frontend (for deployment: React build)
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Load Orders Data (once at server start)
const orders = JSON.parse(fs.readFileSync('./orders.json', 'utf-8'));

// Hardcoded Single User (Demo purpose)
const USER = {
  username: 'Thala',
  password: bcrypt.hashSync('Thala7', 8)
};

// 🔐 Middleware: Verify Token
function auth(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized');
  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch {
    res.status(403).send('Invalid Token');
  }
}

// 👉 Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USER.username && bcrypt.compareSync(password, USER.password)) {
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

  const filtered = status ? orders.filter(o => o.status === status) : orders;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    orders: paginated,
    total: filtered.length
  });
});

// 👉 Search Orders by Customer, Product, Status + Pagination
app.get('/api/orders/search', auth, (req, res) => {
  const { customer_id, product_id, status, page = 1 } = req.query;
  const pageSize = 50;

  let result = orders;

  if (customer_id) result = result.filter(o => o.customer_id.includes(customer_id));
  if (product_id) result = result.filter(o => o.product_id.includes(product_id));
  if (status) result = result.filter(o => o.status === status);

  const paginated = result.slice((page - 1) * pageSize, page * pageSize);

  res.json({
    orders: paginated,
    total: result.length
  });
});

// Serve React Frontend for any other route (🌐 Deployment support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});
