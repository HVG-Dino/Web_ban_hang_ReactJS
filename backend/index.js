const express = require('express');
const cors = require('cors');

require('./config/db'); // kết nối DB

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin/users', require('./routes/adminUsers'));

const productRoutes = require('./routes/productRoutes');
app.use('/api/admin/products', productRoutes);

const categoryRoutes = require('./routes/categories');
app.use('/api/categories', categoryRoutes);

const supplierRoutes = require('./routes/supplierRoutes');
app.use('/api/suppliers', supplierRoutes);

const inventoryLogRoutes = require('./routes/inventoryLogRoutes');
app.use('/api/inventory-logs', inventoryLogRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoiceRoutes);


app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth')); // 👈 thêm auth

app.listen(5000, () => console.log('🚀 Server chạy port 5000'));
