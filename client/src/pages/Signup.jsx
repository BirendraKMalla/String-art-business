import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUser, FiMail, FiPhone, FiLock, FiUserPlus } from "react-icons/fi";
import { registerUser } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const data = await registerUser(name, email, password, phone);

      if (data.token) {
        login(data.token);
        navigate("/");
        return;
      }

      setMessage(data.message || "Signup failed");
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
            <FiUserPlus size={24} className="text-terracotta" />
            <span className="text-sm font-medium text-terracotta tracking-wider uppercase">Join the Studio</span>
          </div>

          <h1 className="text-3xl font-bold text-deep-brown mb-2">
            Create Your Account
          </h1>

          <p className="text-sage">
            Start your first string art piece today.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiUser size={16} className="text-terracotta" />
              Full Name
            </label>

            <input
              id="signup-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              placeholder="Jane Doe"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiMail size={16} className="text-terracotta" />
              Email Address
            </label>

            <input
              id="signup-email"
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

          {/* Phone */}
          <div>
            <label htmlFor="signup-phone" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiPhone size={16} className="text-terracotta" />
              Phone Number
            </label>

            <input
              id="signup-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              placeholder="+977 98XXXXXXXX"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiLock size={16} className="text-terracotta" />
              Password
            </label>

            <input
              id="signup-password"
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

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm-password" className="
              block text-sm font-medium
              text-deep-brown
              mb-2
              flex items-center gap-2
            ">
              <FiLock size={16} className="text-terracotta" />
              Confirm Password
            </label>

            <input
              id="signup-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            variant="secondary"
            size="md"
            className="w-full rounded-full h-14 text-lg font-medium"
          >
            Create Account
          </Button>
        </form>

        {message && (
          <p className={`text-center mt-5 ${
            message.includes("success") || message.includes("Account")
              ? "text-sage"
              : "text-terracotta"
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
          <span className="text-sage">Already have an account?</span>{" "}
          <Link
            to="/login"
            className="text-terracotta font-medium hover:text-deep-brown transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
}

export default Signup;
