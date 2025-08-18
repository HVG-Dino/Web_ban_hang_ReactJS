// ViewCart.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function ViewCart({ cartItems, onUpdateQty, onRemoveItem }) {
    const navigate = useNavigate();

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <div className="view-cart-page">
            <h2>Your Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <div>
                    {cartItems.map((item) => (
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
                            <button
                                className="remove-item-btn"
                                onClick={() => onRemoveItem(item.id)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="cart-footer">
                <div className="subtotal">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                </div>
                <button
                    className="checkout-btn"
                    onClick={() => navigate("/checkout")}
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
}

export default ViewCart;
