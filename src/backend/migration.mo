import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  // Old types
  type SessionId = Nat;

  type Session = {
    id : SessionId;
    name : Text;
    startTime : Int;
    endTime : Int;
    qrPayload : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type OldActor = {
    nextSessionId : Nat;
    sessions : Map.Map<SessionId, Session>;
    userProfiles : Map.Map<Principal, UserProfile>;
    nextAttendanceId : Nat;
    attendance : Map.Map<Nat, { sessionId : SessionId; user : Principal; checkInTime : Int }>;
  };

  type NewActor = OldActor;

  public func run(old : OldActor) : NewActor {
    old;
  };
};
