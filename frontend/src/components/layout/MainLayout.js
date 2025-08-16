import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/layout/Header";

function MainLayout() {
    return (
        <div>
            <Header />
            <main style={{ paddingTop: "80px" }}>
                <Outlet />
            </main>
        </div>
    );
}


export default MainLayout; 
