import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";
import Info from "../components/Info";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState("");

  const { token } = useAuth();

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const data = await getOrderById(id, token);

        setOrder(data.order || data || {});
      } catch (error) {
        console.error(error);

        setMessage(
          error.message || "Could not load this order."
        );
      }
    };

    loadOrder();
  }, [id, token]);

  // ----------------------------------------
  // Loading / Error
  // ----------------------------------------

  if (message) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-sage">{message}</p>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-sage">Loading order...</p>
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // Status formatting
  // ----------------------------------------

  const status = order.orderStatus || "pending";
  const orderDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Back */}
        <Link
          to="/orders"
          className="
            inline-block
            text-terracotta
            hover:text-deep-brown
            font-medium
          "
        >
          ← Back to Orders
        </Link>

        {/* Header */}
        <div className="
          mt-8
          flex flex-col md:flex-row
          md:items-end
          md:justify-between
          gap-6
        ">
          <div>
            <p className="text-xs font-medium text-terracotta tracking-wider uppercase mb-3">
              Order #{order._id}
            </p>

            <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mt-2">
              Custom String Art
            </h1>

            <p className="text-sage mt-3">Ordered on {orderDate}</p>
          </div>

          {/* Status */}
          <StatusBadge status={status} />
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8 mt-12">
          {/* Generated preview */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-8
            border border-warm-beige
          ">
            <h2 className="text-2xl font-bold text-deep-brown mb-6">
              Your String Art
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
                <p className="text-sage">Preview is not available.</p>
              </div>
            )}
          </div>

          {/* Original image */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-8
            border border-warm-beige
          ">
            <h2 className="text-2xl font-bold text-deep-brown mb-6">
              Original Photo
            </h2>

            {order.originalImage ? (
              <img
                src={order.originalImage}
                alt="Original uploaded photo"
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
                <p className="text-sage">
                  Original image is not available.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications & Payment */}
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Specifications */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-8
            border border-warm-beige
          ">
            <h2 className="text-2xl font-bold text-deep-brown mb-6">
              Specifications
            </h2>

            <div className="space-y-6">
              <Info label="Canvas" value="Circle" />
              <Info
                label="Size"
                value={`${order.canvas?.diameter || 24} inches`}
              />
              <Info label="Nails" value={order.canvas?.nails || 300} />
              <Info label="Lines" value={order.canvas?.lines || 3500} />
            </div>
          </div>

          {/* Payment */}
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            p-8
            border border-warm-beige
          ">
            <h2 className="text-2xl font-bold text-deep-brown mb-6">
              Payment
            </h2>

            <div className="space-y-6">
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
                label="Payment Status"
                value="Advance"
                className="text-terracotta"
              />
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="
          bg-parchment
          rounded-[var(--radius-lg)]
          shadow-card
          p-8
          mt-8
          border border-warm-beige
        ">
          <h2 className="text-2xl font-bold text-deep-brown mb-6">
            Delivery Address
          </h2>

          <div className="space-y-2 text-sage">
            <p>{order.deliveryAddress?.street || "N/A"}</p>
            <p>{order.deliveryAddress?.city || "N/A"}</p>
            <p>{order.deliveryAddress?.state || "N/A"}</p>
          </div>
        </div>

        {/* Public artwork */}
        <div className="
          bg-parchment
          rounded-[var(--radius-lg)]
          shadow-card
          p-8
          mt-8
          border border-warm-beige
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-6
        ">
          <div>
            <h2 className="text-xl font-bold text-deep-brown">
              Public Artwork
            </h2>

            <p className="text-sage mt-2">
              {order.isPublic
                ? "You allowed this artwork to be displayed publicly."
                : "This artwork will remain private."}
            </p>
          </div>

          <span
            className={`
              px-4 py-2
              rounded-full
              text-sm
              font-medium
              transition-colors
              ${
                order.isPublic
                  ? "bg-sageLight text-terracotta"
                  : "bg-warm-beige text-deep-brown"
              }
            `}
          >
            {order.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </div>
    </main>
  );
}

export default OrderDetails;
