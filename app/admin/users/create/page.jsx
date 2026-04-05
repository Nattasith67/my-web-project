"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>สร้างผู้ใช้ใหม่</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
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
          {saving ? "Saving..." : "สร้างผู้ใช้"}
        </button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <p>
        <Link href="/admin/user">กลับไปหน้าผู้ใช้</Link>
      </p>
    </div>
  );
}