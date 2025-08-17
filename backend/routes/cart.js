const express = require('express');
const router = express.Router();
const { poolPromise } = require('../config/db');

// 🛒 Thêm sản phẩm vào giỏ
router.post('/add', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const pool = await poolPromise;

        // Kiểm tra có giỏ của user chưa
        let cart = await pool.request()
            .input('UserID', userId)
            .query('SELECT * FROM Carts WHERE UserID = @UserID');

        let cartId;
        if (cart.recordset.length === 0) {
            // Nếu chưa có thì tạo mới
            let insertCart = await pool.request()
                .input('UserID', userId)
                .query('INSERT INTO Carts (UserID) OUTPUT INSERTED.CartID VALUES (@UserID)');
            cartId = insertCart.recordset[0].CartID;
        } else {
            cartId = cart.recordset[0].CartID;
        }

        // Kiểm tra sản phẩm đã tồn tại trong giỏ chưa
        let item = await pool.request()
            .input('CartID', cartId)
            .input('ProductID', productId)
            .query('SELECT * FROM CartItems WHERE CartID = @CartID AND ProductID = @ProductID');

        if (item.recordset.length > 0) {
            // Nếu có thì update số lượng
            await pool.request()
                .input('CartID', cartId)
                .input('ProductID', productId)
                .input('Quantity', quantity)
                .query('UPDATE CartItems SET Quantity = Quantity + @Quantity WHERE CartID = @CartID AND ProductID = @ProductID');
        } else {
            // Nếu chưa thì insert mới
            await pool.request()
                .input('CartID', cartId)
                .input('ProductID', productId)
                .input('Quantity', quantity)
                .query('INSERT INTO CartItems (CartID, ProductID, Quantity) VALUES (@CartID, @ProductID, @Quantity)');
        }

        res.json({ success: true, message: 'Product added to cart' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding product to cart');
    }
});

// 🛒 Lấy giỏ hàng của user
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserID', userId)
            .query(`
                SELECT ci.CartItemID, p.ProductID, p.ProductName, p.Price, ci.Quantity, p.ImageURL
                FROM CartItems ci
                JOIN Carts c ON ci.CartID = c.CartID
                JOIN Products p ON ci.ProductID = p.ProductID
                WHERE c.UserID = @UserID
            `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching cart');
    }
});

router.put('/update', async (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
        const pool = await poolPromise;

        // Lấy CartID của user
        const cartRes = await pool.request()
            .input('UserID', userId)
            .query('SELECT CartID FROM Carts WHERE UserID = @UserID');

        if (cartRes.recordset.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        const cartId = cartRes.recordset[0].CartID;

        // Cập nhật quantity trong CartItems
        await pool.request()
            .input('CartID', cartId)
            .input('ProductID', productId)
            .input('Quantity', quantity)
            .query('UPDATE CartItems SET Quantity = @Quantity WHERE CartID = @CartID AND ProductID = @ProductID');

        res.json({ success: true, message: 'Cart item updated' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating cart item');
    }
});


// 🗑️ Xóa sản phẩm khỏi giỏ
router.delete('/:cartItemId', async (req, res) => {
    const { cartItemId } = req.params;
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('CartItemID', cartItemId)
            .query('DELETE FROM CartItems WHERE CartItemID = @CartItemID');
        res.json({ success: true, message: 'Item removed from cart' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error removing item');
    }
});

module.exports = router;
