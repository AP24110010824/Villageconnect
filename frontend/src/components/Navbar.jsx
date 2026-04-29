import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout, theme, onToggleTheme }) => {
  return (
    <nav>
      <div>
        <Link to="/">VillageConnect</Link>
      </div>
      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/schemes">Schemes</Link>
        <Link to="/complaints">Complaints</Link>
        <Link to="/agriculture">Agriculture</Link>
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button className="button secondary" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        <button className="button theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
