import React from "react";
import { NavLink } from "react-router-dom";
import { MdDashboard, MdCategory, MdInventory } from "react-icons/md";
import { FaUser, FaBox, FaFileInvoiceDollar, FaTruck } from "react-icons/fa";
import "./AdminSidebar.css";

function AdminSidebar() {
    return (
        <aside className="sidebar">
            <div className="logo">DinoShop</div>
            <nav>
                <NavLink to="/admin/dashboard"><MdDashboard className="icon" /> Dashboard</NavLink>
                <NavLink to="/admin/users"><FaUser className="icon" /> User</NavLink>
                <NavLink to="/admin/products"><FaBox className="icon" /> Product</NavLink>
                <NavLink to="/admin/categories"><MdCategory className="icon" /> Category</NavLink>
                <NavLink to="/admin/suppliers"><FaTruck className="icon" /> Supplier</NavLink>
                <NavLink to="/admin/inventory"><MdInventory className="icon" /> Inventory</NavLink>
                <NavLink to="/admin/invoices"><FaFileInvoiceDollar className="icon" /> Invoice</NavLink>
            </nav>
        </aside>
    );
}

export default AdminSidebar;
