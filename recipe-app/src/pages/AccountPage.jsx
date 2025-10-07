import { useAuth } from "../contexts/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function AccountPage() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: 16 }}>Loading…</div>;
  if (!user) return <div style={{ padding: 16 }}>Please sign in first.</div>;

  return (
    <div style={{ padding: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Account</h1>
        <button onClick={() => signOut(auth)}>Sign out</button>
      </div>
      <div>Welcome, {user.displayName || user.email}</div>
      <div>Your UID: {user.uid}</div>
    </div>
  );
}
