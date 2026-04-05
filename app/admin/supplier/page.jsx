"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await fetch("/api/supplier");
        const data = await res.json();

        const finalData = Array.isArray(data) ? data : [];

        setSuppliers(finalData);
        setFilteredSuppliers(finalData);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

  // ฟังก์ชันลบ Supplier
  async function handleDelete(id) {
    if (!confirm("คุณต้องการลบ Supplier นี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/supplier/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      alert("ลบสำเร็จ!");

      const newData = suppliers.filter((s) => s.id !== id);
      setSuppliers(newData);
      setFilteredSuppliers(newData);
    } catch (err) {
      alert(err.message);
    }
  }

  // ระบบค้นหา (ค้นหาจาก name)
  useEffect(() => {
    const filtered = suppliers.filter((s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  }, [searchTerm, suppliers]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>จัดการ Supplier</h1>
      </div>

      <div className="btn-create">
        <Link href="/admin/supplier/create" className="btn-create">
          <Plus size={20} /> เพิ่ม Supplier
        </Link>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหา Supplier..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSuppliers.map((s, index) => (
              <tr key={`${s.id}-${index}`} className="row">
                <td>{s.id}</td>
                <td>{s.name}</td>
                <td>{s.phone}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>

                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/supplier/${s.id}/edit`}
                      className="btn-edit"
                    >
                      <Edit size={16} />
                    </Link>

                    <button
                      onClick={() => handleDelete(s.id)}
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

        {filteredSuppliers.length === 0 && (
          <div className="no-category">
            <p>ไม่พบ Supplier</p>
          </div>
        )}
      </div>
    </div>
  );
}