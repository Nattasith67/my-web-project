"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./../../../styles/AddProduct.css";

export default function CreateProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock_quantity: "",
    category: "",
    image_url: "",
  });

  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/category");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("โหลด category ไม่ได้:", err);
      }
    }
    fetchCategories();
  }, []);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          description: form.description,
          price: form.price ? Number(form.price) : 0,
          stock_quantity: form.stock_quantity ? Number(form.stock_quantity) : 0,
          category_id: form.category || null,
          image_url: form.image_url,
        }),
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
    <div className="form-container">
      <h1 className="header">สร้างสินค้าใหม่</h1>

      <form onSubmit={onSubmit} className="custom-form">
        <input
          name="name"
          placeholder="ชื่อสินค้า"
          value={form.name}
          onChange={onChange}
          className="form-input"
          required
        />

        <input
          name="price"
          type="number"
          placeholder="ราคา"
          value={form.price}
          onChange={onChange}
          className="form-input"
          required
        />

        <input
          name="stock_quantity"
          type="number"
          placeholder="จำนวนสต็อก"
          value={form.stock_quantity}
          onChange={onChange}
          className="form-input"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={onChange}
          className="form-select"
        >
          <option value="">-- เลือกหมวดหมู่ --</option>
          <option value="null">ไม่มีหมวดหมู่</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="image_url"
          placeholder="รูปภาพ URL"
          value={form.image_url}
          onChange={onChange}
          className="form-input"
        />

        <textarea
          name="description"
          placeholder="รายละเอียด"
          rows={4}
          value={form.description}
          onChange={onChange}
          className="form-textarea"
        />

        <button disabled={saving} className="form-button">
          {saving ? "กำลังบันทึก..." : "สร้างสินค้า"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      <div className="cancel-link-container">
        <Link href="/admin/products" className="cancel-link">
          กลับไปหน้าสินค้า
        </Link>
      </div>
    </div>
  );
}