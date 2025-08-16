const { sql, poolPromise } = require('../config/db');

// Lấy tất cả Supplier
exports.getAllSuppliers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM Suppliers");
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi getAllSuppliers:", err);
        res.status(500).send(err.message);
    }
};

// Lấy Supplier theo ID
exports.getSupplierById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("SupplierID", sql.Int, id)
            .query("SELECT * FROM Suppliers WHERE SupplierID = @SupplierID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy Supplier" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Lỗi getSupplierById:", err);
        res.status(500).send(err.message);
    }
};

// Tạo mới Supplier
exports.createSupplier = async (req, res) => {
    const { SupplierName, ContactName, Phone, Address } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("SupplierName", sql.NVarChar, SupplierName)
            .input("ContactName", sql.NVarChar, ContactName)
            .input("Phone", sql.NVarChar, Phone)
            .input("Address", sql.NVarChar, Address)
            .query(`
        INSERT INTO Suppliers (SupplierName, ContactName, Phone, Address)
        VALUES (@SupplierName, @ContactName, @Phone, @Address)
      `);
        res.json({ message: "Thêm Supplier thành công" });
    } catch (err) {
        console.error("Lỗi createSupplier:", err);
        res.status(500).send(err.message);
    }
};

// Cập nhật Supplier
exports.updateSupplier = async (req, res) => {
    const { id } = req.params;
    const { SupplierName, ContactName, Phone, Address } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("SupplierID", sql.Int, id)
            .input("SupplierName", sql.NVarChar, SupplierName)
            .input("ContactName", sql.NVarChar, ContactName)
            .input("Phone", sql.NVarChar, Phone)
            .input("Address", sql.NVarChar, Address)
            .query(`
        UPDATE Suppliers 
        SET SupplierName=@SupplierName, ContactName=@ContactName, Phone=@Phone, Address=@Address
        WHERE SupplierID=@SupplierID
      `);
        res.json({ message: "Cập nhật Supplier thành công" });
    } catch (err) {
        console.error("Lỗi updateSupplier:", err);
        res.status(500).send(err.message);
    }
};

// Xóa Supplier
exports.deleteSupplier = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("SupplierID", sql.Int, id)
            .query("DELETE FROM Suppliers WHERE SupplierID=@SupplierID");
        res.json({ message: "Xóa Supplier thành công" });
    } catch (err) {
        console.error("Lỗi deleteSupplier:", err);
        res.status(500).send(err.message);
    }
};
