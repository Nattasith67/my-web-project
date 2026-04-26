import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function PATCH(request, { params }) {
  const connection = await pool.promise().getConnection();
  try {
    const { id } = await params; 
    const body = await request.json();
    const { status, user_id } = body;

    await connection.beginTransaction();

    const [currentData] = await connection.query(
      "SELECT status, user_id FROM purchases WHERE id = ?",
      [id]
    );

    if (currentData.length === 0) {
      await connection.rollback();
      return NextResponse.json({ error: "ไม่พบข้อมูลใบสั่งซื้อ" }, { status: 404 });
    }

    const oldStatus = currentData[0].status;
    const purchaseUserId = currentData[0].user_id;

    await connection.query(
      "UPDATE purchases SET status = ? WHERE id = ?",
      [status, id]
    );

    if (status === "Approved" && oldStatus !== "Approved") {
      const [purchaseItems] = await connection.query(
        "SELECT product_id, quantity FROM purchaseitems WHERE purchase_id = ?",
        [id]
      );

      for (const item of purchaseItems) {
        await connection.query(
          "UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?",
          [item.quantity, item.product_id]
        );
      }
    }

    await connection.query(
      `INSERT INTO purchase_transactions
      (purchase_id, user_id, action, status_from, status_to, created_at) 
      VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        id,
        user_id || purchaseUserId || 1,
        'APPROVE',
        oldStatus,
        status
      ]
    );

    await connection.commit();

    return NextResponse.json({ message: "อัปเดตสถานะและบันทึก Transaction สำเร็จ" });

  } catch (error) {
    await connection.rollback();
    console.error("Update Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await pool.promise().query("DELETE FROM purchases WHERE id = ?", [id]);
    return NextResponse.json({ message: "ลบสำเร็จ" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}