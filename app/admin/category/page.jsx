"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import "../../styles/Category.css";

export default function CategoryPage() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState([]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategory(data);
        setFilteredCategory(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setLoading(false);
      }
    }
    fetchCategory();
  }, []);

  // ฟังก์ชันลบหมวดหมู่
  async function handleDelete(id) {
    if (!confirm("คุณต้องการลบหมวดหมู่นี้หรือไม่?")) return;
    try {
      const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      alert("ลบสำเร็จ!");
      
      // อัปเดต State ลบรายการนั้นออกไปเลย โดยไม่ต้องรีเฟรชหน้าเว็บ (UX ดีกว่า)
      const newCategoryList = category.filter((c) => c.id !== id);
      setCategory(newCategoryList);
    } catch (err) {
      alert(err.message);
    }
  }

  // ระบบค้นหา
  useEffect(() => {
    const filtered = category.filter((c) =>
      // เปลี่ยนจาก c.name เป็น c.category_name ตาม Database
      c.category_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
  }, [searchTerm, category]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>จัดการหมวดหมู่</h1>
      </div>

      <div className="btn-create">
        <Link href="/admin/category/create" className="btn-create">
          <Plus size={20} /> เพิ่มหมวดหมู่ใหม่
        </Link>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหาหมวดหมู่..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>หมวดหมู่</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* ใส่ fallback ให้ key เป็น index ไว้เผื่อกรณี API ไม่ส่ง id มาให้ จะได้ไม่ติด Error */}
            {filteredCategory.map((c, index) => (
              <tr key={c.id || index} className="row">
                {/* เปลี่ยนจาก c.name เป็น c.category_name */}
                <td>{c.category_name}</td>
                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/category/${c.id}/edit`}
                      className="btn-edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCategory.length === 0 && (
          <div className="no-category">
            <p>ไม่พบหมวดหมู่</p>
          </div>
        )}
      </div>
    </div>
  );
}