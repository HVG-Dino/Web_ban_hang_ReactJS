import React, { useState } from 'react';
import axios from 'axios';
import './AuthPopup.css';

function AuthPopup({ onClose }) {
    const [mode, setMode] = useState('login'); // login hoặc register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.Role === 'admin') {
                window.location.href = '/admin';
            } else {
                localStorage.setItem('user', JSON.stringify(res.data));
                onClose();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi đăng nhập');
        }
    };

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            return alert('Mật khẩu xác nhận không khớp');
        }
        try {
            const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
            alert(res.data.message);
            setMode('login'); // quay lại đăng nhập
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi đăng ký');
        }
    };

    return (
        <div className="auth-popup-overlay" onClick={onClose}>
            <div className="auth-popup" onClick={(e) => e.stopPropagation()}>
                {mode === 'login' ? (
                    <>
                        <h2>Đăng nhập</h2>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button onClick={handleLogin}>Đăng nhập</button>
                        <p>
                            Chưa có tài khoản?{" "}
                            <button className="link-btn" onClick={() => setMode('register')}>
                                Đăng ký
                            </button>
                        </p>
                    </>
                ) : (
                    <>
                        <h2>Đăng ký</h2>
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button onClick={handleRegister}>Đăng ký</button>
                        <p>
                            Đã có tài khoản?{" "}
                            <button className="link-btn" onClick={() => setMode('login')}>
                                Đăng nhập
                            </button>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

export default AuthPopup;
