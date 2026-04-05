import { NextResponse } from 'next/server';
import { pool } from '@/utils/db';

// GET สินค้าตัวเดียว
export async function GET(_request, { params }) {
  const { id } = await params;
  const promisePool = pool.promise();
  
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM suppliers WHERE id = ?', [id]
    );
    
    if (rows.length === 0) {
      return NextResponse.json(
        { message: 'Supplier not found' }, 
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
    const { name, phone, email, address } = body;
    
    const promisePool = pool.promise();
    
    const [exist] = await promisePool.query(
      'SELECT id FROM suppliers WHERE id = ?', [id]
    );
    
    if (exist.length === 0) {
      return NextResponse.json({ message: "Not Found" }, { status: 404 });
    }

    await promisePool.query(
      'UPDATE suppliers SET name = ?, phone = ?, email = ?, address = ? WHERE id = ?',
      [name, phone ?? 0, email ?? "", address ?? "", id]
    );

    const [rows] = await promisePool.query(
      'SELECT * FROM suppliers WHERE id = ?', [id]
    );
    return NextResponse.json(rows[0]);
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}