const express = require('express');
const router = express.Router();
const { poolPromise, sql } = require('../config/db');

// Đăng nhập
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Email', sql.VarChar, email)
            .input('PasswordHash', sql.VarChar, password)
            .query(`
                SELECT UserID, FullName, Email, Role
                FROM Users
                WHERE Email = @Email AND PasswordHash = @PasswordHash
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// Đăng ký
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;

        // Kiểm tra email đã tồn tại chưa
        const check = await pool.request()
            .input('Email', sql.VarChar, email)
            .query('SELECT UserID FROM Users WHERE Email = @Email');

        if (check.recordset.length > 0) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Thêm user mới
        await pool.request()
            .input('FullName', sql.NVarChar, email.split('@')[0]) // tên tạm
            .input('Email', sql.VarChar, email)
            .input('PasswordHash', sql.VarChar, password)
            .input('Role', sql.VarChar, 'customer')
            .input('Phone', sql.VarChar, '')
            .input('Address', sql.NVarChar, '')
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, Role, Phone, Address, CreatedAt)
                VALUES (@FullName, @Email, @PasswordHash, @Role, @Phone, @Address, GETDATE())
            `);

        res.json({ message: 'Đăng ký thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;
