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

  async function handleDelete(id) {
    if (!confirm("คุณต้องการลบหมวดหมู่นี้หรือไม่?")) return;
    try {
      const res = await fetch(`/api/category/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");
      alert("ลบสำเร็จ!");
      
      const newCategoryList = category.filter((c) => c.id !== id);
      setCategory(newCategoryList);
    } catch (err) {
      alert(err.message);
    }
  }

  // ระบบค้นหา
  useEffect(() => {
    if (!Array.isArray(category)) return;

    const filtered = category.filter((c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategory(filtered);
  }, [searchTerm, category]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>จัดการหมวดหมู่</h1>
      </div>

      {/* จัดกลุ่มปุ่ม Create และ Search bar ให้อยู่บรรทัดเดียวกันด้วย top-actions */}
      <div className="top-actions">
        <Link href="/admin/category/create" className="btn-create">
          <Plus size={20} /> เพิ่มหมวดหมู่ใหม่
        </Link>

        <div className="search-bar">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="ค้นหาหมวดหมู่..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>หมวดหมู่</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategory.map((item) => (
              <tr key={item.id} className="row">
                <td>{item.name}</td>
                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/category/${item.id}/edit`}
                      className="btn-edit"
                    >
                      <Edit size={16} /> แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={16} /> ลบ
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