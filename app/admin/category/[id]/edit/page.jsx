"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CategoryEdit() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("ไม่พบ ID หมวดหมู่");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`/api/category/${id}`);
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        console.log("Category data:", data);
        
        setForm({
          name: data.name || ""
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "ไม่สามารถดึงข้อมูลหมวดหมู่ได้");
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
      const res = await fetch(`/api/category/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name
        })
      });
      
      const data = await res.json();
      console.log("Update response:", data);
      
      if (!res.ok) {
        throw new Error(data?.error || "Update failed");
      }
      
      alert("อัปเดตหมวดหมู่สำเร็จ!");
      router.push("/admin/category");
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ maxWidth: 640, margin: "24px auto" }}>
      <h1>แก้ไขหมวดหมู่</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input 
          name="name" 
          placeholder="ชื่อหมวดหมู่" 
          value={form.name} 
          onChange={onChange} 
          required 
        />
        <button disabled={saving}>
          {saving ? "Saving..." : "บันทึก"}
        </button>
        {error && <div style={{ color: "crimson" }}>{error}</div>}
      </form>

      <p>
        <Link href="/admin/category">Cancel</Link>
      </p>
    </div>
  );
}