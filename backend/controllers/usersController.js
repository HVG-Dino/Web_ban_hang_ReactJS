const sql = require('mssql');
const { poolPromise } = require('../config/db');

// Lấy tất cả user
exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Lấy user theo ID
exports.getUserById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', sql.Int, req.params.id)
            .query('SELECT * FROM Users WHERE UserID = @UserID');
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Thêm user mới
exports.createUser = async (req, res) => {
    const { FullName, Email, PasswordHash, Role, Phone, Address } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('PasswordHash', sql.NVarChar, PasswordHash)
            .input('Role', sql.NVarChar, Role)
            .input('Phone', sql.NVarChar, Phone)
            .input('Address', sql.NVarChar, Address)
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, Role, Phone, Address, CreatedAt)
                VALUES (@FullName, @Email, @PasswordHash, @Role, @Phone, @Address, GETDATE())
            `);
        res.send('User created successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Cập nhật user
exports.updateUser = async (req, res) => {
    const { FullName, Email, Role, Phone, Address } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', sql.Int, req.params.id)
            .input('FullName', sql.NVarChar, FullName)
            .input('Email', sql.NVarChar, Email)
            .input('Role', sql.NVarChar, Role)
            .input('Phone', sql.NVarChar, Phone)
            .input('Address', sql.NVarChar, Address)
            .query(`
                UPDATE Users
                SET FullName=@FullName, Email=@Email, Role=@Role, Phone=@Phone, Address=@Address
                WHERE UserID=@UserID
            `);
        res.send('User updated successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Xóa user
exports.deleteUser = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', sql.Int, req.params.id)
            .query('DELETE FROM Users WHERE UserID=@UserID');
        res.send('User deleted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};
