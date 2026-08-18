import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiPackage,
  FiUsers,
  FiImage,
  FiLogOut,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";

function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: FiHome },
    { to: "/admin/orders", label: "Orders", icon: FiPackage },
    { to: "/admin/users", label: "Customers", icon: FiUsers },
    { to: "/admin/designs", label: "Designs", icon: FiImage },
  ];

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Sidebar */}
      <aside className="
        hidden
        md:flex
        md:flex-col
        md:w-64
        md:bg-parchment
        md:border-r
        md:border-warm-beige
        md:shadow-card
      ">
        <div className="p-6 border-b border-warm-beige">
          <h2 className="text-xl font-bold text-deep-brown">
            Admin Panel
          </h2>

          {user && (
            <p className="text-sm text-sage mt-1">
              {user.name}
            </p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `
                flex items-center gap-3
                px-4 py-3
                rounded-[var(--radius-sm)]
                text-sm font-medium
                transition-all duration-250
                ${
                  isActive
                    ? "bg-terracotta text-white shadow-card-hover"
                    : "text-deep-brown hover:bg-warm-beige hover:text-terracotta"
                }
              `}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-warm-beige">
          <button
            onClick={handleLogout}
            className="
              w-full
              flex items-center gap-3
              px-4 py-3
              rounded-[var(--radius-sm)]
              text-sm font-medium
              text-terracotta
              hover:bg-warm-beige
              transition
            "
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
