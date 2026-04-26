"use server";
import { pool } from '@/utils/db';

export async function GET() {
  try {
    const [products] = await pool.promise().query(
      'SELECT COUNT(*) as count FROM products'
    );
    
    const [outOfStock] = await pool.promise().query(
      'SELECT COUNT(*) as count FROM products WHERE stock_quantity = 0'
    );

    const [lowStock] = await pool.promise().query(
      'SELECT COUNT(*) as count FROM products WHERE stock_quantity < 10'
    );

    const [users] = await pool.promise().query(
      'SELECT COUNT(*) as count FROM users'
    );

    const stats = {
      totalProducts: products[0]?.count || 0,
      outOfStock: outOfStock[0]?.count || 0,
      lowStock: lowStock[0]?.count || 0,
      users: users[0]?.count || 0,
    };

    return Response.json(stats);
  } catch (error) {
    console.error('Dashboard API error:', error);
  }
}