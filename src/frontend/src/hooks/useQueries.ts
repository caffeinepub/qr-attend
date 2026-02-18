import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Session, AttendanceRecord, SessionId } from '../backend';

// Sessions
export function useGetAllSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<Session[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSession(sessionId: SessionId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Session | null>({
    queryKey: ['session', sessionId?.toString()],
    queryFn: async () => {
      if (!actor || sessionId === null) return null;
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !isFetching && sessionId !== null,
  });
}

export function useCreateSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, startTime, endTime }: { name: string; startTime: bigint; endTime: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createSession(name, startTime, endTime);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}

// Attendance
export function useGetCallerAttendance() {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['callerAttendance'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCallerAttendance();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAttendanceForSession(sessionId: SessionId | null) {
  const { actor, isFetching } = useActor();

  return useQuery<AttendanceRecord[]>({
    queryKey: ['sessionAttendance', sessionId?.toString()],
    queryFn: async () => {
      if (!actor || sessionId === null) return [];
      return actor.getAttendanceForSession(sessionId);
    },
    enabled: !!actor && !isFetching && sessionId !== null,
  });
}

export function useCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, scannedData }: { sessionId: SessionId; scannedData: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.checkIn(sessionId, scannedData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerAttendance'] });
      queryClient.invalidateQueries({ queryKey: ['sessionAttendance'] });
    },
  });
}
