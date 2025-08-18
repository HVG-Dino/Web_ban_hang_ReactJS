import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminProducts.css";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        ProductName: "",
        CategoryID: "",
        SupplierID: "",
        Price: "",
        Stock: "",
        Description: "",
        ImageURL: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        api.get("/admin/products")
            .then(res => setProducts(res.data))
            .catch(err => console.error("Lỗi khi load sản phẩm:", err));
    };

    const resetForm = () => {
        setForm({
            ProductName: "",
            CategoryID: "",
            SupplierID: "",
            Price: "",
            Stock: "",
            Description: "",
            ImageURL: ""
        });
        setFormErrors({});
        setEditingId(null);
    };

    const validateForm = () => {
        const errors = {};
        if (!form.ProductName.trim()) errors.ProductName = "Vui lòng nhập tên sản phẩm.";
        if (!form.CategoryID || isNaN(form.CategoryID)) errors.CategoryID = "Category ID phải là số.";
        if (!form.SupplierID || isNaN(form.SupplierID)) errors.SupplierID = "Supplier ID phải là số.";
        if (!form.Price || isNaN(form.Price) || parseFloat(form.Price) <= 0) errors.Price = "Giá không hợp lệ.";
        if (!form.Stock || isNaN(form.Stock) || parseInt(form.Stock) < 0) errors.Stock = "Số lượng không hợp lệ.";
        if (!form.Description.trim()) errors.Description = "Vui lòng nhập mô tả.";
        return errors;
    };

    const handleSubmit = () => {
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const payload = {
            ...form,
            CategoryID: parseInt(form.CategoryID),
            SupplierID: parseInt(form.SupplierID),
            Price: parseFloat(form.Price),
            Stock: parseInt(form.Stock),
            ImageURL: form.ImageURL || ""
        };

        if (editingId) {
            api.put(`/admin/products/${editingId}`, payload)
                .then(() => {
                    fetchProducts();
                    resetForm();
                })
                .catch(err => console.error("PUT lỗi:", err.response?.data || err.message));
        } else {
            api.post("/admin/products", payload)
                .then(() => {
                    fetchProducts();
                    resetForm();
                })
                .catch(err => console.error("POST lỗi:", err.response?.data || err.message));
        }
    };

    const handleEdit = (product) => {
        setForm({
            ProductName: product.ProductName,
            CategoryID: product.CategoryID,
            SupplierID: product.SupplierID || "",
            Price: product.Price,
            Stock: product.Stock,
            Description: product.Description,
            ImageURL: product.ImageURL || ""
        });
        setEditingId(product.ProductID);
        setFormErrors({});
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            api.delete(`/admin/products/${id}`)
                .then(fetchProducts)
                .catch(err => console.error("DELETE lỗi:", err.response?.data || err.message));
        }
    };

    return (
        <div className="admin-products">
            <h2>Quản lý Products</h2>

            <div className="form-container">
                <input
                    placeholder="Tên sản phẩm"
                    value={form.ProductName}
                    onChange={e => setForm({ ...form, ProductName: e.target.value })}
                />
                {formErrors.ProductName && <div className="error">{formErrors.ProductName}</div>}

                <input
                    placeholder="Category ID"
                    type="number"
                    value={form.CategoryID}
                    onChange={e => setForm({ ...form, CategoryID: e.target.value })}
                />
                {formErrors.CategoryID && <div className="error">{formErrors.CategoryID}</div>}

                <input
                    placeholder="Supplier ID"
                    type="number"
                    value={form.SupplierID}
                    onChange={e => setForm({ ...form, SupplierID: e.target.value })}
                />
                {formErrors.SupplierID && <div className="error">{formErrors.SupplierID}</div>}

                <input
                    placeholder="Giá"
                    type="number"
                    value={form.Price}
                    onChange={e => setForm({ ...form, Price: e.target.value })}
                />
                {formErrors.Price && <div className="error">{formErrors.Price}</div>}

                <input
                    placeholder="Số lượng"
                    type="number"
                    value={form.Stock}
                    onChange={e => setForm({ ...form, Stock: e.target.value })}
                />
                {formErrors.Stock && <div className="error">{formErrors.Stock}</div>}

                <input
                    placeholder="Mô tả"
                    value={form.Description}
                    onChange={e => setForm({ ...form, Description: e.target.value })}
                />
                {formErrors.Description && <div className="error">{formErrors.Description}</div>}

                <input
                    placeholder="Image URL"
                    value={form.ImageURL}
                    onChange={e => setForm({ ...form, ImageURL: e.target.value })}
                />

                <button onClick={handleSubmit}>
                    {editingId ? "Cập nhật" : "Thêm"}
                </button>
                {editingId && (
                    <button onClick={resetForm} style={{ marginLeft: "10px", backgroundColor: "#6c757d" }}>
                        Hủy
                    </button>
                )}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Category ID</th>
                        <th>Supplier ID</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Mô tả</th>
                        <th>Image URL</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.ProductID}>
                            <td>{p.ProductID}</td>
                            <td>{p.ProductName}</td>
                            <td>{p.CategoryID}</td>
                            <td>{p.SupplierID}</td>
                            <td>{p.Price}</td>
                            <td>{p.Stock}</td>
                            <td>{p.Description}</td>
                            <td>{p.ImageURL}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>Sửa</button>
                                <button onClick={() => handleDelete(p.ProductID)} className="delete-btn">Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProducts;
