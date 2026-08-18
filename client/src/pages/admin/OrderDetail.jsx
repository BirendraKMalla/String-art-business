import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FiEdit3, FiSave, FiX } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { getOrderByIdAdmin, updateOrderStatus } from "../../api/api";
import StatusBadge from "../../components/StatusBadge";
import Info from "../../components/Info";

const ALLOWED_STATUSES = [
  "pending",
  "confirmed",
  "in production",
  "completed",
  "delivered",
];

function AdminOrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingStatus, setEditingStatus] = useState(false);
  const [statusValue, setStatusValue] = useState("");
  const [saving, setSaving] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  // ----------------------------------------
  // Fetch order
  // ----------------------------------------

  useEffect(() => {
    const loadOrder = async () => {
      if (!token) return;

      try {
        const data = await getOrderByIdAdmin(id, token);

        setOrder(data.order || null);
      } catch (error) {
        console.error(error);
        setError(error.message || "Could not load this order.");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [id, token]);

  // ----------------------------------------
  // Status edit
  // ----------------------------------------

  const startEdit = () => {
    setEditingStatus(true);
    setStatusValue(order.orderStatus || "pending");
  };

  const cancelEdit = () => {
    setEditingStatus(false);
    setStatusValue("");
  };

  const saveEdit = async () => {
    if (!statusValue || statusValue === order.orderStatus) {
      cancelEdit();
      return;
    }

    try {
      setSaving(true);

      await updateOrderStatus(id, statusValue, token);

      setOrder(prev => ({ ...prev, orderStatus: statusValue }));
    } catch (error) {
      console.error(error);
      alert(error.message || "Failed to update status.");
    } finally {
      setSaving(false);
    }
  };

  // ----------------------------------------
  // Helpers
  // ----------------------------------------

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalDue =
    (order?.advanceAmount || 0) + (order?.remainingAmount || 0);

  const statusLabel = (s) =>
    s
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  // ----------------------------------------
  // Render
  // ----------------------------------------

  if (loading) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-sage">Loading order details...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-terracotta">{error}</p>
          <button
            onClick={() => navigate("/admin/orders")}
            className="
              mt-4
              text-terracotta
              hover:text-deep-brown
              font-medium
            "
          >
            ← Back to Orders
          </button>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-sage">Order not found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Back */}
        <Link
          to="/admin/orders"
          className="
            inline-block
            text-terracotta
            hover:text-deep-brown
            font-medium
            mb-6
          "
        >
          ← Back to Orders
        </Link>

        {/* Header */}
        <div className="
          flex
          flex-col md:flex-row
          md:items-end
          md:justify-between
          gap-6
          mb-8
        ">
          <div>
            <p className="text-xs font-medium text-terracotta tracking-wider uppercase mb-3">
              Order #{order._id}
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-2">
              {order.design?.stringArtImage
                ? "String Art Order"
                : "Custom String Art"}
            </h1>

            <p className="text-sage">
              Ordered on {formatDate(order.createdAt)}
            </p>
          </div>

          {/* Status with inline edit */}
          <div className="flex items-center gap-3">
            {editingStatus ? (
              <>
                <select
                  value={statusValue}
                  onChange={(e) => setStatusValue(e.target.value)}
                  disabled={saving}
                  className="
                    px-3 py-2
                    bg-cream
                    border border-warm-beige
                    rounded-[var(--radius-sm)]
                    text-deep-brown
                    focus:outline-none
                    focus:ring-2
                    focus:ring-terracotta/30
                    disabled:opacity-50
                  "
                >
                  {ALLOWED_STATUSES.map(s => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>

                <button
                  onClick={saveEdit}
                  disabled={saving}
                  className="
                    p-2
                    text-sage
                    hover:text-terracotta
                    disabled:opacity-50
                    transition
                  "
                  title="Save"
                >
                  <FiSave size={18} />
                </button>

                <button
                  onClick={cancelEdit}
                  className="
                    p-2
                    text-sage
                    hover:text-terracotta
                    transition
                  "
                  title="Cancel"
                >
                  <FiX size={18} />
                </button>
              </>
            ) : (
              <>
                <StatusBadge status={order.orderStatus || "pending"} />
                <button
                  onClick={startEdit}
                  className="
                    p-2
                    text-sage
                    hover:text-terracotta
                    transition
                  "
                  title="Edit status"
                >
                  <FiEdit3 size={16} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Customer Info */}
        <div className="
          bg-parchment
          rounded-[var(--radius-lg)]
          shadow-card
          border border-warm-beige
          p-6 md:p-8
          mb-8
        ">
          <h2 className="text-xl font-bold text-deep-brown mb-4">
            Customer
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Info label="Name" value={order.user?.name || "—"} />
            <Info label="Email" value={order.user?.email || "—"} />
            <Info label="Phone" value={order.user?.phone || "—"} />
            <Info label="Customer Since" value={formatDate(order.user?.createdAt)} />
          </div>
        </div>

        {/* Images */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Generated string art */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-6 md:p-8
            border border-warm-beige
          ">
            <h2 className="text-xl font-bold text-deep-brown mb-4">
              Generated String Art
            </h2>

            {order.stringArtImage ? (
              <img
                src={order.stringArtImage}
                alt="Generated string art"
                className="
                  w-full
                  rounded-[var(--radius-lg)]
                  shadow-inner
                "
              />
            ) : (
              <div className="
                bg-cream
                rounded-[var(--radius-lg)]
                p-10
                text-center
              ">
                <p className="text-sage">No generated image.</p>
              </div>
            )}
          </div>

          {/* Original photo */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-6 md:p-8
            border border-warm-beige
          ">
            <h2 className="text-xl font-bold text-deep-brown mb-4">
              Original Photo
            </h2>

            {order.originalImage ? (
              <img
                src={order.originalImage}
                alt="Original photo"
                className="
                  w-full
                  rounded-[var(--radius-lg)]
                  shadow-inner
                  object-cover
                  aspect-square
                "
              />
            ) : (
              <div className="
                bg-cream
                rounded-[var(--radius-lg)]
                p-10
                text-center
              ">
                <p className="text-sage">No original image.</p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications & Payment */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Specifications */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-6 md:p-8
            border border-warm-beige
          ">
            <h2 className="text-xl font-bold text-deep-brown mb-4">
              Specifications
            </h2>

            <div className="space-y-5">
              <Info
                label="Canvas Shape"
                value={order.canvas?.shape || "circle"}
              />
              <Info
                label="Diameter"
                value={`${order.canvas?.diameter || 24}"`}
              />
              <Info
                label="Nails"
                value={order.canvas?.nails || 300}
              />
              <Info
                label="Lines"
                value={order.canvas?.lines || 0}
              />
              <Info
                label="Line Weight"
                value={order.canvas?.lines
                  ? order.lineWeight || 35
                  : "—"}
              />
              <Info
                label="Design ID"
                value={order.design?._id?.slice(-8) || "—"}
              />
            </div>
          </div>

          {/* Payment */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-6 md:p-8
            border border-warm-beige
          ">
            <h2 className="text-xl font-bold text-deep-brown mb-4">
              Payment
            </h2>

            <div className="space-y-5">
              <Info
                label="Advance Paid"
                value={`Rs. ${order.advanceAmount || 2000}`}
              />
              <Info
                label="Remaining Amount"
                value={
                  order.remainingAmount
                    ? `Rs. ${order.remainingAmount}`
                    : "To be calculated"
                }
              />
              <Info
                label="Total Due"
                value={`Rs. ${totalDue}`}
              />
              <Info
                label="Public Display"
                value={order.isPublic ? "Yes" : "No"}
              />
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="
          bg-parchment
          rounded-[var(--radius-lg)]
          shadow-card
          p-6 md:p-8
          border border-warm-beige
          mb-8
        ">
          <h2 className="text-xl font-bold text-deep-brown mb-4">
            Delivery Address
          </h2>

          <div className="space-y-2 text-sage">
            <p>{order.deliveryAddress?.street || "N/A"}</p>
            <p>
              {order.deliveryAddress?.city || ""}
              {order.deliveryAddress?.state
                ? `, ${order.deliveryAddress.state}`
                : ""}
            </p>
          </div>
        </div>

        {/* Order Timeline (simple) */}
        <div className="
          bg-parchment
          rounded-[var(--radius-lg)]
          shadow-card
          p-6 md:p-8
          border border-warm-beige
        ">
          <h2 className="text-xl font-bold text-deep-brown mb-4">
            Timeline
          </h2>

          <div className="space-y-4 text-sm">
            <div className="flex gap-4">
              <span className="text-sage min-w-[140px]">
                Order placed
              </span>
              <span className="text-sage">
                {formatDate(order.createdAt)}
              </span>
            </div>

            <div className="flex gap-4">
              <span className="text-sage min-w-[140px]">
                Last updated
              </span>
              <span className="text-sage">
                {formatDate(order.updatedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminOrderDetail;
