import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../api/api";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import StatusBadge from "../components/StatusBadge";
import Info from "../components/Info";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const { token } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyOrders(token);

        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);

        setMessage(
          error.message || "Could not load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  // ----------------------------------------
  // Loading
  // ----------------------------------------

  if (loading) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <p className="text-sage">Loading your orders...</p>
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // Not logged in / error
  // ----------------------------------------

  if (message) {
    return (
      <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-8">
            <p className="text-xs font-medium text-terracotta tracking-wider uppercase mb-3">
              YOUR STUDIO
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-deep-brown mb-4">
              My Orders
            </h1>
          </div>

          <p className="text-sage">{message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-cream min-h-screen px-4 md:px-8 py-20">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-medium text-terracotta tracking-wider uppercase mb-3">
            YOUR STUDIO
          </p>

          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-deep-brown">
              My Orders
            </h1>

            {/* Decorative gold line */}
            <div className="hidden md:block flex-1 h-px bg-gold-accent opacity-40" />
          </div>

          <p className="text-sage max-w-2xl">
            Track your string-art pieces and view your previous orders.
          </p>
        </div>

        {/* No orders */}
        {orders.length === 0 && (
          <div className="
            bg-parchment
            rounded-[var(--radius-xl)]
            shadow-card
            p-12
            text-center
            border border-warm-beige
          ">
            <h2 className="text-2xl font-bold text-deep-brown mb-4">
              No orders yet
            </h2>

            <p className="text-sage mb-8">
              Create your first custom string-art piece.
            </p>

            <Button variant="primary" size="md" className="rounded-full">
              <Link to="/create" className="flex items-center gap-2">
                Create String Art →
              </Link>
            </Button>
          </div>
        )}

        {/* Orders */}
        <div className="space-y-8">
          {orders.map((order) => {
            const status = order.orderStatus || "pending";
            const orderDate = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString()
              : "N/A";

            return (
              <div
                key={order._id}
                className="
                  bg-parchment
                  rounded-[var(--radius-lg)]
                  shadow-card
                  overflow-hidden
                  border border-warm-beige
                  transition-shadow duration-300
                  hover:shadow-card-hover
                "
              >
                <div className="grid md:grid-cols-[220px_1fr]">
                  {/* Image */}
                  <div className="bg-warm-beige p-5">
                    {order.stringArtImage ? (
                      <img
                        src={order.stringArtImage}
                        alt="String art"
                        className="
                          w-full
                          h-full
                          min-h-[220px]
                          object-contain
                          rounded-[var(--radius-lg)]
                        "
                      />
                    ) : (
                      <div className="
                        min-h-[220px]
                        flex
                        items-center
                        justify-center
                        text-sage
                        rounded-[var(--radius-lg)]
                      ">
                        No preview
                      </div>
                    )}
                  </div>

                  {/* Information */}
                  <div className="p-7 md:p-9">
                    <div className="
                      flex
                      flex-col md:flex-row
                      md:items-start
                      md:justify-between
                      gap-4
                    ">
                      <div>
                        <p className="text-xs font-medium text-terracotta tracking-wider uppercase">
                          Order #{order._id}
                        </p>

                        <h2 className="text-2xl font-bold text-deep-brown mt-2">
                          Custom String Art
                        </h2>

                        <p className="text-sm text-sage mt-2">
                          {orderDate}
                        </p>
                      </div>

                      <StatusBadge status={status} className="self-start" />
                    </div>

                    {/* Specifications */}
                    <div className="
                      grid
                      grid-cols-2
                      md:grid-cols-4
                      gap-6
                      mt-8
                      pt-6
                      border-t border-warm-beige
                    ">
                      <Info label="Canvas" value="Circle" />
                      <Info
                        label="Size"
                        value={`${order.canvas?.diameter || 24}"`}
                      />
                      <Info label="Nails" value={order.canvas?.nails || 300} />
                      <Info label="Lines" value={order.canvas?.lines || 3500} />
                    </div>

                    {/* Bottom */}
                    <div className="
                      mt-8
                      flex
                      flex-col sm:flex-row
                      sm:items-center
                      sm:justify-between
                      gap-5
                    ">
                      <div>
                        <p className="text-xs text-sage uppercase tracking-wider">
                          Advance
                        </p>

                        <p className="font-semibold text-deep-brown mt-1">
                          Rs. {order.advanceAmount || 2000}
                        </p>
                      </div>

                      <Button variant="ghost" size="md" className="rounded-full">
                        <Link to={`/orders/${order._id}`} className="flex items-center gap-2">
                          View Order →
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

export default MyOrders;
