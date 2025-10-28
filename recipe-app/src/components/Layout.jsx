import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { name: "Browse", path: "/browse", icon: "./src/assets/web32.svg" },
  { name: "Saved", path: "/saved", icon: "./src/assets/heart32.svg" },
  { name: "Account", path: "/account", icon: "./src/assets/user32.svg" },
];

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen items-center no-scrollbar">
      {/* Page content */}
      <main className="flex-1 max-w-[384px] mx-auto">
        <Outlet />
      </main>

      {/* Fixed bottom nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[384px] h-10 bg-darkRed flex justify-between items-end px-9">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-end relative ${
                isActive ? "text-greenishYellow" : "text-greenishYellow"
              }`
            }
          >
            {/* Floating Circle */}
            <div
              className={`w-14 h-14 p-[10px] rounded-full bg-darkRed flex flex-col items-center justify-start 
              absolute`}
            >
              <img src={item.icon} alt={item.name} className="w-6 h-6" />
            </div>

            {/* Label */}
            <span className="text-base font-['Franklin_Gothic_Book'] z-50">
              {item.name}
            </span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
