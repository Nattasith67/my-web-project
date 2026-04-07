"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import "../../styles/product/Product.css";

export default function PurchasePage() {
  const [purchases, setPurchases] = useState([]);
  const [filteredPurchases, setFilteredPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchPurchases() {
      try {
        const res = await fetch("/api/purchase");
        const data = await res.json();
        setPurchases(data);
        setFilteredPurchases(data);
      } catch (error) {
        console.error("Error fetching purchases:", error);
        setPurchases([]);
        setFilteredPurchases([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPurchases(purchases);
    } else {
      const filtered = purchases.filter((p) =>
        (p.name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredPurchases(filtered);
    }
  }, [searchTerm, purchases]);

  const handleDelete = async (id) => {
    if (confirm("คุณต้องการลบรายการนี้ใช่หรือไม่?")) {
      try {
        const res = await fetch(`/api/purchase/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setPurchases(purchases.filter((p) => p.id !== id));
          setFilteredPurchases(filteredPurchases.filter((p) => p.id !== id));
          alert("ลบข้อมูลสำเร็จ");
        } else {
          alert("ลบข้อมูลไม่สำเร็จ");
        }
      } catch (error) {
        console.error("Error deleting purchase:", error);
        alert("เกิดข้อผิดพลาดในการลบ");
      }
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>จัดการการสั่งซื้อ</h1>
      </div>

      <div className="btn-create">
        <Link href="/admin/purchase/create" className="btn-create">
          <Plus size={20} />
          เพิ่มรายการสั่งซื้อ
        </Link>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหาการสั่งซื้อ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ชื่อสินค้า</th>
              <th>จำนวน</th>
              <th>ราคา</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {filteredPurchases.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.price}</td>
                <td>
                  <Link
                    href={`/admin/purchase/${p.id}/edit`}
                    className="btn-edit"
                  >
                    <Edit size={16} />
                    แก้ไข
                  </Link>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn-delete"
                  >
                    <Trash2 size={16} />
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredPurchases.length === 0 && (
          <div className="no-products">
            <p>ไม่พบข้อมูล</p>
          </div>
        )}
      </div>
    </div>
  );
}