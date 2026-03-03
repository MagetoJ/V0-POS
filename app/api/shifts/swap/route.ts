import { NextRequest, NextResponse } from 'next/server';
import type { ShiftSwapRequest } from '@/lib/types';

const mockSwapRequests: Map<string, ShiftSwapRequest> = new Map();

export async function POST(request: NextRequest) {
  try {
    const { employeeId, targetShiftId, reason } = await request.json();

    if (!employeeId || !targetShiftId) {
      return NextResponse.json(
        { error: 'Employee ID and target shift ID are required' },
        { status: 400 }
      );
    }

    const swapRequest: ShiftSwapRequest = {
      id: `swap-${Date.now()}`,
      employeeId,
      targetShiftId,
      status: 'pending',
      reason,
      requestedAt: new Date().toISOString(),
    };

    mockSwapRequests.set(swapRequest.id, swapRequest);

    return NextResponse.json({
      success: true,
      request: swapRequest,
      message: 'Shift swap request submitted successfully',
    });
  } catch (error) {
    console.error('[Swap Request Error]', error);
    return NextResponse.json(
      { error: 'Failed to submit shift swap request' },
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

    const requests = Array.from(mockSwapRequests.values()).filter(
      req => req.employeeId === employeeId
    );

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('[Swap Request Fetch Error]', error);
    return NextResponse.json(
      { error: 'Failed to fetch shift swap requests' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { requestId, status } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    const swapRequest = mockSwapRequests.get(requestId);
    if (!swapRequest) {
      return NextResponse.json(
        { error: 'Shift swap request not found' },
        { status: 404 }
      );
    }

    swapRequest.status = status;
    mockSwapRequests.set(requestId, swapRequest);

    return NextResponse.json({
      success: true,
      request: swapRequest,
    });
  } catch (error) {
    console.error('[Swap Request Update Error]', error);
    return NextResponse.json(
      { error: 'Failed to update shift swap request' },
      { status: 500 }
    );
  }
}
