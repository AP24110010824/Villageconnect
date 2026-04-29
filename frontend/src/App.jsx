import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Schemes from "./pages/Schemes";
import Complaints from "./pages/Complaints";
import Agriculture from "./pages/Agriculture";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import AdminDashboard from "./admin/AdminDashboard";
import ManageUsers from "./admin/ManageUsers";
import ManageJobs from "./admin/ManageJobs";
import ManageSchemes from "./admin/ManageSchemes";
import api, { setAuthToken } from "./services/api";

const getStoredUser = () => {
  const stored = localStorage.getItem("villageconnectUser");
  return stored ? JSON.parse(stored) : null;
};

const getStoredTheme = () => {
  return localStorage.getItem("villageconnectTheme") || "dark";
};

const App = () => {
  const [user, setUser] = React.useState(getStoredUser());
  const [theme, setTheme] = React.useState(getStoredTheme());

  React.useEffect(() => {
    if (user?.token) {
      setAuthToken(user.token);
    }
  }, [user]);

  React.useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("villageconnectTheme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const handleLogin = async (credentials) => {
    const response = await api.post("/users/login", credentials);
    const userData = response.data;
    localStorage.setItem("villageconnectUser", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const handleRegister = async (credentials) => {
    const response = await api.post("/users/register", credentials);
    const userData = response.data;
    localStorage.setItem("villageconnectUser", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const handleLogout = () => {
    localStorage.removeItem("villageconnectUser");
    setAuthToken(null);
    setUser(null);
  };

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />;
  };

  const AdminRoute = ({ children }) => {
    return user?.role === "admin" ? children : <Navigate to="/" replace />;
  };

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} theme={theme} onToggleTheme={toggleTheme} />
      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onRegister={handleRegister} />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard user={user} />
              </PrivateRoute>
            }
          />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/schemes" element={<Schemes />} />
          <Route path="/complaints" element={<Complaints user={user} />} />
          <Route path="/agriculture" element={<Agriculture />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile user={user} />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <ManageUsers />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/jobs"
            element={
              <AdminRoute>
                <ManageJobs />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/schemes"
            element={
              <AdminRoute>
                <ManageSchemes />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
