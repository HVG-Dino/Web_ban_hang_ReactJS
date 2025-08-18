import React, { useEffect, useState } from "react";
import axios from "axios";
import "./CategoryManager.css";

const API_URL = "http://localhost:5000/api/categories";

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({ CategoryName: "", Description: "" });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await axios.get(API_URL);
            setCategories(res.data);
        } catch (err) {
            console.error("Lỗi tải danh mục:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        if (!form.CategoryName.trim()) {
            errors.CategoryName = "Vui lòng nhập tên danh mục.";
        }
        if (!form.Description.trim()) {
            errors.Description = "Vui lòng nhập mô tả.";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, form);
                alert("Cập nhật thành công!");
            } else {
                await axios.post(API_URL, form);
                alert("Thêm danh mục thành công!");
            }
            resetForm();
            fetchCategories();
        } catch (err) {
            console.error("Lỗi lưu danh mục:", err);
        }
    };

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

    const handleEdit = (category) => {
        setForm({ CategoryName: category.CategoryName, Description: category.Description });
        setEditingId(category.CategoryID);
        setFormErrors({});
    };

    const resetForm = () => {
        setForm({ CategoryName: "", Description: "" });
        setEditingId(null);
        setFormErrors({});
    };

    return (
        <div className="category-manager">
            <h2>Quản lý Danh mục</h2>

            <form onSubmit={handleSubmit} className="category-form">
                <input
                    type="text"
                    name="CategoryName"
                    placeholder="Tên danh mục"
                    value={form.CategoryName}
                    onChange={handleChange}
                />
                {formErrors.CategoryName && <div className="error">{formErrors.CategoryName}</div>}

                <input
                    type="text"
                    name="Description"
                    placeholder="Mô tả"
                    value={form.Description}
                    onChange={handleChange}
                />
                {formErrors.Description && <div className="error">{formErrors.Description}</div>}

                <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                {editingId && (
                    <button type="button" onClick={resetForm} className="cancel-btn">
                        Hủy
                    </button>
                )}
            </form>

            <table>
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
                                <button onClick={() => handleDelete(cat.CategoryID)} className="delete-btn">
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
