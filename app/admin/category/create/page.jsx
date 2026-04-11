"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateCategoryPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); 
    setError("");
    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");
      alert("สร้างหมวดหมู่สำเร็จ!");
      router.push("/admin/category");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-container">
      <h1 className="header">สร้างหมวดหมู่ใหม่</h1>

      <form onSubmit={onSubmit} className="custom-form">
        <input 
          name="name" 
          placeholder="ชื่อหมวดหมู่" 
          value={form.name} 
          onChange={onChange} 
          className="form-input"
          required 
        />

        <button disabled={saving} className="form-button">
          {saving ? "กำลังบันทึก..." : "สร้างหมวดหมู่"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      <div className="cancel-link-container">
        <Link href="/admin/category" className="cancel-link">
          กลับไปหน้าหมวดหมู่
        </Link>
      </div>
    </div>
  );
}