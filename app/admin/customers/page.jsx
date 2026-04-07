"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import "../../styles/product/Product.css";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch("/api/customer");
        const data = await res.json();
        setCustomers(data);
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
        setCustomers([]);
        setFilteredCustomers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((c) =>
        (c.name + " " + c.lastname)
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    }
  }, [searchTerm, customers]);

  const handleDelete = async (id) => {
    if (confirm("คุณต้องการลบลูกค้านี้ใช่หรือไม่?")) {
      try {
        const res = await fetch(`/api/customer/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          setCustomers(customers.filter((c) => c.id !== id));
          setFilteredCustomers(filteredCustomers.filter((c) => c.id !== id));
          alert("ลบลูกค้าสำเร็จ");
        } else {
          alert("ลบลูกค้าไม่สำเร็จ");
        }
      } catch (error) {
        console.error("Error deleting customer:", error);
        alert("เกิดข้อผิดพลาดในการลบลูกค้า");
      }
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>จัดการลูกค้า</h1>
      </div>

      <div className="btn-create">
        <Link href="/admin/customers/create" className="btn-create">
          <Plus size={20} />
          เพิ่มลูกค้าใหม่
        </Link>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหาลูกค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>นามสกุล</th>
              <th>Username</th>
              <th>จัดการ</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.lastname}</td>
                <td>{c.username}</td>
                <td>
                  <Link
                    href={`/admin/customers/${c.id}/edit`}
                    className="btn-edit"
                  >
                    <Edit size={16} />
                    แก้ไข
                  </Link>

                  <button
                    onClick={() => handleDelete(c.id)}
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

        {filteredCustomers.length === 0 && (
          <div className="no-products">
            <p>ไม่พบลูกค้า</p>
          </div>
        )}
      </div>
    </div>
  );
}