import { NextRequest, NextResponse } from 'next/server';
import type { Shift } from '@/lib/types';

// Mock shift database
const mockShifts: Record<string, Shift> = {
  'shift-today': {
    id: 'shift-today',
    employeeId: 'EMP001',
    storeId: 'STORE001',
    clockInTime: new Date().toISOString(),
    isActive: true,
  },
};

export async function POST(request: NextRequest) {
  try {
    const { employeeId, action } = await request.json();

    if (!employeeId || !action) {
      return NextResponse.json(
        { error: 'Employee ID and action are required' },
        { status: 400 }
      );
    }

    if (action === 'clockin') {
      const shift: Shift = {
        id: `shift-${Date.now()}`,
        employeeId,
        storeId: 'STORE001',
        clockInTime: new Date().toISOString(),
        isActive: true,
      };

      return NextResponse.json({ success: true, shift });
    }

    if (action === 'clockout') {
      const shift = mockShifts['shift-today'];
      if (!shift) {
        return NextResponse.json(
          { error: 'No active shift found' },
          { status: 404 }
        );
      }

      shift.clockOutTime = new Date().toISOString();
      shift.isActive = false;
      const hoursWorked =
        (new Date(shift.clockOutTime).getTime() -
          new Date(shift.clockInTime).getTime()) /
        (1000 * 60 * 60);
      shift.totalHours = Math.round(hoursWorked * 100) / 100;

      return NextResponse.json({ success: true, shift });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('[Shift Error]', error);
    return NextResponse.json(
      { error: 'Failed to process shift action' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const employeeId = request.nextUrl.searchParams.get('employeeId');

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    const shifts = Object.values(mockShifts).filter(
      shift => shift.employeeId === employeeId
    );

    return NextResponse.json({ shifts });
  } catch (error) {
    console.error('[Shift Fetch Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch shifts' },
      { status: 500 }
    );
  }
}
