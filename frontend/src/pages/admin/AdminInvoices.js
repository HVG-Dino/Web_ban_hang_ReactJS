import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminInvoices.css";

const API_URL = "http://localhost:5000/api/invoices";

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
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            const res = await axios.get(API_URL);
            setInvoices(res.data);
        } catch (err) {
            console.error("Lỗi fetch invoices:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const errs = {};
        if (!formData.OrderID) errs.OrderID = "OrderID là bắt buộc";
        if (!formData.PayableAmount) errs.PayableAmount = "Payable là bắt buộc";
        if (!formData.PaidAmount) errs.PaidAmount = "Paid là bắt buộc";
        if (!formData.DueAmount) errs.DueAmount = "Due là bắt buộc";
        return errs;
    };

    const resetForm = () => {
        setFormData({
            InvoiceID: null,
            OrderID: "",
            PayableAmount: "",
            PaidAmount: "",
            DueAmount: "",
            InvoiceDate: "",
        });
        setIsEditing(false);
        setErrors({});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validateForm();
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            return;
        }

        try {
            if (isEditing && formData.InvoiceID) {
                await axios.put(`${API_URL}/${formData.InvoiceID}`, formData);
                alert("Cập nhật thành công!");
            } else {
                await axios.post(API_URL, formData);
                alert("Thêm mới thành công!");
            }
            fetchInvoices();
            resetForm();
        } catch (err) {
            console.error("Lỗi submit:", err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa invoice này?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchInvoices();
        } catch (err) {
            console.error("Lỗi delete:", err);
        }
    };

    const handleEdit = (invoice) => {
        setFormData(invoice);
        setIsEditing(true);
        setErrors({});
    };

    return (
        <div className="admin-invoices">
            <h2>Quản lý Invoices</h2>

            <form onSubmit={handleSubmit} className="invoice-form">
                <input
                    type="number"
                    name="OrderID"
                    placeholder="OrderID"
                    value={formData.OrderID}
                    onChange={handleChange}
                />
                {errors.OrderID && <div className="error">{errors.OrderID}</div>}

                <input
                    type="number"
                    step="0.01"
                    name="PayableAmount"
                    placeholder="Payable Amount"
                    value={formData.PayableAmount}
                    onChange={handleChange}
                />
                {errors.PayableAmount && <div className="error">{errors.PayableAmount}</div>}

                <input
                    type="number"
                    step="0.01"
                    name="PaidAmount"
                    placeholder="Paid Amount"
                    value={formData.PaidAmount}
                    onChange={handleChange}
                />
                {errors.PaidAmount && <div className="error">{errors.PaidAmount}</div>}

                <input
                    type="number"
                    step="0.01"
                    name="DueAmount"
                    placeholder="Due Amount"
                    value={formData.DueAmount}
                    onChange={handleChange}
                />
                {errors.DueAmount && <div className="error">{errors.DueAmount}</div>}

                <button type="submit">{isEditing ? "Cập nhật" : "Thêm mới"}</button>
                {isEditing && (
                    <button type="button" className="cancel-btn" onClick={resetForm}>
                        Hủy
                    </button>
                )}
            </form>

            <table className="invoice-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>OrderID</th>
                        <th>Payable</th>
                        <th>Paid</th>
                        <th>Due</th>
                        <th>Ngày</th>
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
                            <td>{new Date(inv.InvoiceDate).toLocaleString("vi-VN")}</td>
                            <td>
                                <button onClick={() => handleEdit(inv)}>Sửa</button>
                                <button
                                    onClick={() => handleDelete(inv.InvoiceID)}
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

export default AdminInvoices;
