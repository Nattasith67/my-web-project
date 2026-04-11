import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

// GET หมวดหมู่ทั้งหมด
export async function GET() {
  try {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
      "SELECT id, username, password FROM `users`",
    );
    console.log("Users from DB:", rows);

    return NextResponse.json(rows);
  } catch (e) {
    console.error("Error in GET Users:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// POST สร้างหมวดหมู่ใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;


    const [result] = await pool
      .promise()
      .query("INSERT INTO `user` (username, password) VALUES (?, ?)", [username, password]);

    console.log("Insert result:", result); // debug

    return NextResponse.json({
      message: "Username and password created successfully",
      id: result.insertId,
    });
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
