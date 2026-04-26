"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Save, ArrowLeft } from "lucide-react";
import "../../../../styles/user/Form.css";

export default function SupplierEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("ไม่พบ ID supplier");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/supplier/${id}`);
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log("supplier data:", data);
        
        setForm({
          name: data.name || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || ""
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "ไม่สามารถดึงข้อมูล supplier ได้");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const onChange = (e) => setForm({ 
    ...form, [e.target.name]: e.target.value
  });

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    
    try {
      const res = await fetch(`/api/supplier/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          address: form.address
        })
      });
      
      const data = await res.json();
      console.log("Update response:", data);
      
      if (!res.ok) {
        throw new Error(data?.error || "Update failed");
      }
      
      alert("อัปเดต supplier สำเร็จ!");
      router.push("/admin/supplier");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="form-page">
      <div className="page-header">
        <h1>แก้ไข Supplier</h1>
      </div>

      <div className="form-container">
        <form onSubmit={onSubmit} className="custom-form">
          <div className="form-group">
            <label>ชื่อ</label>
            <input
              name="name"
              placeholder="กรอกชื่อ supplier"
              value={form.name}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>เบอร์โทรศัพท์</label>
            <input
              name="phone"
              placeholder="กรอกเบอร์โทรศัพท์"
              value={form.phone}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="กรอก email"
              value={form.email}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>ที่อยู่</label>
            <input
              name="address"
              placeholder="กรอกที่อยู่"
              value={form.address}
              onChange={onChange}
              required
              className="form-input"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <Link href="/admin/supplier" className="btn-cancel">
              <ArrowLeft size={18} /> กลับ
            </Link>
            
            <button type="submit" disabled={saving} className="btn-submit">
              <Save size={18} />
              {saving ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}