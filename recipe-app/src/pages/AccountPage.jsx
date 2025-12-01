import { useAuth } from "../contexts/AuthContext.jsx";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";

export default function AccountPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  if (loading) return (
    <div className="self-stretch text-center text-navy text-2xl font-['Orelega_One']">
      Loading...
    </div>
  );
  if (!user)
    return (
      <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5">
        {/* Divider */}
        <div className="self-stretch h-0 outline outline-1 outline-darkRed" />

        {/* Sign In Button */}
        <button
          onClick={() => nav("/signIn")}
          className="self-stretch h-12 p-2.5 rounded-[10px] border border-darkYellow text-darkRed font-['Franklin_Gothic_Book'] hover:bg-greenishYellow/50 transition"
        >
          Sign In
        </button>
      </div>
    );

  return (
    <div className="w-96 h-screen px-5 pt-9 pb-20 bg-white flex flex-col gap-5 overflow-y-auto scrollbar-none">

      {/* Hello Header */}
      <div className="self-stretch text-center text-navy text-4xl font-['Orelega_One']">
        Hello, {user.displayName || user.email}!
      </div>

      {/* Change Password Button */}
      <div className="self-stretch h-12 p-2.5 rounded-[10px] outline outline-1 outline-darkYellow inline-flex justify-center items-center gap-[5px] overflow-hidden cursor-pointer">
        <div className="text-darkRed text-base font-['Franklin_Gothic_Book']">
          Change Password
        </div>
      </div>

      {/* Divider */}
      <div className="self-stretch h-0 outline outline-1 outline-darkRed" />

      {/* Sign Out Button */}
      <div
        onClick={() => signOut(auth)}
        className="self-stretch h-12 p-2.5 rounded-[10px] outline outline-1 outline-darkYellow inline-flex justify-center items-center gap-[5px] overflow-hidden cursor-pointer"
      >
        <div className="text-darkRed text-base font-['Franklin_Gothic_Book']">
          Sign Out
        </div>
      </div>
    </div>
  );
}
