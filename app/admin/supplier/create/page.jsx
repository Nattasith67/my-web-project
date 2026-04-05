"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateSupplierPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");

      alert("สร้าง Supplier สำเร็จ!");
      router.push("/admin/supplier");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>สร้าง Supplier</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          placeholder="ชื่อ Supplier"
          value={form.name}
          onChange={onChange}
          required
        />

        <input
          name="phone"
          placeholder="เบอร์โทร"
          value={form.phone}
          onChange={onChange}
        />

        <input
          name="email"
          type="email"
          placeholder="อีเมล"
          value={form.email}
          onChange={onChange}
        />

        <textarea
          name="address"
          placeholder="ที่อยู่"
          rows={3}
          value={form.address}
          onChange={onChange}
        />

        <button disabled={saving}>
          {saving ? "Saving..." : "สร้าง Supplier"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <p>
        <Link href="/admin/supplier">กลับไปหน้า Supplier</Link>
      </p>
    </div>
  );
}