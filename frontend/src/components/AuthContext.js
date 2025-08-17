// src/components/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // ✅ load user từ localStorage khi mở trang
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    const login = (userData) => {
        // ✅ Thêm xử lý chuẩn hóa
        const normalizedUser = {
            ...userData,
            id: userData.UserID || userData.id
        };

        setUser(normalizedUser);
        localStorage.setItem("user", JSON.stringify(normalizedUser)); // ✅ lưu phiên
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user"); // ✅ clear
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
