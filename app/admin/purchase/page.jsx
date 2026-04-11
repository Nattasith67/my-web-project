"use client";
import { useEffect, useState } from "react";
import { Plus, CheckCircle, Trash2, Search } from "lucide-react";
import Link from "next/link";
import "./../../styles/purchase/Purchase.css";

export default function PurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch("/api/purchase");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPurchases(data || []);
        setFilteredPurchases(data || []);
      } catch (error) {
        console.error("Error fetching purchases:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPurchases();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    if (term === "") {
      setFilteredPurchases(purchases);
    } else {
      const filtered = purchases.filter((p) =>
        (p.po_number || "").toLowerCase().includes(term) ||
        (p.name || "").toLowerCase().includes(term)
      );
      setFilteredPurchases(filtered);
    }
  }, [searchTerm, purchases]);

  const handleSubmit = async (id) => {
    if (!confirm("ยืนยันการอนุมัติ (Approve) ใบสั่งซื้อนี้?")) return;
    try {
      const res = await fetch(`/api/purchase/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ไม่สามารถอนุมัติได้");
      }

      setPurchases((prev) => prev.filter((item) => item.id !== id));
      setFilteredPurchases((prev) => prev.filter((item) => item.id !== id));
      alert("อนุมัติสำเร็จ");
    } catch (error) {
      console.error("Approve Error:", error);
      alert(error.message || "เกิดข้อผิดพลาด");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) return;
    try {
      const res = await fetch(`/api/purchase/${id}`, { method: "DELETE" });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "ไม่สามารถลบได้");
      }

      setPurchases((prev) => prev.filter((item) => item.id !== id));
      setFilteredPurchases((prev) => prev.filter((item) => item.id !== id));
      alert("ลบสำเร็จ");
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.message || "ลบไม่สำเร็จ");
    }
  };

  if (loading) return <div className="loading">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="purchase-page">
      <div className="page-header">
        <h1>รายการใบสั่งซื้อรออนุมัติ (Pending)</h1>
      </div>

      <div className="top-actions">
        <Link href="/admin/purchase/create" className="btn-create">
          <Plus size={20} />เพิ่มรายการสั่งซื้อ
        </Link>
        <div className="search-bar">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="ค้นหาเลข PO หรือชื่อซัพพลายเออร์..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="purchase-table-container">
        <table className="purchase-table">
          <thead>
            <tr>
              <th>เลขที่ PO</th>
              <th>วันที่สั่งซื้อ</th>
              <th>ซัพพลายเออร์</th>
              <th>ยอดรวม</th>
              <th>ผู้สร้าง</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map((p) => (
                <tr key={p.id} className="row">
                  <td className="fw-bold">{p.po_number}</td>
                  <td>{p.purchase_date ? new Date(p.purchase_date).toLocaleDateString() : "-"}</td>
                  <td>{p.name || "ไม่ระบุ"}</td>
                  <td className="text-primary fw-bold">
                    {Number(p.total_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ฿
                  </td>
                  <td className="text-muted">{p.username || "System"}</td>
                  <td>
                    <div className="actions">
                      <button type="button" onClick={() => handleSubmit(p.id)} className="btn-approve" style={{ backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "4px", display: "flex", alignItems: "center", gap: "5px", cursor: "pointer" }}>
                        <CheckCircle size={16} />Approve
                      </button>
                      <button type="button" onClick={() => handleDelete(p.id)} className="btn-delete">
                        <Trash2 size={16} />ลบ
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>ไม่พบรายการใบสั่งซื้อที่รออนุมัติ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}