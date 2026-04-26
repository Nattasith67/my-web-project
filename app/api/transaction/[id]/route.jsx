import { NextResponse } from 'next/server';
import { pool } from '@/utils/db';

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