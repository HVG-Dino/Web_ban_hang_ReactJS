import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        Name: "",
        Category: "",
        Price: "",
        Stock: "",
        Description: ""
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        api.get("/admin/products").then(res => setProducts(res.data));
    };

    const resetForm = () => {
        setForm({
            Name: "",
            Category: "",
            Price: "",
            Stock: "",
            Description: ""
        });
        setEditingId(null);
    };

    const handleSubmit = () => {
        if (editingId) {
            api.put(`/admin/products/${editingId}`, form).then(() => {
                fetchProducts();
                resetForm();
            });
        } else {
            api.post("/admin/products", form).then(() => {
                fetchProducts();
                resetForm();
            });
        }
    };

    const handleEdit = (product) => {
        setForm({
            Name: product.Name,
            Category: product.Category,
            Price: product.Price,
            Stock: product.Stock,
            Description: product.Description
        });
        setEditingId(product.ProductID);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
            api.delete(`/admin/products/${id}`).then(fetchProducts);
        }
    };

    return (
        <div>
            <h2>Quản lý Products</h2>
            <div>
                <input placeholder="Tên sản phẩm" value={form.Name} onChange={e => setForm({ ...form, Name: e.target.value })} />
                <input placeholder="Category" value={form.Category} onChange={e => setForm({ ...form, Category: e.target.value })} />
                <input placeholder="Giá" type="number" value={form.Price} onChange={e => setForm({ ...form, Price: e.target.value })} />
                <input placeholder="Số lượng" type="number" value={form.Stock} onChange={e => setForm({ ...form, Stock: e.target.value })} />
                <input placeholder="Mô tả" value={form.Description} onChange={e => setForm({ ...form, Description: e.target.value })} />
                <button onClick={handleSubmit}>{editingId ? "Cập nhật" : "Thêm"}</button>
            </div>

            <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Category</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(p => (
                        <tr key={p.ProductID}>
                            <td>{p.ProductID}</td>
                            <td>{p.Name}</td>
                            <td>{p.Category}</td>
                            <td>{p.Price}</td>
                            <td>{p.Stock}</td>
                            <td>{p.Description}</td>
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
