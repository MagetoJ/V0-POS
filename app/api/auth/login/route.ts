import { NextRequest, NextResponse } from 'next/server';
import type { AuthSession, User } from '@/lib/types';

// Mock employee database
const MOCK_EMPLOYEES: Record<string, { pin: string; user: User }> = {
  'EMP001': {
    pin: '1234',
    user: {
      id: '1',
      employeeId: 'EMP001',
      name: 'Sarah Johnson',
      role: 'cashier',
      storeId: 'STORE001',
      email: 'sarah.johnson@retailco.com',
      phone: '555-0101',
      hireDate: '2022-03-15',
      status: 'active',
    }
  },
  'EMP002': {
    pin: '5678',
    user: {
      id: '2',
      employeeId: 'EMP002',
      name: 'Michael Chen',
      role: 'supervisor',
      storeId: 'STORE001',
      email: 'michael.chen@retailco.com',
      phone: '555-0102',
      hireDate: '2021-06-01',
      status: 'active',
    }
  },
  'EMP003': {
    pin: '9012',
    user: {
      id: '3',
      employeeId: 'EMP003',
      name: 'Jennifer Martinez',
      role: 'manager',
      storeId: 'STORE001',
      email: 'jennifer.martinez@retailco.com',
      phone: '555-0103',
      hireDate: '2020-01-10',
      status: 'active',
    }
  },
  'EMP004': {
    pin: '3456',
    user: {
      id: '4',
      employeeId: 'EMP004',
      name: 'David Wilson',
      role: 'cashier',
      storeId: 'STORE001',
      email: 'david.wilson@retailco.com',
      phone: '555-0104',
      hireDate: '2023-01-20',
      status: 'active',
    }
  },
  'EMP005': {
    pin: '7890',
    user: {
      id: '5',
      employeeId: 'EMP005',
      name: 'Emily Davis',
      role: 'housekeeping',
      storeId: 'STORE001',
      email: 'emily.davis@retailco.com',
      phone: '555-0105',
      hireDate: '2023-05-12',
      status: 'active',
    }
  },
  'EMP006': {
    pin: '1111',
    user: {
      id: '6',
      employeeId: 'EMP006',
      name: 'Robert Brown',
      role: 'waiter',
      storeId: 'STORE001',
      email: 'robert.brown@retailco.com',
      phone: '555-0106',
      hireDate: '2022-11-05',
      status: 'active',
    }
  },
  'EMP007': {
    pin: '2222',
    user: {
      id: '7',
      employeeId: 'EMP007',
      name: 'Alice Green',
      role: 'accounts',
      storeId: 'STORE001',
      email: 'alice.green@retailco.com',
      phone: '555-0107',
      hireDate: '2021-02-20',
      status: 'active',
    }
  },
};

export async function POST(request: NextRequest) {
  try {
    const { employeeId, pin } = await request.json();

    // Validate input
    if (!employeeId || !pin) {
      return NextResponse.json(
        { error: 'Employee ID and PIN are required' },
        { status: 400 }
      );
    }

    // Check credentials (case-insensitive employee ID)
    const employee = MOCK_EMPLOYEES[employeeId.toUpperCase()];
    
    if (!employee || employee.pin !== pin) {
      return NextResponse.json(
        { error: 'Invalid Employee ID or PIN' },
        { status: 401 }
      );
    }

    if (employee.user.status !== 'active') {
      return NextResponse.json(
        { error: 'This employee account is inactive' },
        { status: 403 }
      );
    }

    // Create session token (in production, use JWT with proper signing)
    const token = Buffer.from(JSON.stringify({
      userId: employee.user.id,
      employeeId: employee.user.employeeId,
      role: employee.user.role,
      iat: Date.now(),
    })).toString('base64');

    const session: AuthSession = {
      user: employee.user,
      token,
      expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
    };

    const response = NextResponse.json(session);
    
    // Set secure HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('[Auth Error]', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}
