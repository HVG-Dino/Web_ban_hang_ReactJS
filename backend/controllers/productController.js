const sql = require('mssql');
const db = require('../config/db'); // Kết nối từ config/db.js

// Lấy toàn bộ sản phẩm
exports.getAllProducts = async (req, res) => {
    try {
        // Sử dụng stored procedure (tuỳ chọn) hoặc truy vấn trực tiếp
        const result = await db.request().query('SELECT * FROM Products');
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi truy xuất dữ liệu sản phẩm" });
    }
};

// Lấy sản phẩm theo ID
exports.getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.request()
            .input('ProductID', sql.Int, id)  // Sử dụng input để bảo mật
            .query('SELECT * FROM Products WHERE ProductID = @ProductID');

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi truy xuất dữ liệu sản phẩm" });
    }
};

// Thêm sản phẩm mới
exports.createProduct = async (req, res) => {
    const { ProductName, CategoryID, SupplierID, Price, Stock, Description, ImageURL } = req.body;
    try {
        const result = await db.request()
            .input('ProductName', sql.NVarChar, ProductName)
            .input('CategoryID', sql.Int, CategoryID)
            .input('SupplierID', sql.Int, SupplierID)
            .input('Price', sql.Decimal(10, 2), Price)
            .input('Stock', sql.Int, Stock)
            .input('Description', sql.NVarChar, Description)
            .input('ImageURL', sql.NVarChar, ImageURL)
            .query(`
                INSERT INTO Products 
                (ProductName, CategoryID, SupplierID, Price, Stock, Description, ImageURL)
                VALUES (@ProductName, @CategoryID, @SupplierID, @Price, @Stock, @Description, @ImageURL)
            `);

        res.json({ message: 'Thêm sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi thêm sản phẩm" });
    }
};

// Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { ProductName, CategoryID, SupplierID, Price, Stock, Description, ImageURL } = req.body;
    try {
        const result = await db.request()
            .input('ProductID', sql.Int, id)
            .input('ProductName', sql.NVarChar, ProductName)
            .input('CategoryID', sql.Int, CategoryID)
            .input('SupplierID', sql.Int, SupplierID)
            .input('Price', sql.Decimal(10, 2), Price)
            .input('Stock', sql.Int, Stock)
            .input('Description', sql.NVarChar, Description)
            .input('ImageURL', sql.NVarChar, ImageURL)
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
        res.status(500).json({ error: "Lỗi khi cập nhật sản phẩm" });
    }
};

// Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Nếu muốn kiểm tra sự tồn tại của sản phẩm trước khi xóa
        const checkProduct = await db.request()
            .input('ProductID', sql.Int, id)
            .query('SELECT * FROM Products WHERE ProductID = @ProductID');

        if (checkProduct.recordset.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm để xóa' });
        }

        // Xóa sản phẩm
        await db.request()
            .input('ProductID', sql.Int, id)
            .query('DELETE FROM Products WHERE ProductID = @ProductID');

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Lỗi khi xóa sản phẩm" });
    }
};
