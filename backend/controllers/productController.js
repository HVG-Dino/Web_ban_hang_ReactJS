const { sql, poolPromise } = require('../config/db');

// Lấy tất cả sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('ProductID', sql.Int, req.params.id)
            .query('SELECT * FROM Products WHERE ProductID = @ProductID');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Thêm sản phẩm mới (có kiểm tra / tạo CategoryID)
exports.createProduct = async (req, res) => {
    const { ProductName, CategoryID, CategoryName, SupplierID, Price, Stock, Description, ImageURL } = req.body;
    try {
        const pool = await poolPromise;
        let finalCategoryID = CategoryID;

        // Nếu có CategoryID → kiểm tra tồn tại
        if (finalCategoryID) {
            const categoryCheck = await pool.request()
                .input('CategoryID', sql.Int, finalCategoryID)
                .query('SELECT * FROM Categories WHERE CategoryID = @CategoryID');

            if (categoryCheck.recordset.length === 0) {
                if (CategoryName) {
                    const insertCategory = await pool.request()
                        .input('CategoryName', sql.NVarChar, CategoryName)
                        .query(`
                            INSERT INTO Categories (CategoryName)
                            OUTPUT INSERTED.CategoryID
                            VALUES (@CategoryName)
                        `);
                    finalCategoryID = insertCategory.recordset[0].CategoryID;
                } else {
                    return res.status(400).json({ error: 'CategoryID không tồn tại và không có CategoryName để tạo mới' });
                }
            }
        } else {
            // Không có CategoryID → cần CategoryName
            if (!CategoryName) {
                return res.status(400).json({ error: 'Thiếu CategoryID hoặc CategoryName' });
            }
            const insertCategory = await pool.request()
                .input('CategoryName', sql.NVarChar, CategoryName)
                .query(`
                    INSERT INTO Categories (CategoryName)
                    OUTPUT INSERTED.CategoryID
                    VALUES (@CategoryName)
                `);
            finalCategoryID = insertCategory.recordset[0].CategoryID;
        }

        // Thêm sản phẩm
        await pool.request()
            .input('ProductName', sql.NVarChar, ProductName)
            .input('CategoryID', sql.Int, finalCategoryID)
            .input('SupplierID', sql.Int, SupplierID || 0)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('Stock', sql.Int, Stock)
            .input('Description', sql.NVarChar, Description)
            .input('ImageURL', sql.NVarChar, ImageURL || '')
            .query(`
                INSERT INTO Products 
                (ProductName, CategoryID, SupplierID, Price, Stock, Description, ImageURL)
                VALUES (@ProductName, @CategoryID, @SupplierID, @Price, @Stock, @Description, @ImageURL)
            `);

        res.json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { ProductName, CategoryID, SupplierID, Price, Stock, Description, ImageURL } = req.body;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('ProductID', sql.Int, id)
            .input('ProductName', sql.NVarChar, ProductName)
            .input('CategoryID', sql.Int, CategoryID)
            .input('SupplierID', sql.Int, SupplierID || 0)
            .input('Price', sql.Decimal(18, 2), Price)
            .input('Stock', sql.Int, Stock)
            .input('Description', sql.NVarChar, Description)
            .input('ImageURL', sql.NVarChar, ImageURL || '')
            .query(`
                UPDATE Products SET 
                    ProductName = @ProductName,
                    CategoryID = @CategoryID,
                    SupplierID = @SupplierID,
                    Price = @Price,
                    Stock = @Stock,
                    Description = @Description,
                    ImageURL = @ImageURL
                WHERE ProductID = @ProductID
            `);

        res.json({ message: 'Cập nhật sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const pool = await poolPromise;
        const check = await pool.request()
            .input('ProductID', sql.Int, req.params.id)
            .query('SELECT * FROM Products WHERE ProductID = @ProductID');

        if (check.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }

        await pool.request()
            .input('ProductID', sql.Int, req.params.id)
            .query('DELETE FROM Products WHERE ProductID = @ProductID');

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err.message);
    }
};
