'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Mail, 
  Phone,
  Calendar
} from 'lucide-react';

const MOCK_STAFF = [
  {
    id: '1',
    employeeId: 'EMP001',
    name: 'Sarah Johnson',
    role: 'cashier',
    email: 'sarah.johnson@retailco.com',
    phone: '555-0101',
    status: 'active',
    hireDate: '2022-03-15',
  },
  {
    id: '2',
    employeeId: 'EMP002',
    name: 'Michael Chen',
    role: 'supervisor',
    email: 'michael.chen@retailco.com',
    phone: '555-0102',
    status: 'active',
    hireDate: '2021-06-01',
  },
  {
    id: '3',
    employeeId: 'EMP003',
    name: 'Jennifer Martinez',
    role: 'manager',
    email: 'jennifer.martinez@retailco.com',
    phone: '555-0103',
    status: 'active',
    hireDate: '2020-01-10',
  },
  {
    id: '4',
    employeeId: 'EMP004',
    name: 'David Wilson',
    role: 'cashier',
    email: 'david.wilson@retailco.com',
    phone: '555-0104',
    status: 'active',
    hireDate: '2023-01-20',
  },
  {
    id: '5',
    employeeId: 'EMP005',
    name: 'Emily Davis',
    role: 'housekeeping',
    email: 'emily.davis@retailco.com',
    phone: '555-0105',
    status: 'active',
    hireDate: '2023-05-12',
  }
];

export default function StaffPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStaff = MOCK_STAFF.filter(member => 
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-slate-100 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-500" />
                Staff Management
              </h1>
              <p className="text-slate-400 mt-2">
                Manage employee profiles, roles, and system permissions.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
              <UserPlus className="w-4 h-4" />
              Add New Employee
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Total Staff</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-100">{MOCK_STAFF.length}</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Active Shifts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-400">8</p>
              </CardContent>
            </Card>
            <Card className="border-slate-800 bg-slate-900/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">Open Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-orange-400">3</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input 
                placeholder="Search by name or ID..." 
                className="pl-10 bg-slate-900/50 border-slate-700 text-slate-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" className="border-slate-700 text-slate-300 gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>

          {/* Staff Table */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-slate-800">
                  <TableRow className="hover:bg-transparent border-slate-800">
                    <TableHead className="text-slate-400">Employee</TableHead>
                    <TableHead className="text-slate-400">Role</TableHead>
                    <TableHead className="text-slate-400">Status</TableHead>
                    <TableHead className="text-slate-400">Hire Date</TableHead>
                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStaff.map((member) => (
                    <TableRow key={member.id} className="border-slate-800 hover:bg-slate-800/30">
                      <TableCell>
                        <div>
                          <p className="font-medium text-slate-100">{member.name}</p>
                          <p className="text-xs text-slate-500">{member.employeeId}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="w-3 h-3 text-blue-400" />
                          <span className="capitalize text-slate-300">{member.role}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/10">
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3 h-3" />
                          {member.hireDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
