"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/user");
        const data = await res.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // ฟังก์ชันลบ User
  async function handleDelete(id) {
    if (!confirm("คุณต้องการลบผู้ใช้นี้หรือไม่?")) return;

    try {
      const res = await fetch(`/api/user/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("ลบไม่สำเร็จ");

      alert("ลบสำเร็จ!");

      const newUsers = users.filter((u) => u.id !== id);
      setUsers(newUsers);
      setFilteredUsers(newUsers);
    } catch (err) {
      alert(err.message);
    }
  }

  // ระบบค้นหา
  useEffect(() => {
    const filtered = users.filter((u) =>
      u.username?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="category-page">
      <div className="page-header">
        <h1>จัดการผู้ใช้</h1>
      </div>

      <div className="btn-create">
        <Link href="/admin/users/create" className="btn-create">
          <Plus size={20} /> เพิ่มผู้ใช้ใหม่
        </Link>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหาผู้ใช้..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="category-table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Password</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="row">
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.password}</td>

                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="btn-edit"
                    >
                      <Edit size={16} />
                    </Link>

                    <button
                      onClick={() => handleDelete(user.id)}
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

        {filteredUsers.length === 0 && (
          <div className="no-category">
            <p>ไม่พบผู้ใช้</p>
          </div>
        )}
      </div>
    </div>
  );
}
