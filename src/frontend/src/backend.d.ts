import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type SessionId = bigint;
export type Time = bigint;
export interface Session {
    id: SessionId;
    startTime: Time;
    endTime: Time;
    name: string;
    qrPayload: string;
}
export interface AttendanceRecord {
    user: Principal;
    checkInTime: Time;
    sessionId: SessionId;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    checkIn(sessionId: SessionId, scannedData: string): Promise<void>;
    createSession(name: string, startTime: Time, endTime: Time): Promise<Session>;
    getAllSessions(): Promise<Array<Session>>;
    getAttendanceForSession(sessionId: SessionId): Promise<Array<AttendanceRecord>>;
    getCallerAttendance(): Promise<Array<AttendanceRecord>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getSession(sessionId: SessionId): Promise<Session | null>;
    getUserAttendance(user: Principal): Promise<Array<AttendanceRecord>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
