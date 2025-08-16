import React from "react";
import "./Home.css";  // Tạo file CSS riêng cho Home
import headerImg from "../../assets/header.png";
import logosImg from "../../assets/logos.png";

function Home() {
    return (
        <div className="home-container">
            {/* Banner */}
            <section className="home-banner">
                <img src={headerImg} alt="Header Banner" className="banner-img" />

                {/* Nút hiển thị đè trên ảnh */}
                <div className="home-sale">
                    <button className="shop-btn" onClick={() => window.location.href = "/shop"}>
                        SHOP NOW
                    </button>
                </div>
            </section>


            {/* Logos thương hiệu */}
            <section className="home-logos">
                <img src={logosImg} alt="Brand Logos" className="logos-img" />
            </section>
        </div>
    );
}

export default Home;
