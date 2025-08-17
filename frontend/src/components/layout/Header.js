import React, { useState } from 'react';
import './Header.css';
import { FaSearch, FaUser, FaHeart, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import AuthPopup from '../../components/auth/AuthPopup';
import { useAuth } from '../AuthContext';
import Cart from '../../pages/shop/Cart';

// Import API gọi lấy giỏ hàng, update quantity và xóa sản phẩm
import { fetchCartByUserId, updateCartItemQuantity, removeCartItem } from '../../services/api';

function Header() {
    const [showAuthPopup, setShowAuthPopup] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItems, setCartItems] = useState([]); // state chứa sản phẩm trong giỏ
    const { user, logout } = useAuth();

    const handleCartClick = async () => {
        if (!user) {
            setShowAuthPopup(true);
            return;
        }
        try {
            // Gọi API lấy giỏ hàng theo userId
            const response = await fetchCartByUserId(user.UserID);
            const data = response.data;
            // Format lại dữ liệu và thêm cartItemId để dùng xóa sản phẩm
            const formattedItems = data.map(item => ({
                cartItemId: item.CartItemID,  // Thêm để xử lý xóa
                id: item.ProductID,
                name: item.ProductName,
                price: item.Price,
                quantity: item.Quantity,
                image: item.ImageURL,
                color: 'Default',
            }));
            setCartItems(formattedItems);
            setIsCartOpen(true);
        } catch (error) {
            console.error('Failed to fetch cart items:', error);
        }
    };

    // Hàm xử lý update số lượng trong giỏ
    const handleUpdateQty = async (productId, newQty) => {
        if (newQty < 1) return; // Không cho số lượng < 1
        try {
            await updateCartItemQuantity(user.UserID, productId, newQty);
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item.id === productId ? { ...item, quantity: newQty } : item
                )
            );
        } catch (error) {
            console.error('Failed to update cart item quantity:', error);
        }
    };

    // Xử lý xóa sản phẩm khỏi giỏ
    const handleRemoveItem = async (cartItemId) => {
        try {
            await removeCartItem(cartItemId);
            setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
        } catch (error) {
            console.error('Failed to remove item from cart:', error);
        }
    };

    return (
        <header className="shop-header">
            <div className="logo">DINOSHOP</div>

            <nav className="nav-links">
                <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
                    Home
                </NavLink>
                <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Shop
                </NavLink>
                <NavLink
                    to="/product"
                    onClick={(e) => e.preventDefault()}
                    className={({ isActive }) => (isActive ? 'active' : '')}
                >
                    Product
                </NavLink>
            </nav>

            <div className="header-icons">
                <FaSearch className="icon" />
                <FaHeart className="icon" />
                <FaShoppingCart className="icon" onClick={handleCartClick} />

                {user ? (
                    <div className="user-info">
                        <span className="username">{user.FullName}</span>
                        <FaSignOutAlt
                            className="icon logout-icon"
                            onClick={logout}
                            title="Đăng xuất"
                        />
                    </div>
                ) : (
                    <FaUser className="icon" onClick={() => setShowAuthPopup(true)} />
                )}
            </div>

            {/* Popup login */}
            {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}

            {/* Popup cart */}
            <Cart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onUpdateQty={handleUpdateQty}
                onRemoveItem={handleRemoveItem} // Thêm prop để xóa sản phẩm
            />
        </header>
    );
}

export default Header;
