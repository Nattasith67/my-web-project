"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import "../../../../styles/user/Form.css";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`/api/user/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setForm({
          username: data.username,
          password: data.password
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Update failed");

      alert("แก้ไขผู้ใช้สำเร็จ!");
      router.push("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>แก้ไขผู้ใช้</h1>
      </div>

      <div className="form-container">
        <form onSubmit={onSubmit} className="custom-form">
          <div className="form-group">
            <label>Username</label>
            <input
              name="username"
              placeholder="กรอกชื่อผู้ใช้"
              value={form.username}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="กรอกรหัสผ่าน"
              value={form.password}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <Link href="/admin/users" className="btn-cancel">
              <ArrowLeft size={18} /> กลับ
            </Link>
            
            <button type="submit" disabled={saving} className="btn-submit">
              <Save size={18} />
              {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
