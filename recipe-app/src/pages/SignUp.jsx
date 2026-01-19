import { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext.jsx";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState(null);
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      nav("/account");
    } catch (e) { setErr(e.message); }
  }

  return (
    <form onSubmit={handleSubmit} className="min-h-screen flex items-center justify-center bg-white">
      {/*
      <h1>Sign In</h1>
      <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">Sign In</button>
      {err && <div style={{ color: "crimson" }}>{err}</div>}
      <div>No account yet? <Link to="/signup">Create one</Link></div>
      */}

      <div
        data-layer="InitColor"
        className="Initcolor w-96 p-11 bg-white flex flex-col justify-center items-start gap-6">
        <div
          data-layer="text"
          className="Text self-stretch flex flex-col justify-center items-center overflow-hidden">
          <div className="Welcome text-navy text-6xl font-normal font-['Orelega_One'] leading-[89.6px]">
            Welcome!
          </div>
          <div className="EasyMealsStartHere text-navy text-xl font-normal font-['Franklin_Gothic_Medium'] leading-7">
            Easy Meals Start Here
          </div>
        </div>
        <div
          data-layer="input"
          className="Input self-stretch flex flex-col justify-start items-start gap-5 overflow-hidden">
            
          {/* Email */}
          <div className="Email flex flex-col justify-start items-start gap-[5px] overflow-hidden">
            <label className="text-darkRed text-base font-normal font-['Franklin_Gothic_Book']">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-72 h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] placeholder:text-lighterRed focus:outline-none focus:ring-0"
            />
          </div>

          {/* Password */}
          <div className="Pass flex flex-col justify-start items-start gap-[5px] overflow-hidden">
            <label className="text-darkRed text-base font-normal font-['Franklin_Gothic_Book']">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-72 h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] placeholder:text-lighterRed focus:outline-none focus:ring-0"
            />
          </div>

          {/* Sign Up */}
          <button
            type="submit"
            className="w-72 h-12 p-2.5 bg-lighterRed rounded-[10px] text-white text-base font-normal font-['Franklin_Gothic_Book'] hover:bg-darkRed transition-all"
          >
            Sign Up
          </button>

          {/* Links */}
          <div className="ForgotPass self-stretch py-2.5 rounded-[10px] inline-flex justify-end items-end overflow-hidden">
            {/*<a
              href="#"
              className="text-darkRed text-base font-normal font-['Franklin_Gothic_Book'] underline hover:text-lighterRed"
            >
              Forgot password?
            </a>*/}
            <a
              href="/signIn"
              className="text-darkRed text-base font-normal font-['Franklin_Gothic_Book'] underline hover:text-lighterRed"
            >
              Sign In
            </a>
          </div>

          {/* Error */}
          {err && (
            <div className="text-darkRed text-sm mt-2">
              {err.replace("Firebase:", "").trim()}
            </div>
          )}
        </div>
      </div>

    </form>
  );
}