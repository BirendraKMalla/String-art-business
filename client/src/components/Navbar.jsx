import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiX,
  FiHome,
  FiImage,
  FiPackage,
  FiInfo,
  FiLogIn,
  FiUserPlus,
  FiLogOut,
  FiShield,
  FiSun,
  FiMoon,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Button from "./Button";

function Navbar() {
  const { token, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMenu();
  };

  const isActive = (path) => location.pathname === path;

  const isAdmin = user?.role === "admin";

  const navLinks = [
    { to: "/", label: "Home", icon: FiHome },
    { to: "/create", label: "Create", icon: FiImage },
    ...(token
      ? [{ to: "/orders", label: "My Orders", icon: FiPackage }]
      : []),
    ...(isAdmin ? [{ to: "/admin", label: "Admin", icon: FiShield }] : []),
    { to: "/about", label: "About", icon: FiInfo },
  ];

  const linkClasses = (active) =>
    `flex items-center gap-2 text-sm font-medium transition-colors ${
      active
        ? "text-terracotta"
        : "text-sage hover:text-terracotta"
    }`;

  return (
    <>
      {/* Navbar */}
      <nav className="bg-cream/60 backdrop-blur border-b border-warm-beige sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              to="/"
              onClick={closeMenu}
              className="
                text-2xl font-semibold text-deep-brown
                relative
                after:content-['']
                after:absolute
                after:-bottom-1
                after:left-0
                after:w-0
                after:h-0.5
                after:bg-gold-accent
                after:transition-all
                after:duration-300
                hover:after:w-full
              "
            >
              String Art Studio
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={linkClasses(isActive(link.to))}
                >
                  <link.icon size={17} />
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop Authentication */}
            <div className="hidden md:flex gap-3 items-center">
              {!token ? (
                <>
                  <Link
                    to="/login"
                    className={linkClasses(false)}
                  >
                    <FiLogIn size={17} />
                    Login
                  </Link>

                  <Button
                    variant="primary"
                    size="md"
                    className="rounded-full"
                  >
                    <Link to="/signup" className="flex items-center gap-2">
                      <FiUserPlus size={17} />
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                </>
              ) : (
                <Button
                  variant="dark"
                  size="md"
                  className="rounded-full"
                  onClick={handleLogout}
                >
                  <span className="flex items-center gap-2">
                    <FiLogOut size={17} />
                    Logout
                  </span>
                </Button>
              )}
            </div>

            {/* Theme Toggle (Desktop) */}
            <button
              onClick={toggleTheme}
              className="
                hidden md:flex
                w-10 h-10
                items-center justify-center
                rounded-full
                bg-parchment
                border border-warm-beige
                text-terracotta
                hover:bg-warm-beige
                transition
              "
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(true)}
              className="
                md:hidden
                w-10 h-10
                flex items-center justify-center
                rounded-full
                bg-parchment
                border border-warm-beige
                text-terracotta
                hover:text-deep-brown
                transition
              "
              aria-label="Open menu"
            >
              <FiMenu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {menuOpen && (
        <div
          onClick={closeMenu}
          className="fixed inset-0 bg-black/30 z-60 md:hidden"
        />
      )}

      {/* Mobile Side Drawer */}
      <div
        className={`
          fixed top-0 right-0 h-full w-[80%] max-w-sm
          bg-parchment
          z-70
          shadow-strong
          border-l border-warm-beige
          md:hidden
          transform transition-transform duration-300 ease-in-out
          ${menuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-warm-beige">
          <span className="text-xl font-semibold text-deep-brown">Menu</span>

          <div className="flex items-center gap-2">
            {/* Theme Toggle (Mobile) */}
            <button
              onClick={toggleTheme}
              className="
                w-9 h-9
                flex items-center justify-center
                rounded-full
                bg-cream
                text-terracotta
                hover:bg-warm-beige
                transition
              "
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            <button
              onClick={closeMenu}
              className="
                w-10 h-10
                flex items-center justify-center
                rounded-full
                bg-cream
                text-terracotta
                hover:text-deep-brown
                transition
              "
              aria-label="Close menu"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="px-5 py-6 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={`
                flex items-center gap-4
                px-4 py-4
                rounded-xl
                text-deep-brown
                hover:bg-warm-beige
                transition
              `}
            >
              <link.icon size={20} />
              {link.label}
            </Link>
          ))}

          <div className="border-t border-warm-beige my-4" />

          {!token ? (
            <>
              <Link
                to="/login"
                onClick={closeMenu}
                className="
                  flex items-center gap-4
                  px-4 py-4
                  rounded-xl
                  text-terracotta
                  hover:bg-warm-beige
                  transition
                "
              >
                <FiLogIn size={20} />
                Login
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="
                  flex items-center justify-center gap-3
                  bg-terracotta
                  text-white
                  px-6 py-4
                  rounded-full
                  hover:bg-deep-brown
                  transition
                "
              >
                <FiUserPlus size={20} />
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="
                w-full flex items-center justify-center gap-3
                bg-deep-brown
                text-white
                px-6 py-4
                rounded-full
                hover:bg-terracotta
                transition
              "
            >
              <FiLogOut size={20} />
              Logout
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default Navbar;
