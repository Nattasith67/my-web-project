"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateCustomerPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    lastname: "",
    username: "",
    password: "",
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
      const res = await fetch("/api/customer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");

      alert("สร้างลูกค้าสำเร็จ!");
      router.push("/admin/customer");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>เพิ่มลูกค้าใหม่</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          name="name"
          placeholder="ชื่อ"
          value={form.name}
          onChange={onChange}
          required
        />

        <input
          name="lastname"
          placeholder="นามสกุล"
          value={form.lastname}
          onChange={onChange}
          required
        />

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={onChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={onChange}
          required
        />

        <button disabled={saving}>
          {saving ? "Saving..." : "เพิ่มลูกค้า"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <p>
        <Link href="/admin/customers">กลับไปหน้าลูกค้า</Link>
      </p>
    </div>
  );
}