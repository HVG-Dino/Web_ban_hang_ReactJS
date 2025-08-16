const { sql, poolPromise } = require('../config/db');

// Lấy tất cả danh mục
exports.getAllCategories = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Categories');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('CategoryID', sql.Int, req.params.id)
            .query('SELECT * FROM Categories WHERE CategoryID = @CategoryID');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Thêm danh mục mới
exports.createCategory = async (req, res) => {
    const { CategoryName, Description } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CategoryName', sql.NVarChar, CategoryName)
            .input('Description', sql.NVarChar, Description || '')
            .query(`
                INSERT INTO Categories (CategoryName, Description)
                VALUES (@CategoryName, @Description)
            `);

        res.json({ message: 'Thêm danh mục thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Cập nhật danh mục
exports.updateCategory = async (req, res) => {
    const { id } = req.params;
    const { CategoryName, Description } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CategoryID', sql.Int, id)
            .input('CategoryName', sql.NVarChar, CategoryName)
            .input('Description', sql.NVarChar, Description || '')
            .query(`
                UPDATE Categories SET 
                    CategoryName = @CategoryName,
                    Description = @Description
                WHERE CategoryID = @CategoryID
            `);

        res.json({ message: 'Cập nhật danh mục thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Xóa danh mục
exports.deleteCategory = async (req, res) => {
    try {
        const pool = await poolPromise;
        const check = await pool.request()
            .input('CategoryID', sql.Int, req.params.id)
            .query('SELECT * FROM Categories WHERE CategoryID = @CategoryID');

        if (check.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy danh mục để xóa' });
        }

        await pool.request()
            .input('CategoryID', sql.Int, req.params.id)
            .query('DELETE FROM Categories WHERE CategoryID = @CategoryID');

        res.json({ message: 'Xóa danh mục thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};
