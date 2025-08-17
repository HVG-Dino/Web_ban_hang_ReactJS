import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import "./ProductDetail.css";
import payment from "../../images/payment-methods.png";
import { useAuth } from "../../components/AuthContext";
import AuthPopup from "../../components/auth/AuthPopup";   // ✅ import Popup

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { user } = useAuth();   // ✅ bỏ setShowLogin
    const [showAuthPopup, setShowAuthPopup] = useState(false);  // ✅ state local

    useEffect(() => {
        api.get(`/products/${id}`)
            .then(res => setProduct(res.data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) return <div>Loading...</div>;

    const handleAddToCart = () => {
        if (!user) {
            setShowAuthPopup(true);   // ✅ show popup login
            return;
        }

        // ✅ Nếu đã login thì gọi API add cart
        api.post("/cart/add", {
            userId: user?.id,
            productId: product.ProductID,
            quantity: quantity
        })
            .then(() => {
                alert("Added to cart!");
            })
            .catch(err => console.error(err));
    };

    return (
        <div className="product-detail-grid">
            <div className="col empty"></div>

            {/* Ảnh chiếm cột 2 + 3 */}
            <div className="col image">
                <img src={`/images/${product.ImageURL}`} alt={product.ProductName} />
            </div>

            {/* Thông tin chiếm cột 4 + 5 */}
            <div className="col info">
                <h2>{product.ProductName}</h2>
                <div className="rating">★★★★☆ <span>(3)</span></div>
                <p className="price">${product.Price}</p>

                <p className="stock">Only {product.Stock} item(s) left in stock!</p>
                <div className="stock-bar">
                    <div className="stock-fill" style={{ width: `${(product.Stock / 20) * 100}%` }}></div>
                </div>

                <div className="quantity">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                    <span>{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button className="add-to-cart" onClick={handleAddToCart}>
                    Add to Cart
                </button>

                <div className="delivery">
                    <p><strong>🚚 Estimated Delivery:</strong> Jul 30 - Aug 03</p>
                    <p><strong>✅ Free Shipping & Returns:</strong> On all orders over $75</p>
                </div>

                <div className="checkout">
                    <img src={payment} alt="Payments" />
                    <p>Guarantee safe & secure checkout</p>
                </div>
            </div>

            <div className="col empty"></div>

            {/* ✅ render popup login khi cần */}
            {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
        </div>
    );
}

export default ProductDetail;
