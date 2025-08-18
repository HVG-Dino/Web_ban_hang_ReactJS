import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Checkout.css";

function Checkout() {
    const [cartItems, setCartItems] = useState([]);
    const userId = 1; // sau này thay bằng user login
    const [subtotal, setSubtotal] = useState(0);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
            setCartItems(res.data);

            const total = res.data.reduce(
                (sum, item) => sum + item.Price * item.Quantity,
                0
            );
            setSubtotal(total);
        } catch (err) {
            console.error("Error fetching cart:", err);
        }
    };

    const handlePayPalPayment = () => {
        alert("Chuyển sang PayPal Checkout (demo)");
        // Thực tế: tích hợp PayPal SDK
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>

            <div className="checkout-content">
                {/* Thông tin khách hàng */}
                <div className="checkout-form">
                    <h2>Billing Details</h2>
                    <form>
                        <label>Full Name</label>
                        <input type="text" placeholder="Your name" required />

                        <label>Email</label>
                        <input type="email" placeholder="Your email" required />

                        <label>Address</label>
                        <input type="text" placeholder="Street address" required />

                        <label>City</label>
                        <input type="text" placeholder="City" required />

                        <label>Zip Code</label>
                        <input type="text" placeholder="Zip code" required />

                        <label>Country</label>
                        <input type="text" placeholder="Country" required />
                    </form>
                </div>

                {/* Tóm tắt đơn hàng */}
                <div className="checkout-summary">
                    <h2>Your Order</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cartItems.map((item) => (
                                <tr key={item.CartItemID}>
                                    <td>
                                        {item.ProductName} × {item.Quantity}
                                    </td>
                                    <td>${(item.Price * item.Quantity).toFixed(2)}</td>
                                </tr>
                            ))}
                            <tr>
                                <td>
                                    <b>Subtotal</b>
                                </td>
                                <td>
                                    <b>${subtotal.toFixed(2)}</b>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Shipping</b>
                                </td>
                                <td>Free</td>
                            </tr>
                            <tr>
                                <td>
                                    <b>Total</b>
                                </td>
                                <td>
                                    <b>${subtotal.toFixed(2)}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="payment-method">
                        <h3>Payment Method</h3>
                        <button className="paypal-btn" onClick={handlePayPalPayment}>
                            Pay with PayPal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
