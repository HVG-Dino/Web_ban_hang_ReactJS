import React, { useEffect, useState } from "react";
import api from "../../services/api";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({ FullName: "", Email: "", Role: "customer", Phone: "", Address: "" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        api.get("/admin/users").then(res => setUsers(res.data));
    };

    const handleSubmit = () => {
        if (editingId) {
            api.put(`/admin/users/${editingId}`, form).then(() => {
                fetchUsers();
                setForm({ FullName: "", Email: "", Role: "customer", Phone: "", Address: "" });
                setEditingId(null);
            });
        } else {
            api.post("/admin/users", { ...form, PasswordHash: "123456" }).then(() => {
                fetchUsers();
                setForm({ FullName: "", Email: "", Role: "customer", Phone: "", Address: "" });
            });
        }
    };

    const handleEdit = (user) => {
        setForm(user);
        setEditingId(user.UserID);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa?")) {
            api.delete(`/admin/users/${id}`).then(fetchUsers);
        }
    };

    return (
        <div>
            <h2>Quản lý Users</h2>
            <div>
                <input placeholder="Full Name" value={form.FullName} onChange={e => setForm({ ...form, FullName: e.target.value })} />
                <input placeholder="Email" value={form.Email} onChange={e => setForm({ ...form, Email: e.target.value })} />
                <input placeholder="Phone" value={form.Phone} onChange={e => setForm({ ...form, Phone: e.target.value })} />
                <input placeholder="Address" value={form.Address} onChange={e => setForm({ ...form, Address: e.target.value })} />
                <select value={form.Role} onChange={e => setForm({ ...form, Role: e.target.value })}>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                </select>
                <button onClick={handleSubmit}>{editingId ? "Cập nhật" : "Thêm"}</button>
            </div>

            <table border="1" cellPadding="8" style={{ marginTop: "20px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>FullName</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Phone</th>
                        <th>Address</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.UserID}>
                            <td>{u.UserID}</td>
                            <td>{u.FullName}</td>
                            <td>{u.Email}</td>
                            <td>{u.Role}</td>
                            <td>{u.Phone}</td>
                            <td>{u.Address}</td>
                            <td>
                                <button onClick={() => handleEdit(u)}>Sửa</button>
                                <button onClick={() => handleDelete(u.UserID)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminUsers;
