'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lock, AlertCircle, Loader2, Monitor } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [employeeId, setEmployeeId] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickPOSLoading, setIsQuickPOSLoading] = useState(false);

  const performLogin = async (id: string, p: string) => {
    setError('');
    const loadingState = id === 'EMP001' && p === '1234' ? setIsQuickPOSLoading : setIsLoading;
    loadingState(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId: id.toUpperCase(),
          pin: p,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Login failed. Please try again.');
        loadingState(false);
        return;
      }

      // Update auth context state and localStorage
      login(data);
      
      // Redirect to dashboard
      router.push('/dashboard');
    } catch {
      setError('An error occurred. Please try again.');
      loadingState(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await performLogin(employeeId, pin);
  };

  const handleQuickPOS = async () => {
    setEmployeeId('EMP001');
    setPin('1234');
    await performLogin('EMP001', '1234');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10 border-border bg-card/50 backdrop-blur-sm shadow-2xl">
        <CardHeader className="space-y-3 pb-6">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-lg">
              <Lock className="w-6 h-6 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold text-foreground">
            Maria Havens POS
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Employee Login
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <Alert className="bg-destructive/10 border-destructive/20 text-destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <label htmlFor="employeeId" className="block text-sm font-medium text-foreground/80">
                Employee ID
              </label>
              <Input
                id="employeeId"
                type="text"
                placeholder="e.g., EMP001"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value.toUpperCase())}
                disabled={isLoading}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-1">
                Try: EMP001 (Cashier), EMP003 (Manager), EMP006 (Waiter), EMP007 (Accounts)
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="pin" className="block text-sm font-medium text-foreground/80">
                PIN
              </label>
              <Input
                id="pin"
                type="password"
                placeholder="Enter your PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                disabled={isLoading}
                className="bg-background border-input text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
              />
              <p className="text-xs text-muted-foreground mt-1">
                PINs: 1234, 9012, 1111, or 2222
              </p>
            </div>

            <Button
              type="submit"
              disabled={isLoading || isQuickPOSLoading || !employeeId || !pin}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={isLoading || isQuickPOSLoading}
              onClick={handleQuickPOS}
              className="w-full border-input text-foreground hover:bg-accent hover:text-accent-foreground font-medium py-2 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              {isQuickPOSLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading POS...
                </>
              ) : (
                <>
                  <Monitor className="w-4 h-4" />
                  Quick POS Access
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center">
              For demo purposes, use the credentials shown above.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
