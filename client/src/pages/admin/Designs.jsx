import { useEffect, useState } from "react";
import { FiSearch, FiImage, FiUser, FiCalendar } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { getAllDesigns, getDesignStats } from "../../api/api";

function AdminDesigns() {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [usedFilter, setUsedFilter] = useState("");
  const [stats, setStats] = useState(null);

  const { token } = useAuth();

  // ----------------------------------------
  // Fetch designs
  // ----------------------------------------

  useEffect(() => {
    const loadDesigns = async () => {
      if (!token) return;

      try {
        const params = {};

        if (search) params.search = search;
        if (usedFilter) params.used = usedFilter;

        const data = await getAllDesigns(token, params);

        setDesigns(data.designs || []);
      } catch (error) {
        console.error(error);
        setError(error.message || "Could not load designs.");
      } finally {
        setLoading(false);
      }
    };

    const loadStats = async () => {
      if (!token) return;

      try {
        const data = await getDesignStats(token);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadDesigns();
    loadStats();
  }, [token, search, usedFilter]);

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
    setUsedFilter("");
  };

  const hasActiveFilters = search || usedFilter;

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
            Designs
          </h1>
          <p className="text-sage">
            Browse all generated string-art designs. Identify drafts that haven't been ordered yet.
          </p>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="
            grid
            sm:grid-cols-3
            gap-4
            mb-8
          ">
            <div className="
              bg-parchment
              rounded-[var(--radius-lg)]
              shadow-card
              border border-warm-beige
              p-5
            ">
              <p className="text-xs text-sage uppercase tracking-wider">
                Total Designs
              </p>
              <p className="text-2xl font-bold text-deep-brown mt-1">
                {stats.totalDesigns || 0}
              </p>
            </div>

            <div className="
              bg-parchment
              rounded-[var(--radius-lg)]
              shadow-card
              border border-warm-beige
              p-5
            ">
              <p className="text-xs text-sage uppercase tracking-wider">
                Converted to Orders
              </p>
              <p className="text-2xl font-bold text-terracotta mt-1">
                {stats.used || 0}
              </p>
            </div>

            <div className="
              bg-parchment
              rounded-[var(--radius-lg)]
              shadow-card
              border border-warm-beige
              p-5
            ">
              <p className="text-xs text-sage uppercase tracking-wider">
                Drafts (Unordered)
              </p>
              <p className="text-2xl font-bold text-sage mt-1">
                {stats.unused || 0}
              </p>
            </div>
          </div>
        )}

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
                placeholder="Search by customer email..."
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

            {/* Used filter */}
            <div className="w-full sm:w-48">
              <select
                value={usedFilter}
                onChange={(e) => setUsedFilter(e.target.value)}
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
                <option value="">All Designs</option>
                <option value="true">Converted to Orders</option>
                <option value="false">Drafts Only</option>
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
          <p className="text-sage">Loading designs...</p>
        ) : designs.length === 0 ? (
          <div className="
            bg-parchment
            rounded-[var(--radius-lg)]
            shadow-card
            border border-warm-beige
            p-12
            text-center
          ">
            <div className="
              w-16 h-16
              mx-auto
              bg-terracotta/10
              rounded-full
              flex items-center justify-center
              mb-4
            ">
              <FiImage size={28} className="text-terracotta" />
            </div>

            <h2 className="text-xl font-bold text-deep-brown mb-2">
              No designs found
            </h2>

            <p className="text-sage">
              {hasActiveFilters
                ? "Try clearing your filters."
                : "No designs have been generated yet."}
            </p>
          </div>
        ) : (
          <div className="
            grid
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          ">
            {designs.map((design) => (
              <div
                key={design._id}
                className="
                  bg-parchment
                  rounded-[var(--radius-lg)]
                  shadow-card
                  border border-warm-beige
                  overflow-hidden
                  transition-all duration-250
                  hover:shadow-card-hover
                  hover:border-terracotta
                "
              >
                {/* Image */}
                {design.stringArtImage ? (
                  <div className="
                    aspect-square
                    bg-cream
                    overflow-hidden
                  ">
                    <img
                      src={design.stringArtImage}
                      alt="Generated string art"
                      className="
                        w-full h-full
                        object-cover
                        transition-transform duration-300
                        group-hover:scale-105
                      "
                    />
                  </div>
                ) : (
                  <div className="
                    aspect-square
                    bg-cream
                    flex
                    items-center
                    justify-center
                  ">
                    <FiImage size={32} className="text-sage" />
                  </div>
                )}

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiUser size={14} className="text-sage" />
                    <p className="text-sm text-sage">
                      {design.user?.name || "—"}
                    </p>
                    <span className="text-sage/30">•</span>
                    <p className="text-xs text-sage">
                      {design.user?.email || ""}
                    </p>
                  </div>

                  <div className="
                    grid
                    grid-cols-2
                    gap-3
                    text-sm
                  ">
                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider">
                        Nails
                      </p>
                      <p className="text-deep-brown font-medium">
                        {design.canvas?.nails || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider">
                        Lines
                      </p>
                      <p className="text-deep-brown font-medium">
                        {design.canvas?.lines || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider">
                        Size
                      </p>
                      <p className="text-deep-brown font-medium">
                        {design.size || 0}px
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-sage uppercase tracking-wider">
                        Diameter
                      </p>
                      <p className="text-deep-brown font-medium">
                        {design.canvas?.diameter || 0}"
                      </p>
                    </div>
                  </div>

                  <div className="
                    flex
                    items-center
                    gap-2
                    mt-3
                    text-xs
                    text-sage
                  ">
                    <FiCalendar size={12} />
                    {formatDate(design.createdAt)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default AdminDesigns;
