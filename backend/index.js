const express = require('express');
const cors = require('cors');

require('./config/db'); // kết nối DB

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth')); // 👈 thêm auth

app.listen(5000, () => console.log('🚀 Server chạy port 5000'));
