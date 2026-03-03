'use client';

import { useState } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';
import {
  Lock,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    currentPin: '',
    newPin: '',
    confirmPin: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPin !== formData.confirmPin) {
      alert('New PINs do not match');
      return;
    }
    if (formData.newPin.length < 4) {
      alert('PIN must be at least 4 digits');
      return;
    }
    setSuccessMessage('PIN changed successfully');
    setFormData(prev => ({ ...prev, currentPin: '', newPin: '', confirmPin: '' }));
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('Profile updated successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="flex min-h-screen bg-slate-950">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-100">
              Settings
            </h1>
            <p className="text-slate-400 mt-2">
              Manage your profile and security settings
            </p>
          </div>

          {successMessage && (
            <Alert className="bg-green-950/20 border-green-900/40 text-green-100">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Profile Information */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Profile Information</CardTitle>
              <CardDescription>View and manage your employee profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Read-only fields */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Employee ID
                  </label>
                  <Input
                    type="text"
                    value={user?.employeeId || ''}
                    disabled
                    className="bg-slate-900/50 border-slate-700 text-slate-100 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-slate-300">
                    Role
                  </label>
                  <Input
                    type="text"
                    value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1) || ''}
                    disabled
                    className="bg-slate-900/50 border-slate-700 text-slate-100 disabled:opacity-60"
                  />
                </div>

                {/* Editable fields */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100 flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Change your PIN for account security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPin" className="block text-sm font-medium text-slate-300">
                    Current PIN
                  </label>
                  <div className="relative">
                    <Input
                      id="currentPin"
                      name="currentPin"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.currentPin}
                      onChange={handleInputChange}
                      placeholder="Enter current PIN"
                      className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPin" className="block text-sm font-medium text-slate-300">
                    New PIN
                  </label>
                  <div className="relative">
                    <Input
                      id="newPin"
                      name="newPin"
                      type={showPin ? 'text' : 'password'}
                      value={formData.newPin}
                      onChange={handleInputChange}
                      placeholder="Enter new PIN (4+ digits)"
                      className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-slate-300">
                    Confirm New PIN
                  </label>
                  <Input
                    id="confirmPin"
                    name="confirmPin"
                    type={showPin ? 'text' : 'password'}
                    value={formData.confirmPin}
                    onChange={handleInputChange}
                    placeholder="Confirm new PIN"
                    className="bg-slate-900/50 border-slate-700 text-slate-100 focus:border-blue-500 focus:ring-blue-500/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium w-full"
                >
                  Change PIN
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border-slate-800 bg-slate-900/50">
            <CardHeader>
              <CardTitle className="text-slate-100">Account Information</CardTitle>
              <CardDescription>Additional account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Store Location</p>
                  <p className="text-sm font-medium text-slate-100 mt-1">Store #{user?.storeId}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Hire Date</p>
                  <p className="text-sm font-medium text-slate-100 mt-1">
                    {user?.hireDate ? new Date(user.hireDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Account Status</p>
                  <p className="text-sm font-medium text-green-400 mt-1 capitalize">
                    {user?.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Account Type</p>
                  <p className="text-sm font-medium text-slate-100 mt-1 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
