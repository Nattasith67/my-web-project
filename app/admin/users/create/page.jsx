"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft } from "lucide-react"; // เพิ่มไอคอน
import "../../../styles/user/Form.css"; // สร้างไฟล์ CSS สำหรับหน้าฟอร์มโดยเฉพาะ

export default function CreateUserPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Create failed");

      alert("สร้างผู้ใช้สำเร็จ!");
      router.push("/admin/user");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>สร้างผู้ใช้ใหม่</h1>
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
            <Link href="/admin/user" className="btn-cancel">
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