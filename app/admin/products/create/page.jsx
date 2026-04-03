"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateProductPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    image_url: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true); 
    setError("");
    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : 0,
          stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");
      alert("สร้างสินค้าสำเร็จ!");
      router.push("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>สร้างสินค้าใหม่</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input 
          name="name" 
          placeholder="ชื่อสินค้า" 
          value={form.name} 
          onChange={onChange} 
          required 
        />
        <input 
          name="price" 
          type="number"
          placeholder="ราคา" 
          value={form.price} 
          onChange={onChange} 
          required 
        />
        <input 
          name="stock_quantity" 
          type="number"
          placeholder="จำนวนสต็อก" 
          value={form.stock_quantity} 
          onChange={onChange} 
          required 
        />
        <input 
          name="category" 
          placeholder="หมวดหมู่" 
          value={form.category} 
          onChange={onChange} 
        />
        <input 
          name="image_url" 
          placeholder="รูปภาพ URL" 
          value={form.image_url} 
          onChange={onChange} 
        />
        <textarea 
          name="description" 
          placeholder="รายละเอียด" 
          rows={4} 
          value={form.description} 
          onChange={onChange} 
        />
        <button disabled={saving}>
          {saving ? "Saving..." : "สร้างสินค้า"}
        </button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>
      <p><Link href="/admin/products">กลับไปหน้าสินค้า</Link></p>
    </div>
  );
}