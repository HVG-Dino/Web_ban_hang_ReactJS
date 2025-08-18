import React from "react";
import "./Cart.css";
import { FaTimes, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Cart({ isOpen, onClose, cartItems, onUpdateQty, onRemoveItem }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="cart-overlay">
            <div className="cart">
                {/* Header */}
                <div className="cart-header">
                    <h2>Shopping Cart</h2>
                    <FaTimes className="close-btn" onClick={onClose} />
                </div>

                <p className="cart-free">
                    Buy <b>${Math.max(0, 75 - subtotal).toFixed(2)}</b> More And Get <b>Free Shipping</b>
                </p>

                {/* Items */}
                <div className="cart-items">
                    {cartItems.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        cartItems.map((item) => (
                            <div className="cart-item" key={item.id}>
                                <img src={`/images/${item.image}`} alt={item.name} />
                                <div className="item-info">
                                    <h4>{item.name}</h4>
                                    <p>Color: {item.color}</p>
                                    <p>${item.price.toFixed(2)}</p>
                                    <div className="qty-controls">
                                        <button onClick={() => onUpdateQty(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => onUpdateQty(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                </div>
                                {/* Nút xóa sản phẩm */}
                                <button
                                    className="remove-item-btn"
                                    onClick={() => onRemoveItem(item.cartItemId)}
                                    title="Remove item"
                                >
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Subtotal */}
                <div className="cart-footer">
                    <div className="subtotal">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="checkout-btn"
                        onClick={() => {
                            onClose(); // đóng popup giỏ hàng
                            navigate("/checkout");
                        }}
                    >
                        Checkout
                    </button>
                    <button
                        className="view-cart-btn"
                        onClick={() => {
                            onClose(); // đóng popup giỏ hàng
                            navigate("/view_cart");
                        }}
                    >
                        View Cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Cart;
