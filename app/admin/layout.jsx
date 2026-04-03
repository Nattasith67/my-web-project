"use client"
import Sidebar from '@/app/components/admin/Sidebar'
import Header from '@/app/components/admin/Header'
import { useState } from 'react'

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  
  return (
    <div className="admin-layout">
      <Sidebar isOpen={sidebarOpen} />
      <div className="admin-main-content">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </div>
  )
}