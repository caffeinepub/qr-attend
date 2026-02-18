import { useState } from 'react';
import { useGetAllSessions, useCreateSession } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Plus, Calendar, Clock, Copy, Check, QrCode } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSessionsPage() {
  const { data: sessions, isLoading } = useGetAllSessions();
  const createSession = useCreateSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.endDate}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      toast.error('End time must be after start time');
      return;
    }

    const startTime = BigInt(startDateTime.getTime()) * BigInt(1_000_000);
    const endTime = BigInt(endDateTime.getTime()) * BigInt(1_000_000);

    try {
      await createSession.mutateAsync({
        name: formData.name,
        startTime,
        endTime,
      });
      toast.success('Session created successfully');
      setIsDialogOpen(false);
      setFormData({ name: '', startDate: '', startTime: '', endDate: '', endTime: '' });
    } catch (error) {
      toast.error('Failed to create session');
      console.error(error);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1_000_000)));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1_000_000)));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Manage Sessions</h1>
            <p className="text-muted-foreground">Create and view sessions</p>
          </div>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Sessions</h1>
          <p className="text-muted-foreground">Create and view sessions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Session
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Session</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Session Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Monday Morning Class"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={createSession.isPending}>
                {createSession.isPending ? 'Creating...' : 'Create Session'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!sessions || sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No sessions yet. Create your first session!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {sessions
            .sort((a, b) => Number(b.startTime - a.startTime))
            .map((session) => (
              <SessionCard key={session.id.toString()} session={session} />
            ))}
        </div>
      )}
    </div>
  );
}

function SessionCard({ session }: { session: any }) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1_000_000)));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1_000_000)));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(session.qrPayload);
    setCopied(true);
    toast.success('QR code copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate QR code URL using a free QR code API
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(session.qrPayload)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{session.name}</CardTitle>
        <CardDescription className="flex flex-col gap-1 text-sm">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {formatDate(session.startTime)} - {formatDate(session.endTime)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {formatTime(session.startTime)} - {formatTime(session.endTime)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => setShowQR(!showQR)}>
            <QrCode className="w-4 h-4 mr-2" />
            {showQR ? 'Hide QR Code' : 'Show QR Code'}
          </Button>
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
        {showQR && (
          <div className="flex flex-col items-center gap-2 p-4 bg-muted rounded-lg">
            <img 
              src={qrCodeUrl} 
              alt="QR Code" 
              className="bg-white p-2 rounded"
              width={256}
              height={256}
            />
            <p className="text-xs text-muted-foreground font-mono break-all text-center">{session.qrPayload}</p>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Scan this QR code or copy the code above to check in
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
