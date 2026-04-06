import { NextResponse } from 'next/server';
import { pool } from '@/utils/db';

// GET สินค้าตัวเดียว
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = pool.promise();
  
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM products WHERE id = ?', [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' }, 
        { status: 404 }
      );
    }
    
    return NextResponse.json(rows[0]);
  } catch (error) {
    console.error('Error in GET:', error);
    return NextResponse.json(
      { message: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

// PUT - แก้ไขข้อมูล
export async function PUT(request, { params }) { // เพิ่ม { params }
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, price, stock_quantity, category_id, image_url } = body;
    
    const promisePool = pool.promise();
    
    const [exist] = await promisePool.query(
      'SELECT id FROM products WHERE id = ?', [id]
    );
    
    if (exist.length === 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    await promisePool.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, category_id = ?, image_url = ? WHERE id = ?',
      [name, description ?? "", price ?? 0, stock_quantity ?? 0, category_id ?? "", image_url ?? "", id]
    );

    const [rows] = await promisePool.query(
      'SELECT * FROM products WHERE id = ?', [id]
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}