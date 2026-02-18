import { useState } from 'react';
import { useGetAllSessions, useGetAttendanceForSession } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Calendar, Clock, Users } from 'lucide-react';
import type { SessionId } from '../../backend';

export default function AdminAttendanceOverviewPage() {
  const { data: sessions, isLoading: sessionsLoading } = useGetAllSessions();
  const [selectedSessionId, setSelectedSessionId] = useState<SessionId | null>(null);
  const { data: attendance, isLoading: attendanceLoading } = useGetAttendanceForSession(selectedSessionId);

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1_000_000)));
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timestamp: bigint) => {
    const date = new Date(Number(timestamp / BigInt(1_000_000)));
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const selectedSession = sessions?.find((s) => s.id === selectedSessionId);

  if (sessionsLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance Overview</h1>
          <p className="text-muted-foreground">View attendance records</p>
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
        <h1 className="text-3xl font-bold">Attendance Overview</h1>
        <p className="text-muted-foreground">View attendance records</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Session</CardTitle>
          <CardDescription>Choose a session to view attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedSessionId?.toString() || ''}
            onValueChange={(value) => setSelectedSessionId(BigInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              {sessions?.map((session) => (
                <SelectItem key={session.id.toString()} value={session.id.toString()}>
                  {session.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedSession && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedSession.name}</CardTitle>
            <CardDescription className="flex flex-col gap-1 text-sm">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(selectedSession.startTime)} - {formatDate(selectedSession.endTime)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(selectedSession.startTime)} - {formatTime(selectedSession.endTime)}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {attendance?.length || 0} attendees
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            {attendanceLoading ? (
              <div className="text-center py-8">
                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
            ) : !attendance || attendance.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No attendance records yet</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Check-in Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {attendance
                      .sort((a, b) => Number(a.checkInTime - b.checkInTime))
                      .map((record, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-mono text-xs">{record.user.toString().slice(0, 20)}...</TableCell>
                          <TableCell>
                            {formatDate(record.checkInTime)} {formatTime(record.checkInTime)}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
