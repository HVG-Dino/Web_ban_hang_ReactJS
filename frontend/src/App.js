import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Shop from './pages/shop/Shop';
import ProductDetail from './pages/shop/ProductDetail';
import Cart from './pages/shop/Cart';
import Dashboard from './pages/admin/Dashboard';
import InvoiceList from './pages/admin/InvoiceList';
import AdminProducts from './pages/admin/AdminProducts';
import Login from './components/auth/AuthPopup';
import Users from './pages/admin/Users';
import Categories from './pages/admin/Categories';
import Suppliers from './pages/admin/Suppliers';
import Inventory from './pages/admin/Inventory';
import AdminLayout from './pages/admin/AdminLayout';

function App() {
  return (
    <Router>
      <Routes>
        {/* Trang khách hàng */}
        <Route path="/" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} /> {/* ✅ thêm route login */}



        {/* Admin Layout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="inventory" element={<Inventory />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;
