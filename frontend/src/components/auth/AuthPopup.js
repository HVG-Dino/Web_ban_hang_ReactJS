import React, { useState } from 'react';
import axios from 'axios';
import './AuthPopup.css';
import { useAuth } from '../AuthContext';  // ✅ import context

function AuthPopup({ onClose }) {
    const [mode, setMode] = useState('login'); // login hoặc register
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});
    const { login } = useAuth();  // ✅ lấy hàm login từ context

    // Validate Login
    const validateLogin = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ";

        if (!password) newErrors.password = "Mật khẩu không được để trống";
        else if (password.length < 6) newErrors.password = "Mật khẩu phải ≥ 6 ký tự";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Validate Register
    const validateRegister = () => {
        const newErrors = {};
        if (!email) newErrors.email = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ";

        if (!password) newErrors.password = "Mật khẩu không được để trống";
        else if (password.length < 6) newErrors.password = "Mật khẩu phải ≥ 6 ký tự";

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        if (!validateLogin()) return;
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            if (res.data.Role === 'admin') {
                window.location.href = '/admin';
            } else {
                login(res.data); // ✅ lưu user vào context + localStorage
                onClose();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Lỗi đăng nhập');
        }
    };

    const handleRegister = async () => {
        if (!validateRegister()) return;
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
                        {errors.email && <span className="error">{errors.email}</span>}

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}

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
                        {errors.email && <span className="error">{errors.email}</span>}

                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}

                        <input
                            type="password"
                            placeholder="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}

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
