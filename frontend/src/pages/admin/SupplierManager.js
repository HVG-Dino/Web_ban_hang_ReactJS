import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/suppliers";

const SupplierManager = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({ SupplierName: "", ContactName: "", Phone: "", Address: "" });
    const [editingId, setEditingId] = useState(null);

    // Load data
    const fetchSuppliers = async () => {
        try {
            const res = await axios.get(API_URL);
            setSuppliers(res.data);
        } catch (err) {
            console.error("Lỗi load suppliers:", err);
        }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    // Form input
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit thêm/sửa
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, form);
                alert("Cập nhật thành công!");
            } else {
                await axios.post(API_URL, form);
                alert("Thêm thành công!");
            }
            setForm({ SupplierName: "", ContactName: "", Phone: "", Address: "" });
            setEditingId(null);
            fetchSuppliers();
        } catch (err) {
            console.error("Lỗi lưu:", err);
        }
    };

    // Xóa
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

    // Edit
    const handleEdit = (sup) => {
        setForm({
            SupplierName: sup.SupplierName,
            ContactName: sup.ContactName,
            Phone: sup.Phone,
            Address: sup.Address
        });
        setEditingId(sup.SupplierID);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý Nhà cung cấp</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input type="text" name="SupplierName" placeholder="Tên" value={form.SupplierName} onChange={handleChange} required />
                <input type="text" name="ContactName" placeholder="Người liên hệ" value={form.ContactName} onChange={handleChange} />
                <input type="text" name="Phone" placeholder="SĐT" value={form.Phone} onChange={handleChange} />
                <input type="text" name="Address" placeholder="Địa chỉ" value={form.Address} onChange={handleChange} />
                <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                {editingId && <button type="button" onClick={() => { setForm({ SupplierName: "", ContactName: "", Phone: "", Address: "" }); setEditingId(null); }}>Hủy</button>}
            </form>

            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                                <button onClick={() => handleDelete(sup.SupplierID)} style={{ marginLeft: "8px" }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SupplierManager;
