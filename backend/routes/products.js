const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');

// ✅ Lấy toàn bộ sản phẩm
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi truy vấn sản phẩm');
    }
});

// ✅ Lấy 1 sản phẩm theo ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await poolPromise;
        const result = await pool.request()
            .input("ProductID", id)
            .query("SELECT * FROM Products WHERE ProductID = @ProductID");

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        }

        res.json(result.recordset[0]); // trả về 1 object sản phẩm
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi khi truy vấn sản phẩm theo ID');
    }
});

module.exports = router;
