import React, { useEffect, useState } from "react";
import axios from "axios";
import "./InventoryLogManager.css";

const API_URL = "http://localhost:5000/api/inventory-logs";

const InventoryLogManager = () => {
    const [logs, setLogs] = useState([]);
    const [form, setForm] = useState({
        ProductID: "",
        ChangeType: "Import",
        QuantityChange: 0,
        Note: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get(API_URL);
            setLogs(res.data);
        } catch (err) {
            console.error("Lỗi load logs:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errors = {};
        if (!form.ProductID) errors.ProductID = "Vui lòng nhập Product ID";
        if (!form.QuantityChange || Number(form.QuantityChange) <= 0)
            errors.QuantityChange = "Số lượng phải lớn hơn 0";
        return errors;
    };

    const resetForm = () => {
        setForm({
            ProductID: "",
            ChangeType: "Import",
            QuantityChange: 0,
            Note: "",
        });
        setEditingId(null);
        setFormErrors({});
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
                alert("Thêm mới thành công!");
            }
            resetForm();
            fetchLogs();
        } catch (err) {
            console.error("Lỗi lưu:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa log này?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            alert("Đã xóa!");
            fetchLogs();
        } catch (err) {
            console.error("Lỗi xóa:", err);
        }
    };

    const handleEdit = (log) => {
        setForm({
            ProductID: log.ProductID,
            ChangeType: log.ChangeType,
            QuantityChange: log.QuantityChange,
            Note: log.Note,
        });
        setEditingId(log.LogID);
        setFormErrors({});
    };

    return (
        <div className="inventory-log-manager">
            <h2>Quản lý Inventory Logs</h2>

            <form onSubmit={handleSubmit} className="inventory-form">
                <input
                    type="number"
                    name="ProductID"
                    placeholder="Product ID"
                    value={form.ProductID}
                    onChange={handleChange}
                />
                {formErrors.ProductID && <div className="error">{formErrors.ProductID}</div>}

                <select name="ChangeType" value={form.ChangeType} onChange={handleChange}>
                    <option value="Import">Import</option>
                    <option value="Export">Export</option>
                </select>

                <input
                    type="number"
                    name="QuantityChange"
                    placeholder="Số lượng thay đổi"
                    value={form.QuantityChange}
                    onChange={handleChange}
                />
                {formErrors.QuantityChange && <div className="error">{formErrors.QuantityChange}</div>}

                <input
                    type="text"
                    name="Note"
                    placeholder="Ghi chú"
                    value={form.Note}
                    onChange={handleChange}
                />

                <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                {editingId && (
                    <button type="button" className="cancel-btn" onClick={resetForm}>
                        Hủy
                    </button>
                )}
            </form>

            <table className="inventory-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product ID</th>
                        <th>Loại thay đổi</th>
                        <th>Số lượng</th>
                        <th>Ngày</th>
                        <th>Ghi chú</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <tr key={log.LogID}>
                            <td>{log.LogID}</td>
                            <td>{log.ProductID}</td>
                            <td>{log.ChangeType}</td>
                            <td>{log.QuantityChange}</td>
                            <td>{new Date(log.ChangeDate).toLocaleString()}</td>
                            <td>{log.Note}</td>
                            <td>
                                <button onClick={() => handleEdit(log)}>Sửa</button>
                                <button
                                    onClick={() => handleDelete(log.LogID)}
                                    className="delete-btn"
                                >
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

export default InventoryLogManager;
