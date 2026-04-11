import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function GET() {
  try {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
      `SELECT 
        p.id,
        p.po_number, 
        p.purchase_date, 
        p.total_amount, 
        p.status, 
        p.remarks,
        s.name AS name,
        u.username AS username
      FROM purchases p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.status = 'Pending'
      `
    );

    return NextResponse.json(rows); 
    
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  const connection = await pool.promise().getConnection();
  
  try {
    const body = await request.json();
    const { purchase, items } = body; 

    // เริ่ม Transaction
    await connection.beginTransaction();

    // 1. บันทึกข้อมูลลงตาราง purchases (เอาแค่ 7 columns ตามที่ระบุ)
    const [purchaseResult] = await connection.query(
      `INSERT INTO purchases (
        po_number, 
        supplier_id, 
        user_id, 
        purchase_date, 
        total_amount, 
        status, 
        remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`, // มี 7 เครื่องหมายคำถาม
      [
        purchase.po_number,
        purchase.supplier_id ? Number(purchase.supplier_id) : null,
        purchase.user_id ? Number(purchase.user_id) : null,
        purchase.purchase_date || null,
        purchase.total_amount,
        purchase.status,
        purchase.remarks
      ]
    );

    const purchaseId = purchaseResult.insertId;

    // 2. บันทึกรายการสินค้าลงตาราง purchase_items
    if (items && items.length > 0) {
      const itemValues = items.map(item => [
        purchaseId,
        item.product_id,
        item.quantity,
        item.unit_price,
        item.total_price
      ]);

      await connection.query(
        `INSERT INTO purchaseitems (
          purchase_id, 
          product_id, 
          quantity, 
          unit_price, 
          total_price
        ) VALUES ?`,
        [itemValues]
      );
    }

    // ยืนยันการบันทึก
    await connection.commit();

    return NextResponse.json({ message: "Success", id: purchaseId });

  } catch (error) {
    // หากเกิดข้อผิดพลาดให้ Rollback
    await connection.rollback();
    console.error("Database Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    // คืน Connection
    connection.release();
  }
}