import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

// GET สินค้าทั้งหมด
export async function GET() {
  try {
    const promisePool = pool.promise();
    const [rows] = await promisePool.query("SELECT * FROM products");
    return NextResponse.json(rows); 
  } catch (e) {
    console.error(e);
    return NextResponse.json(
        { error: e.message },
        { status: 500 }
    );
  }
}

// POST สร้างสินค้าใหม่
export async function POST(request) {
  try {
    const body = await request.json();
    const { name, description, price, stock_quantity, category, image_url } = body;
    
    const [result] = await pool.promise().query(
      'INSERT INTO products (name, description, price, stock_quantity, category, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, stock_quantity, category, image_url]
    );
    
    return NextResponse.json({ 
      message: "Product created successfully",
      id: result.insertId 
    });
  } catch (error) {
    console.error('Error in POST:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}