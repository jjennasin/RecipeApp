import { NavLink, Outlet } from "react-router-dom";

const linkBase = {
  padding: "10px 14px",
  borderRadius: "12px",
  textDecoration: "none",
  fontWeight: 600,
  color: "#222",
};
const activeStyle = {
  background: "#eef3ff",
  border: "1px solid #d3defd",
};

export default function Layout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Page content (leave room at the bottom so it doesn't sit under the bar) */}
      <main style={{ flex: 1, maxWidth: 960, margin: "0 auto", padding: "16px", paddingBottom: "80px" }}>
        <Outlet />
      </main>

      {/* Fixed bottom nav */}
      <nav
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          height: "60px",
          zIndex: 1000,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          borderTop: "1px solid #eee",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(6px)",
        }}
      >
        <NavLink to="/browse" style={({ isActive }) => (isActive ? { ...linkBase, ...activeStyle } : linkBase)}>
          Browse
        </NavLink>
        <NavLink to="/saved" style={({ isActive }) => (isActive ? { ...linkBase, ...activeStyle } : linkBase)}>
          Saved
        </NavLink>
        <NavLink to="/account" style={({ isActive }) => (isActive ? { ...linkBase, ...activeStyle } : linkBase)}>
          Account
        </NavLink>
      </nav>
    </div>
  );
}
