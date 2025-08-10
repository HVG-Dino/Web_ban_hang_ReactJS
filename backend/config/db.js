
// config/db.js
const sql = require('mssql'); // <--- Dòng này rất quan trọng

const config = {
    user: 'sa',
    password: '123456',
    server: 'DESKTOP-94UF7MB\\SQLEXPRESS',
    database: 'Web_ban_hang',
    options: {
        encrypt: false,               // Tắt SSL nếu local
        trustServerCertificate: true, // Chấp nhận cert self-signed
    },
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✅ Đã kết nối SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ Lỗi kết nối DB:', err);
    });

module.exports = {
    sql,          // export sql để dùng type / query
    poolPromise,  // export poolPromise để query
};
