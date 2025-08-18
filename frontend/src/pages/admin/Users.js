import React, { useEffect, useState } from "react";
import api from "../../services/api";
import "./AdminUsers.css";

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        FullName: "",
        Email: "",
        Role: "customer",
        Phone: "",
        Address: "",
    });
    const [formErrors, setFormErrors] = useState({});
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch (err) {
            console.error("Lỗi khi lấy danh sách users:", err);
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!form.FullName.trim()) errors.FullName = "Vui lòng nhập họ tên.";
        if (!form.Email.trim()) {
            errors.Email = "Vui lòng nhập email.";
        } else if (!/\S+@\S+\.\S+/.test(form.Email)) {
            errors.Email = "Email không hợp lệ.";
        }
        if (!form.Phone.trim()) errors.Phone = "Vui lòng nhập số điện thoại.";
        if (!form.Address.trim()) errors.Address = "Vui lòng nhập địa chỉ.";
        return errors;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const resetForm = () => {
        setForm({
            FullName: "",
            Email: "",
            Role: "customer",
            Phone: "",
            Address: "",
        });
        setFormErrors({});
        setEditingId(null);
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
                await api.put(`/admin/users/${editingId}`, form);
                alert("Cập nhật thành công!");
            } else {
                await api.post("/admin/users", {
                    ...form,
                    PasswordHash: "123456", // giả định gán mặc định
                });
                alert("Thêm người dùng thành công!");
            }
            fetchUsers();
            resetForm();
        } catch (err) {
            console.error("Lỗi lưu người dùng:", err);
        }
    };

    const handleEdit = (user) => {
        setForm(user);
        setEditingId(user.UserID);
        setFormErrors({});
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa người dùng này?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            fetchUsers();
        } catch (err) {
            console.error("Lỗi xóa người dùng:", err);
        }
    };

    return (
        <div className="admin-users">
            <h2>Quản lý Người dùng</h2>

            <form className="user-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="FullName"
                    placeholder="Họ tên"
                    value={form.FullName}
                    onChange={handleChange}
                />
                {formErrors.FullName && <div className="error">{formErrors.FullName}</div>}

                <input
                    type="email"
                    name="Email"
                    placeholder="Email"
                    value={form.Email}
                    onChange={handleChange}
                />
                {formErrors.Email && <div className="error">{formErrors.Email}</div>}

                <input
                    type="text"
                    name="Phone"
                    placeholder="Số điện thoại"
                    value={form.Phone}
                    onChange={handleChange}
                />
                {formErrors.Phone && <div className="error">{formErrors.Phone}</div>}

                <input
                    type="text"
                    name="Address"
                    placeholder="Địa chỉ"
                    value={form.Address}
                    onChange={handleChange}
                />
                {formErrors.Address && <div className="error">{formErrors.Address}</div>}

                <select name="Role" value={form.Role} onChange={handleChange}>
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                </select>

                <div className="form-actions">
                    <button type="submit">{editingId ? "Cập nhật" : "Thêm mới"}</button>
                    {editingId && (
                        <button type="button" className="cancel-btn" onClick={resetForm}>
                            Hủy
                        </button>
                    )}
                </div>
            </form>

            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>SĐT</th>
                        <th>Địa chỉ</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.UserID}>
                            <td>{u.UserID}</td>
                            <td>{u.FullName}</td>
                            <td>{u.Email}</td>
                            <td>{u.Role}</td>
                            <td>{u.Phone}</td>
                            <td>{u.Address}</td>
                            <td>
                                <button onClick={() => handleEdit(u)}>Sửa</button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(u.UserID)}
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

export default AdminUsers;
