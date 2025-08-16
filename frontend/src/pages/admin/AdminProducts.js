import React, { useEffect, useState } from "react";
import api from "../../services/api";

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
    const [editingId, setEditingId] = useState(null);

    // Lấy dữ liệu ban đầu
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
        setEditingId(null);
    };

    const handleSubmit = () => {
        // Ép kiểu dữ liệu trước khi gửi
        const payload = {
            ...form,
            CategoryID: parseInt(form.CategoryID) || 0,
            SupplierID: parseInt(form.SupplierID) || 0,
            Price: parseFloat(form.Price) || 0,
            Stock: parseInt(form.Stock) || 0,
            ImageURL: form.ImageURL || ""
        };

        console.log("Dữ liệu gửi lên:", payload);

        if (editingId) {
            api.put(`/admin/products/${editingId}`, payload)
                .then(() => {
                    fetchProducts();
                    resetForm();
                })
                .catch(err => {
                    console.error("PUT lỗi:", err.response?.data || err.message);
                });
        } else {
            api.post("/admin/products", payload)
                .then(() => {
                    fetchProducts();
                    resetForm();
                })
                .catch(err => {
                    console.error("POST lỗi:", err.response?.data || err.message);
                });
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
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            api.delete(`/admin/products/${id}`)
                .then(fetchProducts)
                .catch(err => {
                    console.error("DELETE lỗi:", err.response?.data || err.message);
                });
        }
    };

    return (
        <div>
            <h2>Quản lý Products</h2>

            <div style={{ marginBottom: "20px" }}>
                <input
                    placeholder="Tên sản phẩm"
                    value={form.ProductName}
                    onChange={e => setForm({ ...form, ProductName: e.target.value })}
                />
                <input
                    placeholder="Category ID"
                    type="number"
                    value={form.CategoryID}
                    onChange={e => setForm({ ...form, CategoryID: e.target.value })}
                />
                <input
                    placeholder="Supplier ID"
                    type="number"
                    value={form.SupplierID}
                    onChange={e => setForm({ ...form, SupplierID: e.target.value })}
                />
                <input
                    placeholder="Giá"
                    type="number"
                    value={form.Price}
                    onChange={e => setForm({ ...form, Price: e.target.value })}
                />
                <input
                    placeholder="Số lượng"
                    type="number"
                    value={form.Stock}
                    onChange={e => setForm({ ...form, Stock: e.target.value })}
                />
                <input
                    placeholder="Mô tả"
                    value={form.Description}
                    onChange={e => setForm({ ...form, Description: e.target.value })}
                />
                <input
                    placeholder="Image URL"
                    value={form.ImageURL}
                    onChange={e => setForm({ ...form, ImageURL: e.target.value })}
                />

                <button onClick={handleSubmit}>
                    {editingId ? "Cập nhật" : "Thêm"}
                </button>
                {editingId && (
                    <button onClick={resetForm} style={{ marginLeft: "10px" }}>
                        Hủy
                    </button>
                )}
            </div>

            <table border="1" cellPadding="8">
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
                                <button onClick={() => handleDelete(p.ProductID)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminProducts;
