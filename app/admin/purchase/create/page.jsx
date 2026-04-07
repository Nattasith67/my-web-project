"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePurchaseItemPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    purchase_id: "",
    product_id: "",
    quantity: "",
    unit_price: "",
  });

  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [pRes, prodRes] = await Promise.all([
          fetch("/api/purchase"),
          fetch("/api/product"),
        ]);

        const pData = await pRes.json();
        const prodData = await prodRes.json();

        setPurchases(pData);
        setProducts(prodData);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => {
      const updatedForm = { ...prev, [name]: value };

      // ทริคเพิ่มเติม: ถ้าเปลี่ยนสินค้า ให้ดึงราคาของสินค้านั้นมาใส่อัตโนมัติ!
      if (name === "product_id") {
        const selectedProduct = products.find((p) => p.id === Number(value));
        if (selectedProduct) {
          // สมมติว่าในตาราง products ของคุณมีคอลัมน์ชื่อ price
          updatedForm.unit_price = selectedProduct.price;
        } else {
          updatedForm.unit_price = ""; // ถ้าไม่ได้เลือกสินค้า ให้ล้างค่าราคา
        }
      }

      return updatedForm;
    });
  };

  const total_price = Number(form.quantity || 0) * Number(form.unit_price || 0);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/purchaseitem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purchase_id: Number(form.purchase_id),
          product_id: Number(form.product_id),
          quantity: Number(form.quantity),
          unit_price: Number(form.unit_price),
          total_price, // ส่งราคารวมไปเก็บใน DB ด้วย
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");

      alert("เพิ่มรายการสำเร็จ!");
      router.push("/admin/purchases");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      style={{ maxWidth: 640, margin: "24px auto", fontFamily: "sans-serif" }}
    >
      <h2>เพิ่มรายการสินค้า (Purchase Item)</h2>

      <form
        onSubmit={onSubmit}
        style={{ display: "grid", gap: 16, marginTop: 20 }}
      >
        {/* เลือก Purchase */}
        <div>
          <label
            style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}
          >
            ใบสั่งซื้อ
          </label>
          <select
            name="purchase_id"
            value={form.purchase_id}
            onChange={onChange}
            required
            style={{ width: "100%", padding: 8 }}
          >
            <option value="">-- เลือกใบสั่งซื้อ --</option>
            {purchases.map((p) => (
              <option key={p.id} value={p.id}>
                #{p.po_number || p.id} -{" "}
                {p.supplier_name || "ไม่ระบุซัพพลายเออร์"}
              </option>
            ))}
          </select>
        </div>

        {/* เลือกสินค้า */}
        <div>
          <label
            style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}
          >
            สินค้า
          </label>
          <select
            name="product_id"
            value={form.product_id}
            onChange={onChange}
            required
            style={{ width: "100%", padding: 8 }}
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.product_name}
              </option>
            ))}
          </select>
        </div>

        {/* จำนวน และ ราคาต่อหน่วย */}
        <div style={{ display: "flex", gap: 16 }}>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}
            >
              จำนวน
            </label>
            <input
              name="quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}
            >
              ราคาต่อหน่วย
            </label>
            <input
              name="unit_price"
              type="number"
              min="0"
              step="0.01"
              value={form.unit_price}
              onChange={onChange}
              required
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        </div>

        {/* แสดงราคารวม */}
        <div
          style={{ padding: 12, backgroundColor: "#f0f0f0", borderRadius: 4 }}
        >
          <strong>ราคารวม (Total Price): </strong>
          <span style={{ color: "green", fontSize: "1.2em" }}>
            {total_price.toLocaleString()} บาท
          </span>
        </div>

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: "10px",
            backgroundColor: saving ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "กำลังบันทึก..." : "เพิ่มรายการ"}
        </button>

        {error && (
          <div style={{ color: "crimson", textAlign: "center" }}>{error}</div>
        )}
      </form>

      <p style={{ marginTop: 24 }}>
        <Link href="/admin/purchases" style={{ color: "blue" }}>
          &larr; กลับไปหน้ารายการสั่งซื้อ
        </Link>
      </p>
    </div>
  );
}
