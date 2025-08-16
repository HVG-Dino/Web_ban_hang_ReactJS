const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');

// Lấy toàn bộ sản phẩm
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

module.exports = router;
