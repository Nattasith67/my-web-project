"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function ProductEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ดึงข้อมูลสินค้า
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/product/${id}`);
      const data = await res.json();
      if (res.ok) {
        setForm({
          name: data.name ?? "",
          description: data.description ?? "",
          price: data.price ?? "",
          stock_quantity: data.stock_quantity ?? "",
          category: data.category ?? "",
          image_url: data.image_url ?? "",
        });
      } else {
        setError(data?.error || "Not found");
      }
      setLoading(false);
    })();
  }, [id]);

  const onChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  // บันทึกข้อมูล
  async function onSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setError("")
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
          stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Update failed");
      }

      alert("อัปเดตสินค้าสำเร็จ!");
      router.push("/admin/products");
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>Edit Product</h1>

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

        <button disabled={saving}>{saving ? "Saving..." : "บันทึก"}</button>

        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <p>
        <Link href="/admin/products">Cancel</Link>
      </p>
    </div>
  );
}
