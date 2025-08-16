import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/categories";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ CategoryName: "", Description: "" });
    const [editingId, setEditingId] = useState(null);

    // Lấy danh mục từ API
    const fetchCategories = async () => {
        try {
            const res = await axios.get(API_URL);
            setCategories(res.data);
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // Xử lý input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Thêm / Cập nhật
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, form);
                alert("Cập nhật thành công!");
            } else {
                await axios.post(API_URL, form);
                alert("Thêm danh mục thành công!");
            }
            setForm({ CategoryName: "", Description: "" });
            setEditingId(null);
            fetchCategories();
        } catch (err) {
            console.error("Lỗi lưu danh mục:", err);
        }
    };

    // Xóa danh mục
    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Xóa thành công!");
            fetchCategories();
        } catch (err) {
            console.error("Lỗi xóa:", err);
        }
    };

    // Chỉnh sửa
    const handleEdit = (category) => {
        setForm({ CategoryName: category.CategoryName, Description: category.Description });
        setEditingId(category.CategoryID);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý Danh mục</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    name="CategoryName"
                    placeholder="Tên danh mục"
                    value={form.CategoryName}
                    onChange={handleChange}
                    required
                    style={{ marginRight: "10px" }}
                />
                <input
                    type="text"
                    name="Description"
                    placeholder="Mô tả"
                    value={form.Description}
                    onChange={handleChange}
                    style={{ marginRight: "10px" }}
                />
                <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                {editingId && (
                    <button type="button" onClick={() => { setForm({ CategoryName: "", Description: "" }); setEditingId(null); }}>
                        Hủy
                    </button>
                )}
            </form>

            <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên danh mục</th>
                        <th>Mô tả</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {categories.map((cat) => (
                        <tr key={cat.CategoryID}>
                            <td>{cat.CategoryID}</td>
                            <td>{cat.CategoryName}</td>
                            <td>{cat.Description}</td>
                            <td>
                                <button onClick={() => handleEdit(cat)}>Sửa</button>
                                <button onClick={() => handleDelete(cat.CategoryID)} style={{ marginLeft: "10px" }}>
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CategoryManager;
