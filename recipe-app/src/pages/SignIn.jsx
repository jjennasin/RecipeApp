import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";


export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav("/account");
    } catch (e) { setErr(e.message); }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 360, margin: "60px auto", display: "grid", gap: 12 }}>
      <h1>Sign In</h1>
      <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <button type="submit">Sign In</button>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <div>No account yet? <Link to="/signup">Create one</Link></div>
    </form>
  );
}
