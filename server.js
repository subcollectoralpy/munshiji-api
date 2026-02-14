const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { status: 'error', message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);

// ==================== DEMO DATA ====================

const PRODUCTS = [
  { id: '1', name_hindi: 'टाटा नमक 1kg', name_english: 'Tata Salt 1kg', category: 'अनाज', purchase_price: 18, mrp: 20, selling_price: 20, current_stock: 45, min_stock: 20, margin_percent: 11.1, gst_rate: 0 },
  { id: '2', name_hindi: 'सुर्या तेल 1L', name_english: 'Surya Oil 1L', category: 'तेल', purchase_price: 118, mrp: 140, selling_price: 140, current_stock: 12, min_stock: 15, margin_percent: 18.6, gst_rate: 5 },
  { id: '3', name_hindi: 'पारले-जी बिस्कुट', name_english: 'Parle-G Biscuits', category: 'बिस्कुट', purchase_price: 8, mrp: 10, selling_price: 10, current_stock: 87, min_stock: 30, margin_percent: 25, gst_rate: 12 },
  { id: '4', name_hindi: 'अमूल दूध 1L', name_english: 'Amul Milk 1L', category: 'डेयरी', purchase_price: 52, mrp: 58, selling_price: 58, current_stock: 24, min_stock: 20, margin_percent: 11.5, gst_rate: 0 },
  { id: '5', name_hindi: 'ब्रिटानिया ब्रेड', name_english: 'Britannia Bread', category: 'बेकरी', purchase_price: 32, mrp: 40, selling_price: 40, current_stock: 15, min_stock: 10, margin_percent: 25, gst_rate: 0 },
  { id: '6', name_hindi: 'कोलगेट टूथपेस्ट', name_english: 'Colgate Toothpaste', category: 'व्यक्तिगत देखभाल', purchase_price: 75, mrp: 95, selling_price: 95, current_stock: 22, min_stock: 15, margin_percent: 26.7, gst_rate: 18 },
  { id: '7', name_hindi: 'लक्स साबुन', name_english: 'Lux Soap', category: 'व्यक्तिगत देखभाल', purchase_price: 28, mrp: 35, selling_price: 35, current_stock: 45, min_stock: 30, margin_percent: 25, gst_rate: 18 },
  { id: '8', name_hindi: 'सर्फ एक्सेल 1kg', name_english: 'Surf Excel 1kg', category: 'घर की देखभाल', purchase_price: 165, mrp: 200, selling_price: 200, current_stock: 8, min_stock: 10, margin_percent: 21.2, gst_rate: 18 },
  { id: '9', name_hindi: 'मैगी नूडल्स', name_english: 'Maggi Noodles', category: 'पैक खाद्य', purchase_price: 10, mrp: 14, selling_price: 14, current_stock: 65, min_stock: 40, margin_percent: 40, gst_rate: 12 },
  { id: '10', name_hindi: 'कोका-कोला 1L', name_english: 'Coca-Cola 1L', category: 'पेय', purchase_price: 35, mrp: 45, selling_price: 45, current_stock: 28, min_stock: 25, margin_percent: 28.6, gst_rate: 12 }
];

const CUSTOMERS = [
  { id: '1', name: 'राजेश कुमार', phone: '+91-9999900001', address: 'गांधी नगर, पटना', total_outstanding: 2500, credit_limit: 10000, days_overdue: 15, total_visits: 45 },
  { id: '2', name: 'सुरेश शर्मा', phone: '+91-9999900002', address: 'बोरिंग रोड, पटना', total_outstanding: 1200, credit_limit: 5000, days_overdue: 8, total_visits: 28 },
  { id: '3', name: 'अनिता देवी', phone: '+91-9999900003', address: 'कंकड़बाग, पटना', total_outstanding: 800, credit_limit: 3000, days_overdue: 3, total_visits: 62 },
  { id: '4', name: 'मनोज यादव', phone: '+91-9999900004', address: 'पटना सिटी', total_outstanding: 0, credit_limit: 8000, days_overdue: 0, total_visits: 89 },
  { id: '5', name: 'प्रिया सिंह', phone: '+91-9999900005', address: 'राजेंद्र नगर', total_outstanding: 3200, credit_limit: 15000, days_overdue: 22, total_visits: 34 }
];

let SALES = [
  { id: '1', bill_number: 'BILL-001', date: '2024-01-15T10:30:00Z', customer_name: 'राजेश कुमार', customer_id: '1', total_amount: 350, paid_amount: 0, credit_amount: 350, payment_mode: 'CREDIT', items_count: 5 },
  { id: '2', bill_number: 'BILL-002', date: '2024-01-15T11:15:00Z', customer_name: 'Walk-in', customer_id: null, total_amount: 125, paid_amount: 125, credit_amount: 0, payment_mode: 'CASH', items_count: 3 },
  { id: '3', bill_number: 'BILL-003', date: '2024-01-15T14:20:00Z', customer_name: 'सुरेश शर्मा', customer_id: '2', total_amount: 580, paid_amount: 580, credit_amount: 0, payment_mode: 'UPI', items_count: 8 }
];

// ==================== ROUTES ====================

// Home
app.get('/', (req, res) => {
  res.json({
    name: 'Munshi Ji API',
    version: '1.0.0',
    status: 'running',
    message: 'मुंशी जी API चालू है! | Munshi Ji API is running!',
    description: 'Complete Kirana Store Management System',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/health',
      test_ui: '/test',
      api_docs: '/api/v1',
      auth: '/api/v1/auth/*',
      products: '/api/v1/products',
      sales: '/api/v1/sales',
      customers: '/api/v1/customers',
      reports: '/api/v1/reports/*'
    },
    demo_credentials: {
      phone: '+91-9999900001',
      otp: '123456',
      note: 'Use these credentials to test authentication'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Server is healthy',
    message_hindi: 'सर्वर बिल्कुल ठीक है',
    uptime_seconds: Math.floor(process.uptime()),
    memory_usage: process.memoryUsage(),
    timestamp: new Date().toISOString()
  });
});

// Test UI
app.get('/test', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Munshi Ji - API Testing Dashboard</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
    .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 20px; padding: 40px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); }
    h1 { color: #667eea; text-align: center; margin-bottom: 10px; font-size: 2.5em; }
    .hindi { text-align: center; color: #764ba2; font-size: 1.3em; margin-bottom: 30px; }
    .section { background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
    .section h2 { color: #667eea; margin-bottom: 15px; }
    .btn { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 5px; font-weight: bold; border: none; cursor: pointer; transition: all 0.3s; }
    .btn:hover { background: #764ba2; transform: translateY(-2px); }
    .result { background: #fff; border: 2px solid #667eea; padding: 15px; border-radius: 8px; margin-top: 15px; font-family: 'Courier New', monospace; font-size: 14px; max-height: 400px; overflow-y: auto; }
    .status { display: inline-block; padding: 5px 10px; border-radius: 5px; font-size: 12px; font-weight: bold; }
    .status.success { background: #d4edda; color: #155724; }
    .status.error { background: #f8d7da; color: #721c24; }
    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #667eea; color: white; }
    .badge { display: inline-block; padding: 3px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; }
    .badge.low { background: #f8d7da; color: #721c24; }
    .badge.ok { background: #d4edda; color: #155724; }
  </style>
</head>
<body>
  <div class="container">
    <h1>🧾 Munshi Ji API</h1>
    <div class="hindi">मुंशी जी API टेस्टिंग डैशबोर्ड</div>

    <div class="section">
      <h2>📊 Quick Stats</h2>
      <table>
        <tr><th>Metric</th><th>Value</th></tr>
        <tr><td>Total Products</td><td>${PRODUCTS.length}</td></tr>
        <tr><td>Total Customers</td><td>${CUSTOMERS.length}</td></tr>
        <tr><td>Today's Sales</td><td>₹${SALES.reduce((sum, s) => sum + s.total_amount, 0)}</td></tr>
        <tr><td>Low Stock Items</td><td>${PRODUCTS.filter(p => p.current_stock <= p.min_stock).length}</td></tr>
        <tr><td>Total Outstanding</td><td>₹${CUSTOMERS.reduce((sum, c) => sum + c.total_outstanding, 0)}</td></tr>
      </table>
    </div>

    <div class="section">
      <h2>🧪 Test API Endpoints</h2>
      <button class="btn" onclick="testEndpoint('/api/v1/products')">Get All Products</button>
      <button class="btn" onclick="testEndpoint('/api/v1/sales')">Get Sales</button>
      <button class="btn" onclick="testEndpoint('/api/v1/customers')">Get Customers</button>
      <button class="btn" onclick="testEndpoint('/api/v1/reports/daily-sales')">Daily Sales Report</button>
      <button class="btn" onclick="testEndpoint('/api/v1/reports/profit-analysis')">Profit Analysis</button>
      <button class="btn" onclick="testEndpoint('/api/v1/reports/seasonal-insights')">Seasonal Insights</button>
      <div id="result" class="result" style="display:none;"></div>
    </div>

    <div class="section">
      <h2>📝 Products (${PRODUCTS.length})</h2>
      <table>
        <tr><th>Name</th><th>MRP</th><th>Stock</th><th>Margin</th><th>Status</th></tr>
        ${PRODUCTS.slice(0, 5).map(p => \`
          <tr>
            <td>\${p.name_hindi}</td>
            <td>₹\${p.mrp}</td>
            <td>\${p.current_stock}</td>
            <td>\${p.margin_percent.toFixed(1)}%</td>
            <td><span class="badge \${p.current_stock <= p.min_stock ? 'low' : 'ok'}">\${p.current_stock <= p.min_stock ? 'Low Stock' : 'OK'}</span></td>
          </tr>
        \`).join('')}
      </table>
    </div>

    <div class="section">
      <h2>👥 Customers (${CUSTOMERS.length})</h2>
      <table>
        <tr><th>Name</th><th>Phone</th><th>Outstanding</th><th>Status</th></tr>
        ${CUSTOMERS.map(c => \`
          <tr>
            <td>\${c.name}</td>
            <td>\${c.phone}</td>
            <td>₹\${c.total_outstanding}</td>
            <td><span class="badge \${c.days_overdue > 15 ? 'low' : 'ok'}">\${c.days_overdue > 15 ? 'Overdue' : 'Current'}</span></td>
          </tr>
        \`).join('')}
      </table>
    </div>
  </div>

  <script>
    async function testEndpoint(endpoint) {
      const resultDiv = document.getElementById('result');
      resultDiv.style.display = 'block';
      resultDiv.innerHTML = '<div style="text-align:center;">Loading...</div>';
      
      try {
        const response = await fetch(endpoint);
        const data = await response.json();
        resultDiv.innerHTML = '<div class="status success">✅ Success</div><br><pre>' + JSON.stringify(data, null, 2) + '</pre>';
      } catch (error) {
        resultDiv.innerHTML = '<div class="status error">❌ Error</div><br>' + error.message;
      }
    }
  </script>
</body>
</html>
  `);
});

// API Info
app.get('/api/v1', (req, res) => {
  res.json({
    version: '1.0.0',
    endpoints: {
      'POST /api/v1/auth/send-otp': 'Send OTP to phone',
      'POST /api/v1/auth/verify-otp': 'Verify OTP and login',
      'GET /api/v1/products': 'Get all products',
      'GET /api/v1/products/:id': 'Get product by ID',
      'POST /api/v1/products': 'Create new product',
      'GET /api/v1/sales': 'Get all sales',
      'POST /api/v1/sales': 'Create new sale',
      'GET /api/v1/customers': 'Get all customers',
      'GET /api/v1/reports/daily-sales': 'Get daily sales report',
      'GET /api/v1/reports/profit-analysis': 'Get profit analysis',
      'GET /api/v1/reports/seasonal-insights': 'Get seasonal insights'
    }
  });
});

// Auth - Send OTP
app.post('/api/v1/auth/send-otp', (req, res) => {
  const { phone_number } = req.body;
  res.json({
    status: 'success',
    message: 'OTP sent successfully',
    message_hindi: 'OTP भेज दिया गया',
    data: { phone_number, otp: '123456', note: 'For demo, use OTP: 123456' }
  });
});

// Auth - Verify OTP
app.post('/api/v1/auth/verify-otp', (req, res) => {
  const { phone_number, otp, name } = req.body;
  if (otp !== '123456') {
    return res.status(400).json({ status: 'error', message: 'Invalid OTP (use 123456)' });
  }
  res.json({
    status: 'success',
    message: 'Login successful',
    message_hindi: 'लॉगिन सफल',
    data: {
      user: { id: 'user_001', name: name || 'Demo User', phone_number },
      token: 'demo_token_' + Date.now(),
      shop: { id: 'shop_001', name: 'राज किराना', address: 'पटना' }
    }
  });
});

// Products - Get all
app.get('/api/v1/products', (req, res) => {
  const { search, category, low_stock } = req.query;
  let filtered = [...PRODUCTS];
  
  if (search) filtered = filtered.filter(p => p.name_hindi.includes(search) || p.name_english.toLowerCase().includes(search.toLowerCase()));
  if (category) filtered = filtered.filter(p => p.category === category);
  if (low_stock === 'true') filtered = filtered.filter(p => p.current_stock <= p.min_stock);
  
  res.json({ status: 'success', data: { products: filtered, count: filtered.length } });
});

// Products - Get by ID
app.get('/api/v1/products/:id', (req, res) => {
  const product = PRODUCTS.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ status: 'error', message: 'Product not found' });
  res.json({ status: 'success', data: { product } });
});

// Products - Create
app.post('/api/v1/products', (req, res) => {
  const newProduct = { id: String(PRODUCTS.length + 1), ...req.body };
  PRODUCTS.push(newProduct);
  res.status(201).json({ status: 'success', message: 'Product created', message_hindi: 'उत्पाद बनाया गया', data: { product: newProduct } });
});

// Sales - Get all
app.get('/api/v1/sales', (req, res) => {
  res.json({
    status: 'success',
    data: {
      sales: SALES,
      summary: {
        total_sales: SALES.reduce((sum, s) => sum + s.total_amount, 0),
        total_bills: SALES.length,
        cash_sales: SALES.filter(s => s.payment_mode === 'CASH').reduce((sum, s) => sum + s.paid_amount, 0),
        credit_sales: SALES.reduce((sum, s) => sum + s.credit_amount, 0)
      }
    }
  });
});

// Sales - Create
app.post('/api/v1/sales', (req, res) => {
  const { items, customer_name, payment_mode } = req.body;
  const total = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);
  const newSale = {
    id: String(SALES.length + 1),
    bill_number: `BILL-${String(SALES.length + 1).padStart(3, '0')}`,
    date: new Date().toISOString(),
    customer_name: customer_name || 'Walk-in',
    total_amount: total,
    paid_amount: payment_mode === 'CREDIT' ? 0 : total,
    credit_amount: payment_mode === 'CREDIT' ? total : 0,
    payment_mode,
    items_count: items.length
  };
  SALES.push(newSale);
  res.status(201).json({ status: 'success', message: 'Sale created', message_hindi: 'बिक्री रिकॉर्ड की गई', data: { sale: newSale } });
});

// Customers - Get all
app.get('/api/v1/customers', (req, res) => {
  res.json({
    status: 'success',
    data: {
      customers: CUSTOMERS,
      summary: {
        total_customers: CUSTOMERS.length,
        total_outstanding: CUSTOMERS.reduce((sum, c) => sum + c.total_outstanding, 0),
        overdue_customers: CUSTOMERS.filter(c => c.days_overdue > 15).length
      }
    }
  });
});

// Reports - Daily Sales
app.get('/api/v1/reports/daily-sales', (req, res) => {
  const todaySales = SALES.filter(s => new Date(s.date).toDateString() === new Date().toDateString());
  res.json({
    status: 'success',
    message: 'Daily sales report',
    message_hindi: 'दैनिक बिक्री रिपोर्ट',
    data: {
      date: new Date().toISOString().split('T')[0],
      total_sales: SALES.reduce((sum, s) => sum + s.total_amount, 0),
      total_bills: SALES.length,
      cash_sales: SALES.filter(s => s.payment_mode === 'CASH').reduce((sum, s) => sum + s.paid_amount, 0),
      credit_sales: SALES.reduce((sum, s) => sum + s.credit_amount, 0),
      top_products: PRODUCTS.slice(0, 5).map(p => ({ name: p.name_hindi, quantity_sold: Math.floor(Math.random() * 20) + 5 }))
    }
  });
});

// Reports - Profit Analysis
app.get('/api/v1/reports/profit-analysis', (req, res) => {
  const totalRevenue = 345200;
  const totalCost = 298400;
  res.json({
    status: 'success',
    message: 'Profit analysis',
    message_hindi: 'मुनाफा विश्लेषण',
    data: {
      total_revenue: totalRevenue,
      total_cost: totalCost,
      gross_profit: totalRevenue - totalCost,
      gross_margin_percent: ((totalRevenue - totalCost) / totalRevenue * 100).toFixed(2),
      category_wise: [
        { category: 'व्यक्तिगत देखभाल', margin: 22, revenue: 54300 },
        { category: 'घर की देखभाल', margin: 18, revenue: 38200 },
        { category: 'पैक खाद्य', margin: 12, revenue: 76200 },
        { category: 'अनाज', margin: 4, revenue: 98400 }
      ],
      recommendations: [
        'व्यक्तिगत देखभाल में ज्यादा स्टॉक रखें - सबसे ज्यादा मार्जिन',
        'अनाज पर मार्जिन बढ़ाएं या volume बढ़ाएं'
      ]
    }
  });
});

// Reports - Seasonal Insights
app.get('/api/v1/reports/seasonal-insights', (req, res) => {
  res.json({
    status: 'success',
    message: 'Seasonal insights',
    message_hindi: 'मौसमी जानकारी',
    data: {
      upcoming_festival: {
        name: 'होली',
        date: '2024-03-25',
        days_away: 42,
        recommendations: [
          { product: 'नमकीन', current_stock: 25, recommended: 75, increase: '200%' },
          { product: 'कोल्ड ड्रिंक', current_stock: 48, recommended: 96, increase: '100%' },
          { product: 'गुलाल/रंग', current_stock: 0, recommended: 100, increase: 'नया' }
        ]
      },
      seasonal_trends: {
        गर्मी: { 'कोल्ड ड्रिंक': '+120%', 'आइसक्रीम': '+200%' },
        सर्दी: { 'चाय': '+80%', 'कॉफी': '+60%' },
        बरसात: { 'स्नैक्स': '+40%', 'छाता': '+300%' }
      }
    }
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Endpoint not found', message_hindi: 'यह endpoint नहीं मिला' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ status: 'error', message: 'Internal server error', message_hindi: 'सर्वर में समस्या' });
});

// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║     मुंशी जी API चालू हो गया है! | Munshi Ji Running!     ║
║                     Port: ${PORT}                               ║
╚════════════════════════════════════════════════════════════╝
  `);
});
```

Click **"Commit changes"**

---

## Step 3: Deploy on Render.com (3 minutes)

1. Go to: **https://render.com**
2. Click **"Get Started"** → Sign up with GitHub
3. After login, click **"New +"** → **"Web Service"**
4. Click **"Connect account"** (to connect GitHub)
5. Find and select your `munshiji-api` repository
6. Fill in:
   - **Name:** `munshiji-api` (or any name)
   - **Region:** Singapore
   - **Branch:** main
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
7. Click **"Create Web Service"**

---

## ⏱️ Wait 3-5 Minutes

Render will:
- ✅ Clone your code
- ✅ Install dependencies
- ✅ Start the server
- ✅ Give you a URL

---

## 🎉 YOUR API IS LIVE!

You'll get a URL like:
```
https://munshiji-api-xxxx.onrender.com
