const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db'); // dùng pool giống products

// Lấy danh sách nhà cung cấp (Shop chỉ cần view)
router.get('/', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .query('SELECT SupplierID, SupplierName FROM Suppliers ORDER BY SupplierName ASC');

        res.json(result.recordset); // trả về mảng supplier
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Lỗi khi truy vấn suppliers' });
    }
});

module.exports = router;
