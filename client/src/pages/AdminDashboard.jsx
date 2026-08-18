import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiPackage,
  FiUsers,
  FiImage,
  FiDollarSign,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";

import { useAuth } from "../context/AuthContext";
import { getDashboardStats } from "../api/api";
import StatusBadge from "../components/StatusBadge";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { token } = useAuth();

  // ----------------------------------------
  // Fetch dashboard data
  // ----------------------------------------

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (!token) return;

        const data = await getDashboardStats(token);

        setStats(data);
      } catch (error) {
        console.error(error);
        setError(error.message || "Could not load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [token]);

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const formatCurrency = (amount) => {
    if (amount == null) return "Rs. —";
    return `Rs. ${amount.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const metricCards = [
    {
      label: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: FiPackage,
      color: "text-terracotta",
      bg: "bg-terracotta/10",
    },
    {
      label: "Total Revenue",
      value: formatCurrency(stats?.totalRevenue),
      icon: FiDollarSign,
      color: "text-deep-brown",
      bg: "bg-deep-brown/10",
    },
    {
      label: "Pending Orders",
      value: stats?.ordersByStatus?.pending || 0,
      icon: FiClock,
      color: "text-sage",
      bg: "bg-sage-light/30",
    },
    {
      label: "New Customers",
      value: stats?.newUsersThisMonth || 0,
      icon: FiUsers,
      color: "text-terracotta",
      bg: "bg-terracotta/10",
    },
  ];

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
            Dashboard
          </h1>
          <p className="text-sage">
            At-a-glance overview of your String Art Studio.
          </p>
        </div>

        {/* Error */}
        {error && (
          <p className="text-terracotta mb-4">{error}</p>
        )}

        {/* Loading */}
        {loading && (
          <p className="text-sage mb-8">Loading dashboard...</p>
        )}

        {/* Metric cards */}
        <div className="
          grid
          sm:grid-cols-2
          lg:grid-cols-4
          gap-6
          mb-10
        ">
          {metricCards.map((card) => (
            <div
              key={card.label}
              className="
                bg-parchment
                rounded-[var(--radius-lg)]
                shadow-card
                border border-warm-beige
                p-6
                transition-all duration-250
                hover:shadow-card-hover
              "
            >
              <div className="
                flex items-center
                justify-between
                mb-4
              ">
                <div className={`${card.bg} w-12 h-12 rounded-full flex items-center justify-center`}>
                  <card.icon size={24} className={card.color} />
                </div>
                <span className="text-xs text-sage uppercase tracking-wider">
                  {card.label}
                </span>
              </div>

              <p className="text-3xl font-bold text-deep-brown">
                {card.value}
              </p>
            </div>
          ))}
        </div>

        {/* Order Status Breakdown */}
        {stats?.ordersByStatus && (
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            border border-warm-beige
            p-6
            mb-10
          ">
            <div className="flex items-center gap-3 mb-6">
              <FiTrendingUp size={20} className="text-terracotta" />
              <h2 className="text-xl font-bold text-deep-brown">
                Orders by Status
              </h2>
            </div>

            <div className="
              grid
              sm:grid-cols-2
              lg:grid-cols-5
              gap-4
            ">
              {[
                "pending",
                "confirmed",
                "in production",
                "completed",
                "delivered",
              ].map((status) => {
                const count = stats.ordersByStatus[status] || 0;
                return (
                  <div
                    key={status}
                    className="
                      bg-cream
                      rounded-[var(--radius-sm)]
                      p-4
                      text-center
                      border border-warm-beige
                    "
                  >
                    <StatusBadge status={status} />
                    <p className="text-2xl font-bold text-deep-brown mt-2">
                      {count}
                    </p>
                    <p className="text-xs text-sage">
                      {status.charAt(0).toUpperCase() +
                        status.slice(1).replace("in production", "In Production")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Orders */}
        {stats?.recentOrders && stats.recentOrders.length > 0 && (
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            border border-warm-beige
            overflow-hidden
            mb-10
          ">
            <div className="
              flex
              items-center
              justify-between
              px-6
              py-4
              border-b
              border-warm-beige
            ">
              <h2 className="text-xl font-bold text-deep-brown">
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="
                  text-sm
                  text-terracotta
                  hover:text-deep-brown
                  font-medium
                  transition
                "
              >
                View all →
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-warm-beige">
                    <th className="
                      text-left
                      px-4 py-3
                      text-xs font-medium text-sage
                      uppercase tracking-wider
                    ">
                      Order
                    </th>
                    <th className="
                      text-left
                      px-4 py-3
                      text-xs font-medium text-sage
                      uppercase tracking-wider
                    ">
                      Customer
                    </th>
                    <th className="
                      text-left
                      px-4 py-3
                      text-xs font-medium text-sage
                      uppercase tracking-wider
                    ">
                      Date
                    </th>
                    <th className="
                      text-left
                      px-4 py-3
                      text-xs font-medium text-sage
                      uppercase tracking-wider
                    ">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {stats.recentOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="
                        border-b border-warm-beige
                        last:border-0
                        hover:bg-cream/50
                        transition-colors
                      "
                    >
                      <td className="px-4 py-3">
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="
                            text-sm
                            font-medium
                            text-deep-brown
                            hover:text-terracotta
                            transition
                          "
                        >
                          #{order._id?.slice(-8)}
                        </Link>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-sage">
                          {order.user?.name || "—"}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <p className="text-sm text-sage">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge
                          status={order.orderStatus || "pending"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Links (fallback when loading or no data) */}
        {!stats && !loading && !error && (
          <div className="
            grid
            sm:grid-cols-2
            lg:grid-cols-4
            gap-6
          ">
            <Link
              to="/admin/orders"
              className="
                bg-parchment
                border border-warm-beige
                rounded-[var(--radius-lg)]
                p-6
                shadow-card
                hover:shadow-card-hover
                hover:border-terracotta
                transition-all duration-250
              "
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <FiPackage size={24} className="text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-sage font-medium">Orders</p>
                  <p className="text-deep-brown font-semibold">Manage all orders</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="
                bg-parchment
                border border-warm-beige
                rounded-[var(--radius-lg)]
                p-6
                shadow-card
                hover:shadow-card-hover
                hover:border-terracotta
                transition-all duration-250
              "
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <FiUsers size={24} className="text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-sage font-medium">Customers</p>
                  <p className="text-deep-brown font-semibold">Manage users</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/designs"
              className="
                bg-parchment
                border border-warm-beige
                rounded-[var(--radius-lg)]
                p-6
                shadow-card
                hover:shadow-card-hover
                hover:border-terracotta
                transition-all duration-250
              "
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <FiImage size={24} className="text-terracotta" />
                </div>
                <div>
                  <p className="text-sm text-sage font-medium">Designs</p>
                  <p className="text-deep-brown font-semibold">View gallery</p>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
