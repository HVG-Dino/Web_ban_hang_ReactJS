
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
        console.log('✅ Connected to MSSQL');
        return pool;
    })
    .catch(err => {
        console.error('❌ Database connection failed:', err);
        process.exit(1); // Dừng hẳn server nếu DB fail
    });

module.exports = { sql, poolPromise };