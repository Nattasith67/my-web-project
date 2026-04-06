"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import "../../styles/product/Product.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/product");
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
        setFilteredProducts([]);
      } finally {
        setLoading(false);
      }
    }
    
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const handleDelete = async (id) => {
    if (confirm("คุณต้องการลบสินค้านี้ใช่หรือไม่?")) {
      try {
        const res = await fetch(`/api/product/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setProducts(products.filter((p) => p.id !== id));
          setFilteredProducts(filteredProducts.filter((p) => p.id !== id));
          alert("ลบสินค้าสำเร็จ");
        } else {
          alert("ลบสินค้าไม่สำเร็จ");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("เกิดข้อผิดพลาดในการลบสินค้า");
      }
    }
  };

  if (loading) return <div>กำลังโหลด...</div>;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>จัดการสินค้า</h1>
      </div>
      <div className="btn-create">
        <Link href="/admin/products/create" className="btn-create">
          <Plus size={20} />
          เพิ่มสินค้าใหม่
        </Link>
      </div>
      
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>รูปภาพ</th>
              <th>ชื่อสินค้า</th>
              <th>หมวดหมู่</th>
              <th>ราคา</th>
              <th>สต็อก</th>
              <th>สถานะ</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id} className="row">
                <td>
                  <img
                    src={product.image_url || "/images/placeholder.jpg"}
                    alt={product.name}
                    className="product-image"
                  />
                </td>
                <td>
                  <div className="product-info">
                    <h3>{product.product_name}</h3>
                    <p>{product.description?.substring(0, 50)}...</p>
                  </div>
                </td>
                <td>{product.category_name || "-"}</td>
                <td className="price">฿{product.price?.toLocaleString()}</td>
                <td>{product.stock_quantity || 0}</td>
                <td>มีสินค้า</td>
                <td>
                  <Link href={`/admin/products/${product.id}/edit`} className="btn-edit">
                    <Edit size={16} />
                    แก้ไข
                  </Link>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="btn-delete"
                  >
                    <Trash2 size={16} />
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredProducts.length === 0 && (
          <div className="no-products">
            <p>ไม่พบสินค้า</p>
          </div>
        )}
      </div>
    </div>
  );
}