"use client";
import { useEffect, useState } from "react";
import { mysqlPool } from "@/utils/db";
import "../../styles/dashboard.css";
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    let url = "/api/dashboard";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalProducts: data.totalProducts || 0,
          totalOrders: data.totalOrders || 0,
          totalUsers: data.totalUsers || 0,
          totalRevenue: data.totalRevenue || 0,
        });
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  const statCards = [
    {
      title: "สินค้าทั้งหมด",
      value: stats.totalProducts,
      color: "blue",
    },
    {
      title: "ออเดอร์ทั้งหมด",
      value: stats.totalOrders,
      color: "green",
    },
    {
      title: "ผู้ใช้ทั้งหมด",
      value: stats.totalUsers,
      color: "purple",
    },
    {
      title: "รายได้ทั้งหมด",
      value: `฿${stats.totalRevenue.toLocaleString()}`,
      color: "orange",
    },
  ];

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        {statCards.map((stat, index) => {
          return (
            <div key={index} className={"stats-card"}>
              <div className="stat-content">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="dashboard-content">
        <div className="recent-orders">
          <h2>ออเดอร์ล่าสุด</h2>
          <div className="orders-table">{/* Table content */}</div>
        </div>
        <div className="top-products">
          <h2>สินค้าขายดี</h2>
          <div className="products-list">{/* Products list */}</div>
        </div>
      </div>
    </div>
  );
}
