import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { useSaveCallerUserProfile, useSaveCallerUserRole } from '../hooks/useCurrentUser';
import { toast } from 'sonner';
import { useNavigate } from '@tanstack/react-router';
import { QrCode, GraduationCap, BookOpen } from 'lucide-react';
import { UserRole } from '../backend';

export default function RegistrationPage() {
  const [name, setName] = useState('');
  const [selectedRole, setSelectedRole] = useState<'Student' | 'Teacher' | null>(null);
  const saveProfile = useSaveCallerUserProfile();
  const saveRole = useSaveCallerUserRole();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!selectedRole) {
      toast.error('Please select your role');
      return;
    }

    try {
      // Save profile first
      await saveProfile.mutateAsync({ name: name.trim() });
      
      // Map UI role to backend role
      const backendRole = selectedRole === 'Teacher' ? UserRole.admin : UserRole.user;
      await saveRole.mutateAsync(backendRole);
      
      toast.success('Registration completed successfully');
      navigate({ to: '/' });
    } catch (error) {
      toast.error('Failed to complete registration');
      console.error(error);
    }
  };

  const isPending = saveProfile.isPending || saveRole.isPending;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to QR Attend</h1>
          <p className="text-muted-foreground">Let's set up your account</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registration</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  autoFocus
                />
              </div>

              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('Student')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'Student'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <GraduationCap className={`w-8 h-8 ${selectedRole === 'Student' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium ${selectedRole === 'Student' ? 'text-primary' : 'text-foreground'}`}>
                      Student
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('Teacher')}
                    className={`flex flex-col items-center gap-3 p-4 rounded-lg border-2 transition-all ${
                      selectedRole === 'Teacher'
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <BookOpen className={`w-8 h-8 ${selectedRole === 'Teacher' ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium ${selectedRole === 'Teacher' ? 'text-primary' : 'text-foreground'}`}>
                      Teacher
                    </span>
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                {isPending ? 'Completing Registration...' : 'Complete Registration'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
