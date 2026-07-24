import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, ChevronRight, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import Spinner from "../../components/common/Spinner";
import { API_URL, apiRequest, authHeader } from "../../services/api";
import { unitPriceFor } from "../../utils/pricing";

export const STOCK_COLORS = {
  "In Stock": "var(--color-primary-fixed)",
  "Low Stock": "var(--color-secondary-fixed)",
  "Out of Stock": "var(--color-error-container)",
};

// Stock status arrives from the API in English; the badge is the single place
// it gets mapped onto a translated label.
const STOCK_KEYS = {
  "In Stock": "stock.inStock",
  "Low Stock": "stock.lowStock",
  "Out of Stock": "stock.outOfStock",
};

export function StockBadge({ stock }) {
  const { t } = useTranslation();
  return (
    <span
      style={{
        height: 25,
        padding: "4px 10px",
        borderRadius: "var(--radius-full)",
        background: STOCK_COLORS[stock] || STOCK_COLORS["Out of Stock"],
        display: "inline-flex",
        alignItems: "center",
        fontSize: "var(--text-label-sm)",
        lineHeight: "var(--text-label-sm--line-height)",
        fontWeight: 700,
      }}
    >
      {STOCK_KEYS[stock] ? t(STOCK_KEYS[stock]) : stock}
    </span>
  );
}

const ACTION_KEYS = {
  Add: "home.add",
  Notify: "home.notify",
  Requested: "home.requested",
};

function ActionButton({ action, busy, onClick }) {
  const { t } = useTranslation();
  const notify = action !== "Add";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      style={{
        width: 121,
        height: 48,
        border: 0,
        cursor: "pointer",
        borderRadius: "var(--radius-default)",
        background: notify
          ? "var(--color-on-surface-variant)"
          : "var(--color-primary)",
        color: "var(--color-on-primary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        fontSize: "var(--text-label-md)",
        fontWeight: 700,
      }}
    >
      {busy ? (
        <Spinner />
      ) : notify ? (
        <Bell size={16} />
      ) : (
        <ShoppingCart size={16} />
      )}
      {busy ? t("home.saving") : t(ACTION_KEYS[action])}
    </button>
  );
}

export function ProductCard({ product }) {
  const { t } = useTranslation();
  const { user, token, addToCart } = useStore();
  const [notificationRequested, setNotificationRequested] = useState(false);
  const navigate = useNavigate();
  const isWholesale = user?.role === "verified_wholesale";
  const displayPrice = unitPriceFor(product, user?.role);
  const oldPrice =
    isWholesale && displayPrice !== product.retailPrice
      ? product.retailPrice
      : null;
  const stockText =
    product.stockStatus || (product.stock > 0 ? "In Stock" : "Out of Stock");
  const action =
    stockText === "Out of Stock"
      ? notificationRequested
        ? "Requested"
        : "Notify"
      : "Add";

  const [busy, setBusy] = useState(false);

  const handleActionClick = async (event) => {
    event.preventDefault();
    if (action === "Add") {
      addToCart(product, 1, displayPrice);
      toast.success(t("home.addedToCart", { name: product.name }));
      return;
    }
    if (!user || !token) return navigate("/login");
    setBusy(true);
    try {
      await apiRequest(`/products/${product._id}/restock-subscriptions`, {
        method: "POST",
        headers: authHeader(token),
      });
      setNotificationRequested(true);
      toast.success(t("home.restockAlert", { name: product.name }));
    } catch (error) {
      toast.error(error.message || t("home.restockFailed"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Link
      to={`/view-product?id=${product._id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
        background: "var(--color-surface-lowest)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        boxShadow: "var(--shadow-level-1)",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: 299,
      }}
    >
      <div
        style={{
          height: 222,
          background: "#F5F3F0",
          display: "block",
          position: "relative",
        }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <span
            style={{
              color: "var(--color-on-surface-variant)",
              fontSize: "var(--text-label-sm)",
            }}
          >
            {t("home.productImage")}
          </span>
        )}
      </div>
      <div
        style={{
          padding: "var(--spacing-lg)",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            fontSize: "var(--text-headline-xs)",
            fontWeight: 700,
            marginBottom: "var(--spacing-sm)",
          }}
        >
          {product.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
          }}
        >
          <div
            style={{
              fontSize: "var(--text-headline-md)",
              fontWeight: "var(--font-weight-extrabold)",
              color: isWholesale ? "var(--color-primary-container)" : "inherit",
            }}
          >
            Rs. {displayPrice}
          </div>
          {oldPrice && (
            <div
              style={{
                color: "var(--color-outline)",
                textDecoration: "line-through",
                fontSize: "var(--text-body-md)",
              }}
            >
              Rs. {oldPrice}
            </div>
          )}
        </div>
        <div
          style={{
            marginTop: "auto",
            paddingTop: "var(--spacing-lg)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <StockBadge stock={stockText} />
          <ActionButton
            action={action}
            busy={busy}
            onClick={handleActionClick}
          />
        </div>
      </div>
    </Link>
  );
}

export default function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [unit, setUnit] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const { catalogSearch } = useStore();

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (catalogSearch.trim()) params.set("search", catalogSearch.trim());
      if (selectedCategory !== "All") params.set("category", selectedCategory);
      if (unit.trim()) params.set("unit", unit.trim());
      const data = await apiRequest(
        `/products${params.size ? `?${params}` : ""}`,
      );
      setProducts(data.products || []);
    } catch (requestError) {
      setError(requestError.message || "Could not load products");
    } finally {
      setLoading(false);
    }
  }, [catalogSearch, selectedCategory, unit]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);
  useEffect(() => {
    apiRequest("/products/categories")
      .then((data) => setCategories(data.categories || []))
      .catch(() => {});
    const token = localStorage.getItem("pathivara_token");
    const stream = new EventSource(
      `${API_URL}/events${token ? `?token=${encodeURIComponent(token)}` : ""}`,
    );
    stream.addEventListener("catalog-updated", loadProducts);
    return () => stream.close();
  }, [loadProducts]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setUnit("");
  };

  const heading = catalogSearch.trim()
    ? t("home.resultsFor", { query: catalogSearch.trim() })
    : selectedCategory === "All"
      ? t("home.allProducts")
      : selectedCategory;

  return (
    <main
      style={{
        background: "var(--color-background)",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        flex: 1,
        minHeight: "100%",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "stretch",
          flex: 1,
        }}
      >
        <aside
          style={{
            width: 328,
            flex: "0 0 328px",
            background: "var(--color-surface-lowest)",
            borderRight: "1px solid var(--color-outline-variant)",
            boxShadow: "var(--shadow-level-1)",
            padding: "var(--spacing-2xl) var(--spacing-xl)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              width: "100%",
              marginBottom: "var(--spacing-lg)",
              fontSize: "var(--text-headline-sm)",
              fontWeight: 700,
            }}
          >
            {t("home.categories")}
          </h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "var(--spacing-sm)",
            }}
          >
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                style={{
                  width: 237,
                  height: 48,
                  border: 0,
                  borderRadius: "var(--radius-default)",
                  background:
                    selectedCategory === category
                      ? "var(--color-primary-fixed)"
                      : "var(--color-surface-categories)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0 var(--spacing-md)",
                  cursor: "pointer",
                }}
              >
                {category}
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={resetFilters}
            style={{
              width: 237,
              marginTop: "var(--spacing-lg)",
              fontWeight: 900,
              border: 0,
              background: "transparent",
              textAlign: "left",
              cursor: "pointer",
            }}
          >
            {t("home.seeAll")}
          </button>
          <div
            style={{
              marginTop: 128,
              width: 237,
              padding: "var(--spacing-lg)",
              borderRadius: "var(--radius-md)",
              background: "rgba(255,180,99,.1)",
              color: "var(--color-secondary)",
            }}
          >
            <strong>ⓘ {t("home.note")}</strong>
            <div style={{ marginTop: "var(--spacing-sm)" }}>
              {t("home.pickupNote")}
            </div>
          </div>
        </aside>
        <section
          style={{
            flex: 1,
            padding: "52px var(--spacing-2xl)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: filterOpen ? 16 : 52,
            }}
          >
            <h1 style={{ margin: 0, fontSize: 30, fontWeight: 700 }}>
              {heading}
            </h1>
            <button
              type="button"
              onClick={() => setFilterOpen((open) => !open)}
              style={{
                border: 0,
                background: "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                color: "#414943",
                fontSize: 16,
                fontWeight: 400,
              }}
            >
              {t("home.filter")}
              <ChevronDown size={16} />
            </button>
          </div>
          {filterOpen && (
            <div className="mb-8 flex items-center gap-3 rounded-[var(--radius-default)] border border-[var(--color-outline-variant)] bg-[var(--color-surface-lowest)] p-4">
              <label className="text-sm font-semibold">
                {t("home.unitSize")}
              </label>
              <input
                value={unit}
                onChange={(event) => setUnit(event.target.value)}
                placeholder={t("home.unitPlaceholder")}
                className="rounded border border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] px-3 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setUnit("")}
                className="text-sm font-semibold text-[var(--color-primary)]"
              >
                {t("home.clear")}
              </button>
            </div>
          )}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 299px))",
              gap: 32,
            }}
          >
            {loading ? (
              <div>{t("home.loadingProducts")}</div>
            ) : error ? (
              <div className="text-red-700">{error}</div>
            ) : products.length === 0 ? (
              <div>{t("home.noProducts")}</div>
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
