"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import '../../styles/Product.css'

export default function CategoryPage() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredcategory, setFilteredCategory] = useState([]);

  useEffect(() => {
    async function fetchCategory(params) {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategory(data);
      setFilteredCategory(data);
      setLoading(false)
    }
    fetchCategory();
  }, []);
  if (loading) return <div>Loading...</div>;

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>จัดการสินค้า</h1>
      </div>
      <div className="btn-create">
        <Link href="/admin/category/create" className="btn-create">
          <Plus size={20} />
          เพิ่มสินค้าใหม่
        </Link>
      </div>
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>หมวดหมู่</th>
            </tr>
          </thead>
          <tbody>
            {filteredcategory.map((category) => (
              <tr key={category.id} className="row">
                <td>{category.category || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredcategory.length === 0 && (
          <div className="no-category">
            <p>ไม่พบสินค้า</p>
          </div>
        )}
      </div>
    </div>
  );
}
