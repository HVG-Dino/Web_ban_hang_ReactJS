import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";
import { useAuth } from "../../components/AuthContext";
import AuthPopup from "../../components/auth/AuthPopup";

function MainLayout() {
    const { showLogin, setShowLogin } = useAuth();

    return (
        <div>
            <Header />
            <main style={{ paddingTop: "80px" }}>
                <Outlet />
            </main>

            {/* Nếu chưa đăng nhập mà click Add to Cart -> show popup */}
            {showLogin && <AuthPopup onClose={() => setShowLogin(false)} />}
        </div>
    );
}

export default MainLayout;
