import React, { useEffect, useState } from "react";
import axios from "axios";
import "./SupplierManager.css";

const API_URL = "http://localhost:5000/api/suppliers";

const SupplierManager = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({
        SupplierName: "",
        ContactName: "",
        Phone: "",
        Address: ""
    });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const fetchSuppliers = async () => {
        try {
            const res = await axios.get(API_URL);
            setSuppliers(res.data);
        } catch (err) {
            console.error("Lỗi load suppliers:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        if (!form.SupplierName.trim()) {
            errors.SupplierName = "Vui lòng nhập tên nhà cung cấp.";
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
                alert("Thêm thành công!");
            }
            resetForm();
            fetchSuppliers();
        } catch (err) {
            console.error("Lỗi lưu:", err);
        }
    };

    const handleEdit = (sup) => {
        setForm({
            SupplierName: sup.SupplierName,
            ContactName: sup.ContactName,
            Phone: sup.Phone,
            Address: sup.Address
        });
        setEditingId(sup.SupplierID);
        setFormErrors({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa supplier này?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Đã xóa!");
            fetchSuppliers();
        } catch (err) {
            console.error("Lỗi xóa:", err);
        }
    };

    const resetForm = () => {
        setForm({ SupplierName: "", ContactName: "", Phone: "", Address: "" });
        setEditingId(null);
        setFormErrors({});
    };

    return (
        <div className="supplier-manager">
            <h2>Quản lý Nhà cung cấp</h2>

            <form onSubmit={handleSubmit} className="supplier-form">
                <input
                    type="text"
                    name="SupplierName"
                    placeholder="Tên nhà cung cấp"
                    value={form.SupplierName}
                    onChange={handleChange}
                />
                {formErrors.SupplierName && <div className="error">{formErrors.SupplierName}</div>}

                <input
                    type="text"
                    name="ContactName"
                    placeholder="Người liên hệ"
                    value={form.ContactName}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="Phone"
                    placeholder="Số điện thoại"
                    value={form.Phone}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="Address"
                    placeholder="Địa chỉ"
                    value={form.Address}
                    onChange={handleChange}
                />

                <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                {editingId && (
                    <button type="button" className="cancel-btn" onClick={resetForm}>
                        Hủy
                    </button>
                )}
            </form>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Người liên hệ</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((sup) => (
                        <tr key={sup.SupplierID}>
                            <td>{sup.SupplierID}</td>
                            <td>{sup.SupplierName}</td>
                            <td>{sup.ContactName}</td>
                            <td>{sup.Phone}</td>
                            <td>{sup.Address}</td>
                            <td>
                                <button onClick={() => handleEdit(sup)}>Sửa</button>
                                <button className="delete-btn" onClick={() => handleDelete(sup.SupplierID)}>
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

export default SupplierManager;
