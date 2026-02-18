import List "mo:core/List";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Migration "migration";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

// Apply explicit migration logic using with-clause
(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type SessionId = Nat;

  public type Session = {
    id : SessionId;
    name : Text;
    startTime : Time.Time;
    endTime : Time.Time;
    qrPayload : Text;
  };

  module Session {
    public func compare(session1 : Session, session2 : Session) : Order.Order {
      compareByStartTime(session1, session2);
    };

    public func compareByStartTime(session1 : Session, session2 : Session) : Order.Order {
      Int.compare(session1.startTime, session2.startTime);
    };
  };

  public type AttendanceRecord = {
    sessionId : SessionId;
    user : Principal;
    checkInTime : Time.Time;
  };

  module AttendanceRecord {
    public func compare(record1 : AttendanceRecord, record2 : AttendanceRecord) : Order.Order {
      compareByCheckInTime(record1, record2);
    };

    public func compareByCheckInTime(record1 : AttendanceRecord, record2 : AttendanceRecord) : Order.Order {
      Int.compare(record1.checkInTime, record2.checkInTime);
    };
  };

  public type UserProfile = {
    name : Text;
  };

  var nextSessionId = 0;
  let sessions = Map.empty<Nat, Session>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextAttendanceId = 0;
  let attendance = Map.empty<Nat, AttendanceRecord>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Session Management
  public shared ({ caller }) func createSession(name : Text, startTime : Time.Time, endTime : Time.Time) : async Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create sessions");
    };

    let sessionId = nextSessionId;
    nextSessionId += 1;

    let session : Session = {
      id = sessionId;
      name;
      startTime;
      endTime;
      qrPayload = "QR-" # sessionId.toText();
    };

    sessions.add(sessionId, session);
    session;
  };

  public query ({ caller }) func getSession(sessionId : SessionId) : async ?Session {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    sessions.get(sessionId);
  };

  public query ({ caller }) func getAllSessions() : async [Session] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view sessions");
    };
    sessions.values().toArray().sort();
  };

  // Attendance Management
  public shared ({ caller }) func checkIn(sessionId : SessionId, scannedData : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check in");
    };

    if (not scannedData.startsWith(#text "QR-")) {
      Runtime.trap("Invalid QR code");
    };

    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let expectedPayload = "QR-" # sessionId.toText();
        if (scannedData != expectedPayload) {
          Runtime.trap("Invalid QR code for this session");
        };
      };
    };

    let record : AttendanceRecord = {
      sessionId;
      user = caller;
      checkInTime = Time.now();
    };

    attendance.add(nextAttendanceId, record);
    nextAttendanceId += 1;
  };

  public query ({ caller }) func getAttendanceForSession(sessionId : SessionId) : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance");
    };

    attendance.values().filter(func(record) { record.sessionId == sessionId }).toArray();
  };

  public query ({ caller }) func getUserAttendance(user : Principal) : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view attendance");
    };

    attendance.values().filter(func(record) { record.user == user }).toArray();
  };

  public query ({ caller }) func getCallerAttendance() : async [AttendanceRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view their attendance");
    };

    attendance.values().filter(func(record) { record.user == caller }).toArray();
  };
};
