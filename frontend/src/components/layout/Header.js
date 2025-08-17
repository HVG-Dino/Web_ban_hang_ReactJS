import React, { useState } from 'react';
import './Header.css';
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';  // ✅ dùng NavLink để highlight link đang active
import AuthPopup from '../../components/auth/AuthPopup';

function Header() {
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    return (
        <header className="shop-header">
            <div className="logo">DINOSHOP</div>

            <nav className="nav-links">
                <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
                    Home
                </NavLink>
                <NavLink to="/shop" className={({ isActive }) => isActive ? "active" : ""}>
                    Shop
                </NavLink>
                <NavLink
                    to="/product"
                    onClick={(e) => e.preventDefault()}  // ngăn điều hướng
                    className={({ isActive }) => isActive ? "active" : ""}
                >
                    Product
                </NavLink>


                {/* <NavLink to="/product" className={({ isActive }) => isActive ? "active" : ""}>
                    Product
                </NavLink> */}
            </nav>

            <div className="header-icons">
                <FaSearch className="icon" />
                <FaUser className="icon" onClick={() => setShowAuthPopup(true)} />
                <FaHeart className="icon" />
                <FaShoppingCart className="icon" />
            </div>

            {showAuthPopup && (
                <AuthPopup onClose={() => setShowAuthPopup(false)} />
            )}
        </header>
    );
}

export default Header;
