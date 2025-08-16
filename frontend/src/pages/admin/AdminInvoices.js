import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [formData, setFormData] = useState({
        InvoiceID: null,
        OrderID: "",
        PayableAmount: "",
        PaidAmount: "",
        DueAmount: "",
        InvoiceDate: "",
    });
    const [isEditing, setIsEditing] = useState(false);

    // Fetch dữ liệu
    const fetchInvoices = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/invoices");
            setInvoices(res.data);
        } catch (err) {
            console.error("Lỗi fetch invoices:", err);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Xử lý nhập form
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing && formData.InvoiceID) {
                await axios.put(
                    `http://localhost:5000/api/invoices/${formData.InvoiceID}`,
                    formData
                );
            } else {
                await axios.post("http://localhost:5000/api/invoices", formData);
            }
            fetchInvoices();
            setFormData({
                InvoiceID: null,
                OrderID: "",
                PayableAmount: "",
                PaidAmount: "",
                DueAmount: "",
                InvoiceDate: "",
            });
            setIsEditing(false);
        } catch (err) {
            console.error("Lỗi submit:", err);
        }
    };

    // Xóa
    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc muốn xóa invoice này?")) {
            try {
                await axios.delete(`http://localhost:5000/api/invoices/${id}`);
                fetchInvoices();
            } catch (err) {
                console.error("Lỗi delete:", err);
            }
        }
    };

    // Sửa
    const handleEdit = (invoice) => {
        setFormData(invoice);
        setIsEditing(true);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý Invoices</h2>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
                <input
                    type="number"
                    name="OrderID"
                    placeholder="OrderID"
                    value={formData.OrderID}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="PayableAmount"
                    placeholder="Payable Amount"
                    value={formData.PayableAmount}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="PaidAmount"
                    placeholder="Paid Amount"
                    value={formData.PaidAmount}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    step="0.01"
                    name="DueAmount"
                    placeholder="Due Amount"
                    value={formData.DueAmount}
                    onChange={handleChange}
                    required
                />
                <button type="submit">
                    {isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
            </form>

            {/* Danh sách */}
            <table border="1" cellPadding="8">
                <thead>
                    <tr>
                        <th>InvoiceID</th>
                        <th>OrderID</th>
                        <th>Payable</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>InvoiceDate</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((inv) => (
                        <tr key={inv.InvoiceID}>
                            <td>{inv.InvoiceID}</td>
                            <td>{inv.OrderID}</td>
                            <td>{inv.PayableAmount}</td>
                            <td>{inv.PaidAmount}</td>
                            <td>{inv.DueAmount}</td>
                            <td>
                                {new Date(inv.InvoiceDate).toLocaleString("vi-VN")}
                            </td>
                            <td>
                                <button onClick={() => handleEdit(inv)}>Sửa</button>
                                <button onClick={() => handleDelete(inv.InvoiceID)}>
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

export default AdminInvoices;
