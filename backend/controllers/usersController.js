const { poolPromise } = require('../config/db');

exports.getAllUsers = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', req.params.id)
            .query('SELECT * FROM Users WHERE UserID = @UserID');
        res.json(result.recordset[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.createUser = async (req, res) => {
    const { FullName, Email, PasswordHash, Role, Phone, Address } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('FullName', FullName)
            .input('Email', Email)
            .input('PasswordHash', PasswordHash)
            .input('Role', Role)
            .input('Phone', Phone)
            .input('Address', Address)
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash, Role, Phone, Address, CreatedAt)
                VALUES (@FullName, @Email, @PasswordHash, @Role, @Phone, @Address, GETDATE())
            `);
        res.send('User created successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.updateUser = async (req, res) => {
    const { FullName, Email, Role, Phone, Address } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', req.params.id)
            .input('FullName', FullName)
            .input('Email', Email)
            .input('Role', Role)
            .input('Phone', Phone)
            .input('Address', Address)
            .query(`
                UPDATE Users
                SET FullName=@FullName, Email=@Email, Role=@Role, Phone=@Phone, Address=@Address
                WHERE UserID=@UserID
            `);
        res.send('User updated successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserID', req.params.id)
            .query('DELETE FROM Users WHERE UserID=@UserID');
        res.send('User deleted successfully');
    } catch (err) {
        res.status(500).send(err.message);
    }
};
