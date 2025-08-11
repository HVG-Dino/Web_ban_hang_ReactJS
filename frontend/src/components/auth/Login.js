import React from 'react';

function Login() {
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>Đăng nhập</h1>
            <form>
                <input type="text" placeholder="Tên đăng nhập" /><br /><br />
                <input type="password" placeholder="Mật khẩu" /><br /><br />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
