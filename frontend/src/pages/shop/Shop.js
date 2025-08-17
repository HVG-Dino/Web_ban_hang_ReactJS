import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Shop.css';
import { useNavigate } from 'react-router-dom';
function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const navigate = useNavigate();

    // Filters state: lưu ID
    const [selectedCategoryID, setSelectedCategoryID] = useState('');
    const [selectedSupplierID, setSelectedSupplierID] = useState('');
    const [selectedPrice, setSelectedPrice] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes, supRes] = await Promise.all([
                    api.get('/products'),
                    api.get('/categories'),
                    api.get('/suppliers_shop')
                ]);

                // Mảng category và supplier
                setCategories(catRes.data);
                setSuppliers(supRes.data);

                // Map ID -> Name cho product để hiển thị
                const categoriesMap = {};
                catRes.data.forEach(c => categoriesMap[c.CategoryID] = c.CategoryName);

                const suppliersMap = {};
                supRes.data.forEach(s => suppliersMap[s.SupplierID] = s.SupplierName);

                const productsWithName = prodRes.data.map(p => ({
                    ...p,
                    CategoryName: categoriesMap[p.CategoryID] || '',
                    SupplierName: suppliersMap[p.SupplierID] || ''
                }));

                setProducts(productsWithName);
                setFilteredProducts(productsWithName);
            } catch (err) {
                console.error(err);
            }
        };

        fetchData();
    }, []);

    // Filter products khi chọn filter
    useEffect(() => {
        let data = [...products];

        if (selectedCategoryID) data = data.filter(p => p.CategoryID === selectedCategoryID);
        if (selectedSupplierID) data = data.filter(p => p.SupplierID === selectedSupplierID);

        if (selectedPrice) {
            if (selectedPrice === 'low') data = data.filter(p => p.Price < 50);
            else if (selectedPrice === 'mid') data = data.filter(p => p.Price >= 50 && p.Price <= 200);
            else if (selectedPrice === 'high') data = data.filter(p => p.Price > 200);
        }

        setFilteredProducts(data);
    }, [selectedCategoryID, selectedSupplierID, selectedPrice, products]);

    // const getButtonClass = (selected, value) => selected === value ? 'filter-btn active' : 'filter-btn';

    return (
        <div className="shop-grid">
            <div className="col-empty"></div>

            {/* Filters */}
            <div className="col-filter">
                <h3 className="filter-title">Filters</h3>

                <div className="filter-section filter-price">
                    <h4>Prices</h4>
                    <div className="filter-items">
                        <span onClick={() => setSelectedPrice('')} className={selectedPrice === '' ? 'active' : ''}>All</span>
                        <span onClick={() => setSelectedPrice('low')} className={selectedPrice === 'low' ? 'active' : ''}>$0–$50</span>
                        <span onClick={() => setSelectedPrice('mid')} className={selectedPrice === 'mid' ? 'active' : ''}>$50–$200</span>
                        <span onClick={() => setSelectedPrice('high')} className={selectedPrice === 'high' ? 'active' : ''}>$200</span>
                    </div>
                </div>

                <div className="filter-section filter-category">
                    <h4>Categories</h4>
                    <div className="filter-items">
                        <span
                            onClick={() => setSelectedCategoryID('')}
                            className={selectedCategoryID === '' ? 'active' : ''}
                        >
                            All
                        </span>
                        {categories.map(cat => (
                            <span
                                key={cat.CategoryID}
                                onClick={() => setSelectedCategoryID(cat.CategoryID)}
                                className={selectedCategoryID === cat.CategoryID ? 'active' : ''}
                            >
                                {cat.CategoryName}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="filter-section filter-suppliers">
                    <h4>Suppliers</h4>
                    <div className="filter-items">
                        <span
                            onClick={() => setSelectedSupplierID('')}
                            className={selectedSupplierID === '' ? 'active' : ''}
                        >
                            All
                        </span>
                        {suppliers.map(sup => (
                            <span
                                key={sup.SupplierID}
                                onClick={() => setSelectedSupplierID(sup.SupplierID)}
                                className={selectedSupplierID === sup.SupplierID ? 'active' : ''}
                            >
                                {sup.SupplierName}
                            </span>
                        ))}
                    </div>
                </div>
            </div>


            {/* Products */}
            <div className="col-products">
                <div className="product-grid">
                    {filteredProducts.map(prod => (
                        <div key={prod.ProductID} className="product-card"
                            onClick={() => navigate(`/product/${prod.ProductID}`)} // <-- thêm onClick
                            style={{ cursor: 'pointer' }}>
                            <div className="product-image">
                                <img src={`/images/${prod.ImageURL}`} alt={prod.ProductName} />
                            </div>
                            <h3 className="product-title">{prod.ProductName}</h3>
                            <p className="product-price">${prod.Price}</p>
                            <p className="product-meta">{prod.CategoryName} | {prod.SupplierName}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-empty"></div>
        </div>
    );
}

export default Shop;
