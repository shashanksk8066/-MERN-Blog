import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'register' | 'admin';
  onModeChange: (mode: 'login' | 'register' | 'admin') => void;
}

const handleAdminLogin = () => {
  window.location.href = "https://admin-bay-zeta.vercel.app"; // Redirect to admin login page
};

const AuthModal = ({ isOpen, onClose, mode, onModeChange }: AuthModalProps) => {
  const { login, register, admin } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(formData.email, formData.password);
        toast({
          title: "Welcome back!",
          description: "You've been successfully logged in.",
        });
      } else if (mode === 'admin') {
        await admin(formData.email, formData.password); // assuming `admin()` is defined in AuthContext
        toast({
          title: "Admin Login Successful",
          description: "You are now logged in as admin.",
        });
      } else {
        await register(formData.name, formData.email, formData.password);
        toast({
          title: "Account created!",
          description: "Welcome to ModernBlog.",
        });
      }
      onClose();
      setFormData({ name: '', email: '', password: '' });
    } catch (error) {
      toast({
        title: "Error",
        description:
          mode === 'register'
            ? "Registration failed"
            : mode === 'admin'
            ? "Invalid admin credentials"
            : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'login'
              ? 'Welcome back'
              : mode === 'admin'
              ? 'Admin Login'
              : 'Create an account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'login'
              ? 'Enter your credentials to access your account'
              : mode === 'admin'
              ? 'Enter admin credentials to access the dashboard'
              : 'Sign up to start commenting and posting'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Sign In'
              : mode === 'admin'
              ? 'Admin Login'
              : 'Create Account'}
          </Button>
        </form>

        <div className="text-center">
          {mode === 'login' && (
            <>
              <Button variant="link" onClick={() => onModeChange('register')}>
                Don't have an account? Sign up
              </Button>
              <Button variant="link" onClick={handleAdminLogin}>
                Login as Admin
              </Button>
            </>
          )}

          {mode === 'register' && (
            <>
              <Button variant="link" onClick={() => onModeChange('login')}>
                Already have an account? Sign in
              </Button>
              <Button variant="link" onClick={handleAdminLogin}>
                Login as Admin
              </Button>
            </>
          )}

          {mode === 'admin' && (
            <>
              <Button variant="link" onClick={() => onModeChange('login')}>
                Back to User Login
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
