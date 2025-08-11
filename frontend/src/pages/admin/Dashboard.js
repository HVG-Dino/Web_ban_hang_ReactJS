import React from "react";
import "./Dashboard.css";
import { MdDashboard, MdCategory, MdInventory, MdNotifications } from "react-icons/md";
import { FaUser, FaBox, FaFileInvoiceDollar, FaTruck } from "react-icons/fa";
import { Link } from "react-router-dom";

function Dashboard() {
    const invoices = [
        { id: "#AHGA68", date: "23/09/2022", customer: "Jacob Marcus", payable: "$100", paid: "$000", due: "$000" },
        { id: "#AHGA68", date: "23/09/2022", customer: "Jacob Marcus", payable: "$100", paid: "$000", due: "$000" },
        { id: "#AHGA68", date: "23/09/2022", customer: "Jacob Marcus", payable: "$100", paid: "$000", due: "$000" },
        { id: "#AHGA68", date: "23/09/2022", customer: "Jacob Marcus", payable: "$100", paid: "$000", due: "$000" },
    ];

    return (
        <div className="admin-container">
            {/* Sidebar */}

            {/* Main */}
            <main className="main-content">
                {/* Top bar */}
                <div className="top-bar">
                    <input type="text" placeholder="Search" className="search-input" />
                    <div className="user-info">
                        <MdNotifications className="notification-icon" />
                        <img src="https://i.pravatar.cc/40" alt="user" className="avatar" />
                    </div>
                </div>

                {/* Sales Information */}
                <section className="sales-info">
                    <h2>Sales Information</h2>
                    <div className="filters">
                        <input type="text" placeholder="Enter Customer Name" />
                        <input type="text" placeholder="Enter Invoice ID" />
                        <input type="date" placeholder="Start Date" />
                        <input type="date" placeholder="End Date" />
                    </div>

                    {/* Table */}
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>Invoice ID</th>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Payable Amount</th>
                                <th>Paid Amount</th>
                                <th>Due</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((item, idx) => (
                                <tr key={idx}>
                                    <td><input type="checkbox" /></td>
                                    <td className="link">{item.id}</td>
                                    <td>{item.date}</td>
                                    <td>{item.customer}</td>
                                    <td>{item.payable}</td>
                                    <td>{item.paid}</td>
                                    <td>{item.due}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
}

export default Dashboard;
