"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import "../../../../styles/EditCategory.css";

export default function CategoryEdit() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/category/${id}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        setForm({ name: data.name || "" });
      } catch (err) {
        setError(err.message || "ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name })
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Update failed");

      alert("อัปเดตหมวดหมู่สำเร็จ!");
      router.push("/admin/category");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="form-container">Loading...</div>;

  return (
    <div className="form-container">
      <h1 className="header">แก้ไขหมวดหมู่</h1>

      <form onSubmit={onSubmit} className="custom-form">
        <input
          className="form-input"
          name="name"
          placeholder="ชื่อหมวดหมู่"
          value={form.name}
          onChange={onChange}
          required
        />

        <button className="form-button" disabled={saving}>
          {saving ? "Saving..." : "บันทึก"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      <div className="cancel-link-container">
        <Link className="cancel-link" href="/admin/category">
          Cancel
        </Link>
      </div>
    </div>
  );
}