import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function GET() {
  try {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
      "SELECT id, name FROM categories",
    );
    return NextResponse.json(rows);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;


    const [result] = await pool
      .promise()
      .query("INSERT INTO categories (name) VALUES (?)", [name]);

    return NextResponse.json({
      message: "Category created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
