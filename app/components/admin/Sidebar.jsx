"use client"
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import '../../styles/Sidebar_Admin.css'

export default function Sidebar() {
  const pathname = usePathname()
  
  const menuItems = [
  { id: 1, href: '/admin/dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 2, href: '/admin/products', label: 'สินค้า', icon: '📦' },
  { id: 3, href: '/admin/category', label: 'หมวดหมู่', icon: '📚'},
  { id: 4, href: '/admin/purchase', label: 'Purchase Order', icon: '🛒' },
  { id: 5, href: '/admin/users', label: 'ผู้ใช้', icon: '👥' },
  { id: 6, href: '/admin/supplier', label: 'supplier', icon: '🚚' },
  { id: 7, href: '/admin/customers', label: 'ลูกค้า', icon: '👤' }
];

  return (
    <div className='sidebar'>
      <header>
        <div className='image-text'>
          <span className='image'>
            
          </span>
          <div className='header-text'>
            <span className='name'>Admin</span>
            <span className='role'>Administrator</span>
          </div>
        </div>
      </header>
      
      <nav className='sidebar-nav'>
        <ul>
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            
            return (
              <li key={item.id}>
                <Link 
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className='icon'>{item.icon}</span>
                  <span className='text'>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className='sidebar-footer'>
        <Link href="/" className='logout-link'>
          <span className='icon'>🚪</span>
          <span className='text'>ออกจากระบบ</span>
        </Link>
      </div>
    </div>
  )
}