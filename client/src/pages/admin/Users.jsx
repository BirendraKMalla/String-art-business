import { useEffect, useState } from "react";
import { FiSearch, FiUser } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { getAllUsers, updateUserRole } from "../../api/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const { token } = useAuth();

  // ----------------------------------------
  // Fetch users
  // ----------------------------------------

  useEffect(() => {
    const loadUsers = async () => {
      if (!token) return;

      try {
        const params = {};

        if (search) params.search = search;
        if (roleFilter) params.role = roleFilter;

        const data = await getAllUsers(token, params);

        setUsers(data.users || []);
      } catch (error) {
        console.error(error);
        setError(error.message || "Could not load users.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [token, search, roleFilter]);

  // ----------------------------------------
  // Role update
  // ----------------------------------------

  const handleRoleChange = async (userId, newRole) => {
    if (!window.confirm(`Change this user's role to ${newRole}?`)) {
      return;
    }

    try {
      setUpdatingId(userId);

      const data = await updateUserRole(userId, newRole, token);

      if (data.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? data.user : u
          )
        );
      }
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update user role.");
    } finally {
      setUpdatingId(null);
    }
  };

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("");
  };

  const hasActiveFilters = search || roleFilter;

  // ----------------------------------------
  // Render
  // ----------------------------------------

  return (
    <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-medium text-terracotta tracking-wider uppercase mb-3">
            ADMIN PANEL
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-4">
            Customers
          </h1>
          <p className="text-sage">
            Manage user accounts and roles. Promote trusted users to admin.
          </p>
        </div>

        {/* Filters */}
        <div className="
          bg-parchment
          rounded-[var(--radius-lg)]
          shadow-card
          border border-warm-beige
          p-6
          mb-6
        ">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sage"
              />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  pl-10 pr-3 py-2.5
                  bg-cream
                  border border-warm-beige
                  rounded-[var(--radius-sm)]
                  text-deep-brown
                  placeholder-sage
                  focus:outline-none
                  focus:ring-2
                  focus:ring-terracotta/30
                  focus:border-terracotta
                  transition
                "
              />
            </div>

            {/* Role filter */}
            <div className="w-full sm:w-48">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="
                  w-full
                  px-3 py-2.5
                  bg-cream
                  border border-warm-beige
                  rounded-[var(--radius-sm)]
                  text-deep-brown
                  focus:outline-none
                  focus:ring-2
                  focus:ring-terracotta/30
                  transition
                "
              >
                <option value="">All Roles</option>
                <option value="customer">Customers</option>
                <option value="admin">Admins</option>
              </select>
            </div>

            {/* Clear */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="
                  px-4 py-2
                  text-sm
                  text-sage
                  hover:text-terracotta
                  border border-warm-beige
                  rounded-[var(--radius-sm)]
                  bg-cream
                  hover:bg-warm-beige
                  transition
                "
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-terracotta mb-4">{error}</p>
        )}

        {/* Loading */}
        {loading ? (
          <p className="text-sage">Loading users...</p>
        ) : users.length === 0 ? (
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            border border-warm-beige
            p-12
            text-center
          ">
            <h2 className="text-xl font-bold text-deep-brown mb-2">
              No users found
            </h2>
            <p className="text-sage">
              {hasActiveFilters
                ? "Try clearing your filters."
                : "No users have registered yet."}
            </p>
          </div>
        ) : (
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            border border-warm-beige
            overflow-hidden
          ">
            <table className="w-full">
              <thead>
                <tr className="border-b border-warm-beige">
                  <th className="
                    text-left
                    px-6 py-4
                    text-xs font-medium text-sage
                    uppercase tracking-wider
                  ">
                    User
                  </th>
                  <th className="
                    text-left
                    px-4 py-4
                    text-xs font-medium text-sage
                    uppercase tracking-wider
                  ">
                    Email
                  </th>
                  <th className="
                    text-left
                    px-4 py-4
                    text-xs font-medium text-sage
                    uppercase tracking-wider
                  ">
                    Phone
                  </th>
                  <th className="
                    text-center
                    px-4 py-4
                    text-xs font-medium text-sage
                    uppercase tracking-wider
                  ">
                    Role
                  </th>
                  <th className="
                    text-left
                    px-4 py-4
                    text-xs font-medium text-sage
                    uppercase tracking-wider
                  ">
                    Joined
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="
                      border-b border-warm-beige
                      last:border-0
                      hover:bg-cream/50
                      transition-colors
                    "
                  >
                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="
                          w-10 h-10
                          bg-terracotta/10
                          rounded-full
                          flex items-center justify-center
                          flex-shrink-0
                        ">
                          <FiUser size={20} className="text-terracotta" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-deep-brown">
                            {user.name || "—"}
                          </p>
                          <p className="text-xs text-sage">
                            ID: {user._id?.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-sage">
                        {user.email || "—"}
                      </p>
                    </td>

                    {/* Phone */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-sage">
                        {user.phone || "—"}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="text-center px-4 py-4">
                      {updatingId === user._id ? (
                        <div className="flex items-center justify-center">
                          <div className="
                            w-5 h-5
                            border-2
                            border-terracotta/30
                            border-t-terracotta
                            rounded-full
                            animate-spin
                          " />
                        </div>
                      ) : (
                        <select
                          value={user.role || "customer"}
                          onChange={(e) =>
                            handleRoleChange(user._id, e.target.value)
                          }
                          className="
                            px-2 py-1
                            text-sm
                            bg-cream
                            border border-warm-beige
                            rounded-[var(--radius-sm)]
                            text-deep-brown
                            focus:outline-none
                            focus:ring-2
                            focus:ring-terracotta/30
                          "
                        >
                          <option value="customer">Customer</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>

                    {/* Joined */}
                    <td className="px-4 py-4">
                      <p className="text-sm text-sage">
                        {formatDate(user.createdAt)}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminUsers;
