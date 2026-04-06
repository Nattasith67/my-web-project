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
  const [categories, setCategories] = useState([]);
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
          category: data.category_id ?? "",
          image_url: data.image_url ?? "",
        });
      } else {
        setError(data?.error || "Not found");
      }
      setLoading(false);
    })();
  }, [id]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/category");
      const data = await res.json();
      setCategories(data);
    })();
  }, []);

  const onChange = (e) =>
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

  // บันทึกข้อมูล
  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/product/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: form.price ? Number(form.price) : null,
          stock_quantity: form.stock_quantity
            ? Number(form.stock_quantity)
            : null,
            category_id: form.category,
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
    <div className="edit-container">
      <h1 className="header">แก้ไขสินค้า</h1>

      <form onSubmit={onSubmit} className="edit-form">
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
          {saving ? "Saving..." : "บันทึก"}
        </button>

        {error && <div className="error-message">{error}</div>}
      </form>

      <p>
        <Link href="/admin/products" className="cancel-link">
          Cancel
        </Link>
      </p>
    </div>
  );
}
