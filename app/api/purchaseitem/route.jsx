import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

// GET ดึงข้อมูลการสั่งซื้อและดึงชื่อจาก FK
export async function GET() {
  try {
    // ใช้คำสั่ง JOIN เพื่อดึงชื่อจากตาราง suppliers และ users
    const sql = `
      SELECT 
        p.id, 
        p.po_number, 
        p.purchase_date, 
        p.total_amount, 
        p.status,
        p.remarks,
        s.name AS supplier_name,
        u.username AS user_name
      FROM purchase p
      LEFT JOIN suppliers s ON p.supplier_id = s.id
      LEFT JOIN users u ON p.user_id = u.id
    `;

    const [rows] = await pool.promise().query(sql);

    return NextResponse.json({
      message: "Data fetched successfully",
      data: rows, // ข้อมูลที่ส่งกลับไปจะมี supplier_name และ user_name ให้ใช้งาน
    });
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
// POST สร้างสินค้าใหม่
// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { name, description, price, stock_quantity, category_id, image_url } =
//       body;

//     const [result] = await pool
//       .promise()
//       .query(
//         "INSERT INTO products (name, description, price, stock_quantity, category_id, image_url) VALUES (?, ?, ?, ?, ?, ?)",
//         [name, description, price, stock_quantity, category_id, image_url],
//       );

//     return NextResponse.json({
//       message: "Product created successfully",
//       id: result.insertId,
//     });
//   } catch (error) {
//     console.error("Error in POST:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
