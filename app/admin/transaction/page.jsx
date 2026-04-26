"use client";
import { useEffect, useState } from "react";
import { Eye, Search, History, ArrowRight } from "lucide-react";
import "../../styles/transaction/transaction.css";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    async function fetchTransactionLogs() {
      try {
        const res = await fetch("/api/transaction");
        if (!res.ok) throw new Error("Failed to fetch logs");
        const data = await res.json();
        setTransactions(data);
        setFilteredLogs(data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactionLogs();
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = transactions.filter(transaction => 
      transaction.po_number.toLowerCase().includes(term.lower) || 
      transaction.action.toLowerCase().includes(term) ||
      transaction.username.toLowerCase().includes(term)
    );
    setFilteredLogs(filtered);
  };

  if (loading) return <div className="loading">กำลังดึงข้อมูลประวัติ...</div>;

  return (
    <div className="transaction-page">
      <div className="header-section">
        <div className="title-group">
          <h1><History size={28} /> Audit Trail Log</h1>
          <p>บันทึกประวัติการเปลี่ยนแปลงสถานะใบสั่งซื้อ (ตามฐานข้อมูล)</p>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="ค้นหา PO, ผู้ทำรายการ หรือการกระทำ..." 
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="table-container">
        <table className="transaction-table">
          <thead>
            <tr>
              <th>วัน-เวลาที่ทำรายการ</th>
              <th>เลขที่ PO</th>
              <th>การกระทำ (Action)</th>
              <th>ผู้ทำรายการ</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log) => (
                <tr key={log.id}>

                  <td className="time-cell">
                    {new Date(log.created_at).toLocaleString('th-TH')}
                  </td>

                  <td className="po-number">{log.po_number}</td>

                  <td>
                    <span className={`action-label ${log.action.toLowerCase()}`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="user-cell">
                    <div className="user-info">
                      <strong>{log.username}</strong>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">ไม่พบประวัติการทำรายการ</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}