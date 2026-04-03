"use server";
import { pool } from '@/utils/db';

export async function GET() {
  try {
    const [products] = await pool.promise().query(
      'SELECT COUNT(*) as count FROM products'
    );

    const stats = {
      totalProducts: products[0]?.count || 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0
    };

    return Response.json(stats);
  } catch (error) {
    console.error('Dashboard API error:', error);

    return Response.json({
      totalProducts: 0,
      totalOrders: 0,
      totalUsers: 0,
      totalRevenue: 0
    });
  }
}