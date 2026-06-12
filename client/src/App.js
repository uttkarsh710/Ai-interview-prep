import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";
import Voice from "./pages/voiceinterview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";

import Practice from "./pages/Practice";


function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || !user.isAdmin) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* auth — public */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* admin only */}
        <Route path="/admin" element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        } />

        {/* protected — login required */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } />

        <Route path="/resume" element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        } />

        <Route path="/interview" element={
          <ProtectedRoute>
            <Interview />
          </ProtectedRoute>
        } />

        <Route path="/voice" element={
          <ProtectedRoute>
            <Voice />
          </ProtectedRoute>
        } />
        <Route path="/practice" element={
  <ProtectedRoute>
    <Practice />
  </ProtectedRoute>
} />

      </Routes>

    </BrowserRouter>

  );

}

export default App;