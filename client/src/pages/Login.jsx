import "../styles/auth.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { FaRocket } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {

    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        "https://ai-interview-prep-drlz.onrender.com/api/auth/login",
        { email, password }
      );

      const { token, user } = res.data;

      /* Store token and user in localStorage */
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      /* Redirect admin to admin page, others to home */
      if (user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/home");
      }

    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }

  };

  const forgotPassword = async () => {

    if (!email) {
      alert("Please enter email first");
      return;
    }

    try {
      await axios.post(
        "https://ai-interview-prep-drlz.onrender.com/api/password/send-otp",
        { email }
      );
      alert("OTP sent to your email");
    } catch (err) {
      alert("Failed to send OTP");
    }

  };

  return (

    <div className="authContainer">

      <div className="authLeft">

        <div className="rocketIcon">
          <FaRocket />
        </div>

        <h1>Interview Prep</h1>

        <p>
          AI powered interview preparation platform.
          Resume scoring, mock interviews,
          smart AI question practice.
        </p>

      </div>

      <div className="authRight">

        <div className="authBox">

          <h2>User Login</h2>

          {/* Error message */}
          {error && (
            <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>
              {error}
            </p>
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD WITH EYE BUTTON */}
          <div className="passwordWrapper">

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="eyeIcon"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>

          </div>

          <div className="rememberRow">

            <label>
              Remember me
              <input type="checkbox" />
            </label>

            <span className="forgot" onClick={forgotPassword}>
              Forgot password?
            </span>

          </div>

          <button
            className="primaryBtn"
            onClick={login}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p
            className="signupText"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </p>

        </div>

      </div>

    </div>

  );

}

export default Login;
