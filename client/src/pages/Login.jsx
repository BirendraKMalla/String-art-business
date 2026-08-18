import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn, FiMail, FiLock } from "react-icons/fi";
import { loginUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser(email, password);

      if (data.token) {
        // Update AuthContext
        login(data.token);

        setMessage("Login successful!");

        navigate("/");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);

      setMessage(error.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen bg-cream flex items-center justify-center px-4 py-12">
      <div className="
        bg-parchment
        p-8 md:p-12
        rounded-[var(--radius-xl)]
        shadow-strong
        w-full
        max-w-lg
        border border-warm-beige
        relative
        overflow-hidden
      ">
        {/* Gold accent strip */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gold-accent via-terracotta to-gold-accent" />

        <div className="text-center mb-8">
          <div className="
            inline-flex
            items-center
            justify-center
            gap-2
            mb-4
          ">
            <FiLogIn size={24} className="text-terracotta" />
            <span className="text-sm font-medium text-terracotta tracking-wider uppercase">Welcome Back</span>
          </div>

          <h1 className="text-3xl font-bold text-deep-brown mb-2">
            Welcome Back
          </h1>

          <p className="text-sage">
            Log in to view your orders and studio drafts.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="login-email" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiMail size={16} className="text-terracotta" />
              Email Address
            </label>

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full
                bg-cream
                border border-warm-beige
                rounded-[var(--radius-sm)]
                px-4 py-3
                text-deep-brown
                placeholder-sage
                focus:outline-none
                focus:ring-2
                focus:ring-terracotta/30
                focus:border-terracotta
                transition
              "
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="login-password" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiLock size={16} className="text-terracotta" />
              Password
            </label>

            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full
                bg-cream
                border border-warm-beige
                rounded-[var(--radius-sm)]
                px-4 py-3
                text-deep-brown
                placeholder-sage
                focus:outline-none
                focus:ring-2
                focus:ring-terracotta/30
                focus:border-terracotta
                transition
              "
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full rounded-full h-14 text-lg font-medium"
          >
            Login to Studio
          </Button>
        </form>

        {message && (
          <p className={`text-center mt-5 ${
            message.includes("successful") ? "text-sage" : "text-terracotta"
          }`}>
            {message}
          </p>
        )}

        <div className="
          relative
          mt-6
          text-center
          text-sm
        ">
          <span className="text-sage">Don't have an account?</span>{" "}
          <Link
            to="/signup"
            className="text-terracotta font-medium hover:text-deep-brown transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Login;
