const { sql, poolPromise } = require('../config/db');

// Lấy tất cả log
exports.getAllLogs = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query("SELECT * FROM InventoryLogs ORDER BY ChangeDate DESC");
        res.json(result.recordset);
    } catch (err) {
        console.error("Lỗi getAllLogs:", err);
        res.status(500).send(err.message);
    }
};

// Lấy log theo ID
exports.getLogById = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("LogID", sql.Int, id)
            .query("SELECT * FROM InventoryLogs WHERE LogID=@LogID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy log" });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error("Lỗi getLogById:", err);
        res.status(500).send(err.message);
    }
};

// Tạo mới log
exports.createLog = async (req, res) => {
    const { ProductID, ChangeType, QuantityChange, Note } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("ProductID", sql.Int, ProductID)
            .input("ChangeType", sql.NVarChar, ChangeType)
            .input("QuantityChange", sql.Int, QuantityChange)
            .input("ChangeDate", sql.DateTime, new Date())
            .input("Note", sql.NVarChar, Note)
            .query(`
                INSERT INTO InventoryLogs (ProductID, ChangeType, QuantityChange, ChangeDate, Note)
                VALUES (@ProductID, @ChangeType, @QuantityChange, @ChangeDate, @Note)
            `);
        res.json({ message: "Thêm log thành công" });
    } catch (err) {
        console.error("Lỗi createLog:", err);
        res.status(500).send(err.message);
    }
};

// Cập nhật log
exports.updateLog = async (req, res) => {
    const { id } = req.params;
    const { ProductID, ChangeType, QuantityChange, Note } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("LogID", sql.Int, id)
            .input("ProductID", sql.Int, ProductID)
            .input("ChangeType", sql.NVarChar, ChangeType)
            .input("QuantityChange", sql.Int, QuantityChange)
            .input("Note", sql.NVarChar, Note)
            .query(`
                UPDATE InventoryLogs 
                SET ProductID=@ProductID, ChangeType=@ChangeType, QuantityChange=@QuantityChange, Note=@Note
                WHERE LogID=@LogID
            `);
        res.json({ message: "Cập nhật log thành công" });
    } catch (err) {
        console.error("Lỗi updateLog:", err);
        res.status(500).send(err.message);
    }
};

// Xóa log
exports.deleteLog = async (req, res) => {
    const { id } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input("LogID", sql.Int, id)
            .query("DELETE FROM InventoryLogs WHERE LogID=@LogID");
        res.json({ message: "Xóa log thành công" });
    } catch (err) {
        console.error("Lỗi deleteLog:", err);
        res.status(500).send(err.message);
    }
};
