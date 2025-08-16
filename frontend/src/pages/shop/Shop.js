import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Shop.css';

function Shop() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="shop-grid">
            {/* Cột 1 trống */}
            <div className="col-empty"></div>

            {/* Cột 2: filter */}
            <div className="col-filter">
                <div className="filters">
                    <div className="filter-section">
                        <h4>Danh mục</h4>
                        <button className="filter-btn">Tất cả</button>
                        <button className="filter-btn">Áo</button>
                        <button className="filter-btn">Quần</button>
                    </div>
                </div>
            </div>

            {/* Cột 3-5: sản phẩm */}
            <div className="col-products">
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
            </div>

            {/* Cột 6 trống */}
            <div className="col-empty"></div>
        </div>
    );
}

export default Shop;
