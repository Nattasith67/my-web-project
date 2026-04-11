import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function GET() {
  try {
    const promisePool = pool.promise();

    const [rows] = await promisePool.query(
      `SELECT 
        pt.id,
        pt.purchase_id,
        pt.user_id,
        pt.action,
        pt.status_from,
        pt.status_to,
        pt.created_at,
        p.po_number,
        u.username
      FROM transactions pt
      LEFT JOIN purchases p ON pt.purchase_id = p.id
      LEFT JOIN users u ON pt.user_id = u.id
      ORDER BY pt.created_at DESC`
    );

    return NextResponse.json(rows);

  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "ไม่สามารถดึงข้อมูลประวัติได้: " + error.message }, 
      { status: 500 }
    );
  }
}