"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import "./../../../styles/purchase/PurchaseForm.css";

export default function CreatePurchaseWithItemsPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    po_number: "",
    supplier_id: "",
    user_id: 1,
    purchase_date: "",
    status: "Pending",
    remarks: "",
    tax_rate: 0,
    paid_to_date: 0,
  });

  const [items, setItems] = useState([
    {
      product_id: "",
      quantity: 1,
      unit_price: "",
      total_price: 0
    },
  ]);

  const [suppliers, setSuppliers] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/supplier");
      const data = await response.json();
      setSuppliers(data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/user");
      const data = await response.json();
      setUsers(data);
    })();
  }, []);


  useEffect(() => {
    (async () => {
      const response = await fetch("/api/product");
      const data = await response.json();
      setProducts(data);
    })();
  }, []);

  const onFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;

    if (field === "product_id") {
      const selectedProduct = products.find((product) => product.id === Number(value));
      newItems[index].unit_price = selectedProduct ? selectedProduct.price : "";
    }

    const qty = Number(newItems[index].quantity) || 0;
    const price = Number(newItems[index].unit_price) || 0;
    newItems[index].total_price = qty * price;

    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        product_id: "",
        quantity: 1,
        unit_price: "",
        total_price: 0
      }
    ]);
  };

  const removeItemRow = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  const subtotal = items.reduce((sum, item) => sum + (item.total_price || 0), 0);
  const taxRate = Number(form.tax_rate) || 0;
  const taxAmount = subtotal * (taxRate / 100);
  const total = subtotal + taxAmount;
  const paidToDate = Number(form.paid_to_date) || 0;
  const balanceDue = total - paidToDate;

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        purchase: {
          po_number: form.po_number,
          supplier_id: form.supplier_id ? Number(form.supplier_id) : null,
          user_id: Number(form.user_id) || 1,
          purchase_date: form.purchase_date || null,
          status: form.status,
          remarks: form.remarks,
          subtotal: subtotal,
          tax_rate: taxRate,
          tax_amount: taxAmount,
          total_amount: total,
          paid_to_date: paidToDate,
          balance_due: balanceDue,
        },
        items: items.map((item) => ({
          product_id: Number(item.product_id),
          quantity: Number(item.quantity),
          unit_price: Number(item.unit_price),
          total_price: Number(item.total_price),
        })),
      };

      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Create failed");

      alert("สร้างใบสั่งซื้อและรายการสินค้าสำเร็จ!");
      router.push("/admin/purchases");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>สร้างใบสั่งซื้อใหม่</h1>
      </div>

      <div className="form-container wide">
        <form onSubmit={onSubmit} className="custom-form">
          
          {/* --- ส่วนที่ 1: ข้อมูลหลัก --- */}
          <div className="form-section">
            <h3 className="section-title">ข้อมูลใบสั่งซื้อ</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>PO Number *</label>
                <input name="po_number" type="text" value={form.po_number} onChange={onFormChange} required className="form-input" placeholder="เช่น PO-2023-001" />
              </div>
              <div className="form-group">
                <label>วันที่สั่งซื้อ</label>
                <input name="purchase_date" type="date" value={form.purchase_date} onChange={onFormChange} className="form-input" />
              </div>
              <div className="form-group">
                <label>ซัพพลายเออร์</label>
                <select name="supplier_id" value={form.supplier_id} onChange={onFormChange} className="form-input">
                  <option value="">-- เลือกซัพพลายเออร์ --</option>
                  {suppliers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                      </option>))}
                </select>
              </div>
              <div className="form-group">
                <label>ผู้สร้าง / ผู้ดูแล</label>
                <select name="user_id" value={form.user_id} onChange={onFormChange} className="form-input">
                  <option value="">-- เลือกผู้ใช้งาน --</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.username }
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>สถานะ</label>
                <select name="status" value={form.status} onChange={onFormChange} className="form-input">
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>
          </div>

          {/* --- ส่วนที่ 2: รายการสินค้า --- */}
          <div className="form-section">
            <h3 className="section-title">รายการสินค้า</h3>
            
            <div className="items-container">
              {items.map((item, index) => (
                <div key={index} className="item-row">
                  <span className="item-index">{index + 1}.</span>
                  
                  <select
                    value={item.product_id}
                    onChange={(e) => onItemChange(index, "product_id", e.target.value)}
                    required
                    className="form-input flex-2"
                  >
                    <option value="">-- เลือกสินค้า --</option>
                    {products.map((p) => (<option key={p.id} value={p.id}>{p.product_name}</option>))}
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="จำนวน"
                    value={item.quantity}
                    onChange={(e) => onItemChange(index, "quantity", e.target.value)}
                    required
                    className="form-input flex-1"
                  />

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="ราคา/หน่วย"
                    value={item.unit_price}
                    onChange={(e) => onItemChange(index, "unit_price", e.target.value)}
                    required
                    className="form-input flex-1"
                  />

                  <div className="item-total">
                    {item.total_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    disabled={items.length === 1}
                    className="btn-delete-item"
                    title="ลบรายการ"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>

            <button type="button" onClick={addItemRow} className="btn-add-item">
              <Plus size={16} /> เพิ่มรายการสินค้า
            </button>
          </div>

          <div className="summary-section">
            <div className="remarks-group">
              <label>หมายเหตุ</label>
              <textarea name="remarks" value={form.remarks} onChange={onFormChange} rows={5} className="form-input" placeholder="พิมพ์หมายเหตุเพิ่มเติมที่นี่..." />
            </div>
            
            <div className="calc-block">
              <div className="calc-row">
                <span>Subtotal:</span>
                <span className="fw-bold">{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
              </div>

              <div className="calc-row">
                <span>Tax (%):</span>
                <input name="tax_rate" type="number" min="0" step="0.01" value={form.tax_rate} onChange={onFormChange} className="calc-input" />
              </div>

              <div className="calc-row text-muted">
                <span>Tax Amount:</span>
                <span>{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
              </div>

              <div className="calc-row total text-success">
                <span>Total:</span>
                <span>{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
              </div>

              <div className="divider"></div>

              <div className="calc-row">
                <span>Paid to Date:</span>
                <input name="paid_to_date" type="number" min="0" step="0.01" value={form.paid_to_date} onChange={onFormChange} className="calc-input" />
              </div>

              <div className="calc-row total">
                <span>Balance Due:</span>
                <span className={balanceDue > 0 ? "text-danger" : "text-success"}>
                  {balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿
                </span>
              </div>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <Link href="/admin/purchases" className="btn-cancel">
              <ArrowLeft size={18} /> ยกเลิก
            </Link>
            
            <button type="submit" disabled={saving} className="btn-submit">
              <Save size={18} />
              {saving ? "กำลังบันทึก..." : "บันทึกใบสั่งซื้อ"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}