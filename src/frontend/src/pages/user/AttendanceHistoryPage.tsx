import { useGetCallerAttendance } from '../../hooks/useQueries';
import { useGetAllSessions } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Calendar, Clock } from 'lucide-react';

export default function AttendanceHistoryPage() {
  const { data: attendance, isLoading } = useGetCallerAttendance();
  const { data: sessions } = useGetAllSessions();

  const getSessionName = (sessionId: bigint) => {
    const session = sessions?.find((s) => s.id === sessionId);
    return session?.name || 'Unknown Session';
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
        <div>
          <h1 className="text-3xl font-bold">My Attendance</h1>
          <p className="text-muted-foreground">Your check-in history</p>
        </div>
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <p className="text-muted-foreground">Your check-in history</p>
      </div>

      {!attendance || attendance.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No attendance records yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {attendance
            .sort((a, b) => Number(b.checkInTime - a.checkInTime))
            .map((record, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{getSessionName(record.sessionId)}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(record.checkInTime)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatTime(record.checkInTime)}
                    </span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
