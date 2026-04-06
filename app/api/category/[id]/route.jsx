import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const promisePool = pool.promise();

    const [rows] = await promisePool.query(
      "SELECT * FROM categories WHERE id = ?", [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT แก้ไขหมวดหมู่
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    const promisePool = pool.promise();

    // เช็คว่ามี id นี้ไหม
    const [exist] = await promisePool.query(
      "SELECT id FROM categories WHERE id = ?",
      [id]
    );

    if (exist.length === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    await promisePool.query(
      'UPDATE categories SET name = ? WHERE id = ?',
      [name ?? "", id]
    );

    // ดึงข้อมูลใหม่
    const [rows] = await promisePool.query(
      "SELECT * FROM categories WHERE id = ?",
      [id]
    );

    return NextResponse.json(rows[0],);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}