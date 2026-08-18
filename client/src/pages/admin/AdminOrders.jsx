import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiSearch, FiEdit3, FiChevronLeft, FiChevronRight } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { getAllOrdersAdmin, updateOrderStatus } from "../../api/api";
import StatusBadge from "../../components/StatusBadge";

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "in production",
  "completed",
  "delivered",
];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [publicFilter, setPublicFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(20);

  const { token } = useAuth();

  // ----------------------------------------
  // Fetch orders
  // ----------------------------------------

  useEffect(() => {
    const loadOrders = async () => {
      if (!token) return;

      try {
        const params = { page, limit: perPage };

        if (statusFilter) params.status = statusFilter;
        if (search) params.search = search;
        if (publicFilter) params.isPublic = publicFilter;

        const data = await getAllOrdersAdmin(token, params);

        setOrders(data.orders || []);
        setTotal(data.total || 0);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error(error);
        setError(error.message || "Could not load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, statusFilter, search, publicFilter, page, perPage]);

  // ----------------------------------------
  // Inline status edit
  // ----------------------------------------

  const [editingId, setEditingId] = useState(null);
  const [editingStatus, setEditingStatus] = useState("");

  const startEditing = (order) => {
    setEditingId(order._id);
    setEditingStatus(order.orderStatus || "pending");
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingStatus("");
  };

  const saveStatus = async () => {
    if (!editingStatus || editingStatus === orders.find(o => o._id === editingId)?.orderStatus) {
      cancelEditing();
      return;
    }

    try {
      await updateOrderStatus(editingId, editingStatus, token);

      // Optimistically update
      setOrders(prev =>
        prev.map(o =>
          o._id === editingId
            ? { ...o, orderStatus: editingStatus }
            : o
        )
      );
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update status.");
    } finally {
      cancelEditing();
    }
  };

  // ----------------------------------------
  // Clear filters
  // ----------------------------------------

  const clearFilters = () => {
    setStatusFilter("");
    setSearch("");
    setPublicFilter("");
    setPage(1);
  };

  const hasActiveFilters = statusFilter || search || publicFilter;

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const formatCurrency = (amount) => {
    if (amount == null) return "—";
    return `Rs. ${amount}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
            Orders
          </h1>
          <p className="text-sage">
            Manage all customer orders. Update statuses, view details, and track production.
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
          <div className="
            grid
            md:grid-cols-[2fr_1fr_1fr_1fr]
            gap-4
          ">
            {/* Search */}
            <div className="relative">
              <FiSearch
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sage"
              />
              <input
                type="text"
                placeholder="Search by name, email, or order #"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
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

            {/* Status filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
                <option value="">All Statuses</option>
                {ALLOWED_STATUSES.map(s => (
                  <option key={s} value={s}>
                    {s.charAt(0).toUpperCase() +
                      s.slice(1).replace("in production", "In Production")}
                  </option>
                ))}
              </select>
            </div>

            {/* Public filter */}
            <div>
              <select
                value={publicFilter}
                onChange={(e) => { setPublicFilter(e.target.value); setPage(1); }}
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
                <option value="">All Orders</option>
                <option value="true">Public Only</option>
                <option value="false">Private Only</option>
              </select>
            </div>

            {/* Clear */}
            <div className="flex justify-end">
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
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-terracotta mb-4">{error}</p>
        )}

        {/* Loading */}
        {loading ? (
          <p className="text-sage">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            border border-warm-beige
            p-12
            text-center
          ">
            <h2 className="text-xl font-bold text-deep-brown mb-2">
              No orders found
            </h2>
            <p className="text-sage">
              {hasActiveFilters
                ? "Try clearing your filters to see all orders."
                : "No orders have been placed yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Orders table */}
            <div className="
              bg-parchment
              rounded-[var(--radius-lg)]
              shadow-card
              border border-warm-beige
              overflow-hidden
            ">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-warm-beige">
                      <th className="
                        text-left
                        px-6 py-4
                        text-xs font-medium text-sage
                        uppercase tracking-wider
                      ">
                        Order
                      </th>
                      <th className="
                        text-left
                        px-4 py-4
                        text-xs font-medium text-sage
                        uppercase tracking-wider
                      ">
                        Customer
                      </th>
                      <th className="
                        text-left
                        px-4 py-4
                        text-xs font-medium text-sage
                        uppercase tracking-wider
                      ">
                        Date
                      </th>
                      <th className="
                        text-left
                        px-4 py-4
                        text-xs font-medium text-sage
                        uppercase tracking-wider
                      ">
                        Status
                      </th>
                      <th className="
                        text-center
                        px-4 py-4
                        text-xs font-medium text-sage
                        uppercase tracking-wider
                      ">
                        Public
                      </th>
                      <th className="
                        text-right
                        px-4 py-4
                        text-xs font-medium text-sage
                        uppercase tracking-wider
                      ">
                        Total
                      </th>
                      <th className="
                        px-4 py-4
                        text-right
                      ">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {orders.map((order) => {
                      const totalDue =
                        (order.advanceAmount || 0) +
                        (order.remainingAmount || 0);

                      const isEditing = editingId === order._id;

                      return (
                        <tr
                          key={order._id}
                          className="
                            border-b border-warm-beige
                            last:border-0
                            hover:bg-cream/50
                            transition-colors
                          "
                        >
                          {/* Order # */}
                          <td className="
                            px-6 py-4
                            text-sm font-medium text-deep-brown
                          ">
                            #{order._id?.slice(-8)}
                          </td>

                          {/* Customer */}
                          <td className="px-4 py-4">
                            <div>
                              <p className="text-sm font-medium text-deep-brown">
                                {order.user?.name || "—"}
                              </p>
                              <p className="text-xs text-sage">
                                {order.user?.email || "—"}
                              </p>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="px-4 py-4">
                            <p className="text-sm text-sage">
                              {formatDate(order.createdAt)}
                            </p>
                          </td>

                          {/* Status — inline edit */}
                          <td className="px-4 py-4">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <select
                                  value={editingStatus}
                                  onChange={(e) =>
                                    setEditingStatus(e.target.value)
                                  }
                                  size={4}
                                  className="
                                    px-2 py-1
                                    bg-cream
                                    border border-warm-beige
                                    rounded-[var(--radius-sm)]
                                    text-sm
                                    text-deep-brown
                                    focus:outline-none
                                    focus:ring-2
                                    focus:ring-terracotta/30
                                  "
                                >
                                  {ALLOWED_STATUSES.map(s => (
                                    <option key={s} value={s}>
                                      {s.charAt(0).toUpperCase() +
                                        s.slice(1).replace("in production", "In Production")}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={saveStatus}
                                  className="
                                    p-1
                                    text-terracotta
                                    hover:text-deep-brown
                                    transition
                                  "
                                  title="Save"
                                >
                                  <FiEdit3 size={14} />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => startEditing(order)}
                                className="cursor-pointer"
                                title="Click to edit status"
                              >
                                <StatusBadge status={order.orderStatus || "pending"} />
                              </div>
                            )}
                          </td>

                          {/* Public */}
                          <td className="text-center px-4 py-4">
                            <span
                              className={`
                                text-xs
                                ${order.isPublic
                                  ? "text-sage"
                                  : "text-sage/50"}
                              `}
                            >
                              {order.isPublic ? "Public" : "Private"}
                            </span>
                          </td>

                          {/* Total */}
                          <td className="px-4 py-4 text-right">
                            <p className="text-sm font-medium text-deep-brown">
                              {formatCurrency(totalDue)}
                            </p>
                            <p className="text-xs text-sage">
                              advance: {formatCurrency(order.advanceAmount)}
                            </p>
                          </td>

                          {/* Actions */}
                          <td className="px-4 py-4 text-right">
                            <Link
                              to={`/admin/orders/${order._id}`}
                              className="
                                text-terracotta
                                hover:text-deep-brown
                                text-sm
                                font-medium
                                transition
                              "
                            >
                              View →
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="
              flex
              items-center
              justify-between
              mt-6
              text-sm text-sage
            ">
              <span>
                {total === 0
                  ? "0 orders"
                  : `Showing ${String((page - 1) * perPage + 1)}–
                    ${String(Math.min(page * perPage, total))}
                    of ${total} orders`}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  disabled={page === 1 || loading}
                  className="
                    p-2
                    border border-warm-beige
                    rounded-[var(--radius-sm)]
                    text-sage
                    hover:bg-warm-beige
                    disabled:opacity-50
                    transition
                  "
                >
                  <FiChevronLeft size={16} />
                </button>

                <span className="px-2">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages || loading}
                  className="
                    p-2
                    border border-warm-beige
                    rounded-[var(--radius-sm)]
                    text-sage
                    hover:bg-warm-beige
                    disabled:opacity-50
                    transition
                  "
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}

export default AdminOrders;
