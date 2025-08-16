const { sql, poolPromise } = require('../config/db');

// Lấy tất cả invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query("SELECT * FROM Invoices ORDER BY InvoiceDate DESC");
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi getAllInvoices:", err);
        res.status(500).send(err.message);
    }
};

// Lấy invoice theo ID
exports.getInvoiceById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("InvoiceID", sql.Int, id)
            .query("SELECT * FROM Invoices WHERE InvoiceID=@InvoiceID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy invoice" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Lỗi getInvoiceById:", err);
        res.status(500).send(err.message);
    }
};

// Tạo mới invoice
exports.createInvoice = async (req, res) => {
    const { OrderID, PayableAmount, PaidAmount, DueAmount } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("OrderID", sql.Int, OrderID)
            .input("PayableAmount", sql.Decimal(18, 2), PayableAmount)
            .input("PaidAmount", sql.Decimal(18, 2), PaidAmount)
            .input("DueAmount", sql.Decimal(18, 2), DueAmount)
            .input("InvoiceDate", sql.DateTime, new Date())
            .query(`
                INSERT INTO Invoices (OrderID, PayableAmount, PaidAmount, DueAmount, InvoiceDate)
                VALUES (@OrderID, @PayableAmount, @PaidAmount, @DueAmount, @InvoiceDate)
            `);
        res.json({ message: "Thêm invoice thành công" });
    } catch (err) {
        console.error("Lỗi createInvoice:", err);
        res.status(500).send(err.message);
    }
};

// Cập nhật invoice
exports.updateInvoice = async (req, res) => {
    const { id } = req.params;
    const { OrderID, PayableAmount, PaidAmount, DueAmount } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("InvoiceID", sql.Int, id)
            .input("OrderID", sql.Int, OrderID)
            .input("PayableAmount", sql.Decimal(18, 2), PayableAmount)
            .input("PaidAmount", sql.Decimal(18, 2), PaidAmount)
            .input("DueAmount", sql.Decimal(18, 2), DueAmount)
            .query(`
                UPDATE Invoices 
                SET OrderID=@OrderID, PayableAmount=@PayableAmount, PaidAmount=@PaidAmount, DueAmount=@DueAmount
                WHERE InvoiceID=@InvoiceID
            `);
        res.json({ message: "Cập nhật invoice thành công" });
    } catch (err) {
        console.error("Lỗi updateInvoice:", err);
        res.status(500).send(err.message);
    }
};

// Xóa invoice
exports.deleteInvoice = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("InvoiceID", sql.Int, id)
            .query("DELETE FROM Invoices WHERE InvoiceID=@InvoiceID");
        res.json({ message: "Xóa invoice thành công" });
    } catch (err) {
        console.error("Lỗi deleteInvoice:", err);
        res.status(500).send(err.message);
    }
};
