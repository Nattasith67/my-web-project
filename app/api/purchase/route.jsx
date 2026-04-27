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

    await connection.beginTransaction();

    const [purchaseResult] = await connection.query(
      `INSERT INTO purchases (
        po_number, supplier_id, user_id, purchase_date, total_amount, status, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        purchase.po_number,
        purchase.supplier_id,
        purchase.user_id,
        purchase.purchase_date,
        purchase.total_amount,
        purchase.status,
        purchase.remarks,
      ]
    );

    const purchaseId = purchaseResult.insertId;

    const values = items.map(item => [
      purchaseId,
      item.product_id,
      item.quantity,
      item.unit_price,
      item.total_price
    ]);

    await connection.query(
      `INSERT INTO purchaseitems (purchase_id, product_id, quantity, unit_price, total_price) VALUES ?`,
      [values]
    );

    await connection.commit();

    return NextResponse.json({
      message: "Created successfully",
      id: purchaseId,
    });

  } catch (error) {
    await connection.rollback();
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}