import { NextRequest, NextResponse } from 'next/server';
import type { Performance } from '@/lib/types';

// Mock performance data
const mockPerformanceData: Record<string, Performance[]> = {
  EMP001: [
    {
      employeeId: 'EMP001',
      date: new Date(Date.now() - 6 * 86400000).toISOString().split('T')[0],
      totalSales: 2800,
      transactionCount: 18,
      averageTransactionValue: 155.56,
      customerSatisfaction: 4.2,
      voidCount: 1,
      discountCount: 3,
      targetMet: true,
    },
    {
      employeeId: 'EMP001',
      date: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
      totalSales: 3200,
      transactionCount: 22,
      averageTransactionValue: 145.45,
      customerSatisfaction: 4.4,
      voidCount: 0,
      discountCount: 4,
      targetMet: true,
    },
    {
      employeeId: 'EMP001',
      date: new Date(Date.now() - 4 * 86400000).toISOString().split('T')[0],
      totalSales: 2900,
      transactionCount: 19,
      averageTransactionValue: 152.63,
      customerSatisfaction: 4.1,
      voidCount: 2,
      discountCount: 2,
      targetMet: false,
    },
    {
      employeeId: 'EMP001',
      date: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
      totalSales: 3500,
      transactionCount: 25,
      averageTransactionValue: 140,
      customerSatisfaction: 4.6,
      voidCount: 1,
      discountCount: 5,
      targetMet: true,
    },
    {
      employeeId: 'EMP001',
      date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
      totalSales: 4100,
      transactionCount: 28,
      averageTransactionValue: 146.43,
      customerSatisfaction: 4.8,
      voidCount: 0,
      discountCount: 6,
      targetMet: true,
    },
    {
      employeeId: 'EMP001',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      totalSales: 3800,
      transactionCount: 26,
      averageTransactionValue: 146.15,
      customerSatisfaction: 4.5,
      voidCount: 1,
      discountCount: 4,
      targetMet: true,
    },
    {
      employeeId: 'EMP001',
      date: new Date().toISOString().split('T')[0],
      totalSales: 3200,
      transactionCount: 21,
      averageTransactionValue: 152.38,
      customerSatisfaction: 4.3,
      voidCount: 1,
      discountCount: 3,
      targetMet: true,
    },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const employeeId = request.nextUrl.searchParams.get('employeeId');
    const dateFrom = request.nextUrl.searchParams.get('dateFrom');
    const dateTo = request.nextUrl.searchParams.get('dateTo');

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    let performanceData = mockPerformanceData[employeeId] || [];

    // Filter by date range if provided
    if (dateFrom && dateTo) {
      performanceData = performanceData.filter(
        perf => perf.date >= dateFrom && perf.date <= dateTo
      );
    }

    // Calculate aggregates
    const totalSales = performanceData.reduce(
      (sum, perf) => sum + perf.totalSales,
      0
    );
    const totalTransactions = performanceData.reduce(
      (sum, perf) => sum + perf.transactionCount,
      0
    );
    const avgSatisfaction =
      performanceData.length > 0
        ? performanceData.reduce(
            (sum, perf) => sum + perf.customerSatisfaction,
            0
          ) / performanceData.length
        : 0;
    const targetMetCount = performanceData.filter(
      perf => perf.targetMet
    ).length;

    return NextResponse.json({
      performance: performanceData,
      summary: {
        totalSales: totalSales.toFixed(2),
        totalTransactions,
        averageTransactionValue:
          totalTransactions > 0
            ? (totalSales / totalTransactions).toFixed(2)
            : 0,
        averageSatisfaction: avgSatisfaction.toFixed(1),
        targetAchievementRate: (
          (targetMetCount / performanceData.length) *
          100
        ).toFixed(1),
        daysInPeriod: performanceData.length,
      },
    });
  } catch (error) {
    console.error('[Performance Fetch Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance data' },
      { status: 500 }
    );
  }
}
