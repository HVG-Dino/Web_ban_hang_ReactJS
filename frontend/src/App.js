import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Shop from './pages/shop/Shop';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Dashboard from './pages/admin/Dashboard';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminProducts from './pages/admin/AdminProducts';
import Login from './components/auth/AuthPopup';
import Users from './pages/admin/Users';
import CategoryManager from './pages/admin/CategoryManager';
import SupplierManager from './pages/admin/SupplierManager';
import InventoryLogManager from './pages/admin/InventoryLogManager';
import AdminLayout from './pages/admin/AdminLayout';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/shop/Home';

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Layout khách hàng */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<Login />} />
        </Route>

        {/* ✅ Layout admin */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<CategoryManager />} />
          <Route path="suppliers" element={<SupplierManager />} />
          <Route path="inventory" element={<InventoryLogManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
