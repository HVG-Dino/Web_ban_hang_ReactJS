import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/inventory-logs";

const InventoryLogManager = () => {
    const [logs, setLogs] = useState([]);
    const [form, setForm] = useState({
        ProductID: "",
        ChangeType: "Import",
        QuantityChange: 0,
        Note: "",
    });
    const [editingId, setEditingId] = useState(null);

    // Load data
    const fetchLogs = async () => {
        try {
            const res = await axios.get(API_URL);
            setLogs(res.data);
        } catch (err) {
            console.error("Lỗi load logs:", err);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
            setForm({ ProductID: "", ChangeType: "Import", QuantityChange: 0, Note: "" });
            setEditingId(null);
            fetchLogs();
        } catch (err) {
            console.error("Lỗi lưu:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Xóa log này?")) return;
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
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý Inventory Logs</h2>

            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input type="number" name="ProductID" placeholder="Product ID" value={form.ProductID} onChange={handleChange} required />
                <select name="ChangeType" value={form.ChangeType} onChange={handleChange}>
                    <option value="Import">Import</option>
                    <option value="Export">Export</option>
                </select>
                <input type="number" name="QuantityChange" placeholder="Số lượng" value={form.QuantityChange} onChange={handleChange} />
                <input type="text" name="Note" placeholder="Ghi chú" value={form.Note} onChange={handleChange} />
                <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                {editingId && <button type="button" onClick={() => { setForm({ ProductID: "", ChangeType: "Import", QuantityChange: 0, Note: "" }); setEditingId(null); }}>Hủy</button>}
            </form>

            <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>ProductID</th>
                        <th>ChangeType</th>
                        <th>Số lượng</th>
                        <th>Ngày thay đổi</th>
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
                                <button onClick={() => handleDelete(log.LogID)} style={{ marginLeft: "8px" }}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryLogManager;
