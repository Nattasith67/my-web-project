import { NextResponse } from "next/server";
import { pool } from "@/utils/db";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const promisePool = pool.promise();

    const [rows] = await promisePool.query(
      "SELECT * FROM customers WHERE id = ?", [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error("Error in GET:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const promisePool = pool.promise();
    
    const [exist] = await promisePool.query(
      "SELECT id FROM customers WHERE id = ?", [id]
    );
    
    if (exist.length === 0) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    await promisePool.query(
      "DELETE FROM customers WHERE id = ?", [id]
    );
    
    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
