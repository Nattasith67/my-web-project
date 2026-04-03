"use client"
import React, { useEffect, useState } from 'react'
import '../styles/Home.css'

export default function Home() {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const banners = [
    "promotion1.jpg",
    "https://picsum.photos/1200/400?random=2",
    "https://picsum.photos/1200/400?random=3",
    "https://picsum.photos/1200/400?random=4",
    "https://picsum.photos/1200/400?random=5"
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch('/api/product')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className='container'>
      <div className='banner'>
        <img 
          src={banners[currentBanner]} 
          alt={`Banner ${currentBanner + 1}`}
          style={{ width: '100%', height: '400px', objectFit: 'cover' }}
        />
      </div>
      <div className='products-section'>
        <h2>สินค้าแนะนำ</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="products-grid">
            {products.map(product => (
              <div key={product.id} className="product-card">
                <img 
                  src={product.image_url} 
                  alt={product.name}
                  style={{ width: '200px', height: '150px', objectFit: 'cover' }}
                />
                <h3>{product.name}</h3>
                <p>฿{product.price}</p>
                <button>Add to Cart</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}