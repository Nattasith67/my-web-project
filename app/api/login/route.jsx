import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const promisePool = pool.promise();
    const [rows] = await promisePool.query(
      "SELECT id, username, password FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    const user = rows[0];

    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }

    return NextResponse.json({ 
      message: "Login successful", 
      user: { 
        id: user.id, 
        username: user.username 
      } 
    });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
