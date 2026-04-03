"use client";
import { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import '../../styles/Product.css'

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // ดึงข้อมูลสินค้าจาก API
  useEffect(() => {
    async function fetchProduct(params) {
      const res = await fetch("/api/product");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
      setLoading(false)
    }
    fetchProduct();
  }, []);
  
  if (loading) return <div>Loading...</div>;

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
                    style={{width: "200px"}}
                    className="product-image"
                  />
                </td>
                <td>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description?.substring(0, 50)}...</p>
                  </div>
                </td>
                <td>{product.category || "-"}</td>
                <td className="price">฿{product.price?.toLocaleString()}</td>
                <td>
                  <span
                    className={`stock ${product.stock > 5 ? "in-stock" : "low-stock"}`}
                  >
                    {product.stock || 0}
                  </span>
                </td>
                <td>
                  <span
                    className={`status ${product.stock > 0 ? "active" : "inactive"}`}
                  >
                    {product.stock > 0 ? "พร้อมขาย" : "หมดสต็อก"}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="btn-edit"
                    >
                      <Edit size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn-delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
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
