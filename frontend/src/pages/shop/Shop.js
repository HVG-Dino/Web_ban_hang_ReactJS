import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Shop.css';
import { FaSearch, FaUser, FaHeart, FaShoppingCart } from 'react-icons/fa';
import AuthPopup from '../../components/auth/AuthPopup';

function Shop() {
    const [products, setProducts] = useState([]);
    const [showAuthPopup, setShowAuthPopup] = useState(false);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="shop-container">
            {/* Header */}
            <header className="shop-header">
                <div className="logo">DINOSHOP</div>

                <nav className="nav-links">
                    <a href="/">Home</a>
                    <a href="/shop">Shop</a>
                    <a href="/products">Products</a>
                </nav>

                <div className="header-icons">
                    <FaSearch className="icon" />
                    <FaUser
                        className="icon"
                        onClick={() => setShowAuthPopup(true)}
                    />
                    <FaHeart className="icon" />
                    <FaShoppingCart className="icon" />
                </div>
            </header>

            {/* Danh sách sản phẩm */}
            <div className="product-grid">
                {products.map(prod => (
                    <div key={prod.ProductID} className="product-card">
                        <div className="product-image">
                            <img
                                src={`/images/${prod.ImageURL}`}
                                alt={prod.ProductName}
                            />
                        </div>
                        <h3 className="product-title">{prod.ProductName}</h3>
                        <p className="product-price">${prod.Price}</p>
                    </div>
                ))}
            </div>

            {/* Popup đăng nhập */}
            {showAuthPopup && (
                <AuthPopup onClose={() => setShowAuthPopup(false)} />
            )}
        </div>
    );
}

export default Shop;
