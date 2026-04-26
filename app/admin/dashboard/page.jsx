"use client";
import { useEffect, useState } from "react";
import "../../styles/dashboard.css";
export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    outOfStock: 0,
    lowStock: 0,
    users: 0,
  });

  useEffect(() => {
    let url = "/api/dashboard";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalProducts: data.totalProducts || 0,
          outOfStock: data.outOfStock || 0,
          lowStock: data.lowStock || 0,
          users: data.users || 0,

        });
      })
      .catch((err) => console.error("Error:", err));
  }, []);

  console.log(stats.outOfStock);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="stats-grid">
        <div className="stats-card">
          <h3>สินค้าทั้งหมด</h3>
          <p>{stats.totalProducts}</p>
        </div>

        <div className="stats-card">
          <h3>สินค้าใกล้หมด </h3>
          <p>{stats.lowStock}</p>
        </div>

        <div className="stats-card">
          <h3>สินค้าหมดสต๊อก</h3>
          <p>{stats.outOfStock}</p>
        </div>

        <div className="stats-card">
          <h3>พนักงานทั้งหมด</h3>
          <p>{stats.users}</p>
        </div>
      </div>
    </div>
  );
}
