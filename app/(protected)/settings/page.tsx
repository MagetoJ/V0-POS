'use client';

import { useState, useEffect } from 'react';
import { SidebarNav } from '@/components/sidebar-nav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/lib/auth-context';
import {
  Lock,
  Mail,
  Phone,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isOnlineEnabled, setIsOnlineEnabled] = useState(false);
  const [onlineSlug, setOnlineSlug] = useState('mariahavens');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          setIsOnlineEnabled(data.is_online_enabled);
          setOnlineSlug(data.online_slug);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleToggleOnlineStore = async (enabled: boolean) => {
    setIsOnlineEnabled(enabled);
    try {
      const response = await fetch('/api/settings/online-store', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });
      if (!response.ok) {
        throw new Error('Failed to update setting');
      }
    } catch (error) {
      console.error('Error updating online store setting:', error);
      // Revert state if failed
      setIsOnlineEnabled(!enabled);
    }
  };

  const handleUpdateSlug = async () => {
    try {
      const response = await fetch('/api/settings/online-store', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug: onlineSlug }),
      });
      if (response.ok) {
        setSuccessMessage('Store link updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        throw new Error('Failed to update slug');
      }
    } catch (error) {
      console.error('Error updating slug:', error);
      alert('Failed to update store link');
    }
  };
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
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />

      <main className="flex-1 lg:ml-64">
        <div className="p-4 lg:p-8 space-y-8">
          <div className="pt-12 lg:pt-0">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
              Settings
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your profile and security settings
            </p>
          </div>

          {successMessage && (
            <Alert className="bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}

          {/* Profile Information */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground">Profile Information</CardTitle>
              <CardDescription>View and manage your employee profile</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                {/* Read-only fields */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Employee ID
                  </label>
                  <Input
                    type="text"
                    value={user?.employeeId || ''}
                    disabled
                    className="bg-background border-input text-foreground disabled:opacity-60"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-muted-foreground">
                    Role
                  </label>
                  <Input
                    type="text"
                    value={user?.role.charAt(0).toUpperCase() + user?.role.slice(1) || ''}
                    disabled
                    className="bg-background border-input text-foreground disabled:opacity-60"
                  />
                </div>

                {/* Editable fields */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full"
                >
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription>Change your PIN for account security</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="currentPin" className="block text-sm font-medium text-muted-foreground">
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
                      className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="newPin" className="block text-sm font-medium text-muted-foreground">
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
                      className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmPin" className="block text-sm font-medium text-muted-foreground">
                    Confirm New PIN
                  </label>
                  <Input
                    id="confirmPin"
                    name="confirmPin"
                    type={showPin ? 'text' : 'password'}
                    value={formData.confirmPin}
                    onChange={handleInputChange}
                    placeholder="Confirm new PIN"
                    className="bg-background border-input text-foreground focus:border-primary focus:ring-primary/20"
                  />
                </div>

                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full"
                >
                  Change PIN
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* System Settings */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground">System Settings</CardTitle>
              <CardDescription>Configure core system features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-foreground">Showcase Inventory Online</Label>
                  <p className="text-sm text-muted-foreground">
                    When enabled, your inventory will be visible on your public website.
                  </p>
                </div>
                <Switch 
                  checked={isOnlineEnabled} 
                  onCheckedChange={handleToggleOnlineStore} 
                />
              </div>

              <div className="pt-4 border-t border-border space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="onlineSlug" className="text-foreground">Unique Online Link</Label>
                  <div className="flex gap-2">
                    <div className="flex-1 flex items-center bg-background border border-input rounded-md px-3 text-muted-foreground text-sm overflow-hidden">
                      <span className="shrink-0">menu.mariahavens.com/</span>
                      <input
                        id="onlineSlug"
                        type="text"
                        value={onlineSlug}
                        onChange={(e) => setOnlineSlug(e.target.value)}
                        className="flex-1 bg-transparent border-none outline-none text-foreground ml-1"
                      />
                    </div>
                    <Button onClick={handleUpdateSlug} size="sm" variant="secondary">
                      Update Link
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is the unique URL where customers can view your live inventory.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card className="border-border bg-card/50">
            <CardHeader>
              <CardTitle className="text-foreground">Account Information</CardTitle>
              <CardDescription>Additional account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Store Location</p>
                  <p className="text-sm font-medium text-foreground mt-1">Store #{user?.storeId}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Hire Date</p>
                  <p className="text-sm font-medium text-foreground mt-1">
                    {user?.hireDate ? new Date(user.hireDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Status</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400 mt-1 capitalize">
                    {user?.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Account Type</p>
                  <p className="text-sm font-medium text-foreground mt-1 capitalize">
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
