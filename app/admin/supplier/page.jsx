"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import "../../styles/Supplier.css";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);

  useEffect(() => {
    async function fetchSuppliers() {
      try {
        const res = await fetch("/api/supplier");
        const data = await res.json();
        setSuppliers(data);
        setFilteredSuppliers(data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSuppliers();
  }, []);

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

      {/* จัดกลุ่มปุ่มเพิ่มข้อมูล และ ช่องค้นหาให้อยู่ในบรรทัดเดียวกันด้วย flexbox */}
      <div className="top-actions">
        <Link href="/admin/supplier/create" className="btn-create">
          <Plus size={20} /> เพิ่ม Supplier
        </Link>

        <div className="search-bar">
          <Search size={20} color="#666" />
          <input
            type="text"
            placeholder="ค้นหา Supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
            {filteredSuppliers.map((s) => (
              <tr key={s.id} className="row">
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
            <p>ไม่พบ Supplier ที่ค้นหา</p>
          </div>
        )}
      </div>
    </div>
  );
}