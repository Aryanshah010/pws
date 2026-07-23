import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, Bell, ChevronLeft, ShoppingCart } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import { useGoBack } from "../../hooks/useBackNavigation";
import { tiersFor, tierAt } from "../../utils/pricing";
import { ProductCard } from "../home/HomePage";

export default function ViewProductDetailIS() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [restockMessage, setRestockMessage] = useState("");
  // Tracked separately from the message: a failed attempt also produces a
  // message, and that must not read as a successful subscription.
  const [restockRequested, setRestockRequested] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const { user, token, addToCart } = useStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = useGoBack();

  useEffect(() => {
    // Similar-product cards swap the id on this same route, so the previous
    // product's restock state has to be cleared with it.
    setRestockRequested(false);
    setRestockMessage("");
    if (!id) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const data = await apiRequest(`/products/${id}`);
        setProduct(data.product);
        const related = await apiRequest(
          `/products?category=${encodeURIComponent(data.product.category)}`,
        );
        setSimilarProducts(
          (related.products || [])
            .filter((item) => item._id !== id)
            .slice(0, 3),
        );
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (loading)
    return <div className="p-8 text-center">{t("product.loading")}</div>;
  if (!product)
    return (
      <div className="p-8 text-center text-red-500">
        {t("product.notFound")}
      </div>
    );

  const validTiers = tiersFor(product, user?.role);
  const activeTier = tierAt(validTiers, quantity);
  const activeTierIndex = activeTier ? validTiers.indexOf(activeTier) : -1;

  const displayPrice = product.retailPrice;
  const oldPrice = null;

  const isOutOfStock = product.stock <= 0;
  const stockText =
    product.stockStatus || (isOutOfStock ? "Out of Stock" : "In Stock");
  const pricePoints = (
    product.priceHistory?.length
      ? product.priceHistory
      : [{ price: product.retailPrice }]
  )
    .slice(-12)
    .map((point) => point.price);
  const firstPrice = pricePoints[0] || product.retailPrice;
  const latestPrice =
    pricePoints[pricePoints.length - 1] || product.retailPrice;
  const trendPercent = firstPrice
    ? ((latestPrice - firstPrice) / firstPrice) * 100
    : 0;
  const maxPrice = Math.max(...pricePoints, 1);
  // Buy Now bypasses the cart page: the item is placed in the cart (checkout
  // reads from there) and we jump straight to /checkout.
  const handleBuyNow = () => {
    if (!user || !token) return navigate("/login");
    addToCart(product, quantity, displayPrice);
    navigate("/checkout");
  };

  const handleRestock = async () => {
    if (!user || !token) return navigate("/login");
    try {
      await apiRequest(`/products/${product._id}/restock-subscriptions`, {
        method: "POST",
        headers: authHeader(token),
      });
      setRestockRequested(true);
      setRestockMessage(t("product.restockRequested"));
      toast.success(t("home.restockAlert", { name: product.name }));
    } catch (error) {
      const message = error.message || "Could not request notification";
      setRestockRequested(false);
      setRestockMessage(message);
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-(--color-background) ">
      {/* Product Detail sub-header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2 md:pt-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={goBack}
            aria-label={t("common.goBack")}
            className="inline-flex items-center justify-center w-6 h-6 text-[var(--color-on-surface)] hover:opacity-70 transition shrink-0"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-headline-sm md:text-headline-md font-semibold text-[var(--color-on-surface)]">
            {t("product.detail")}
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Product Card */}
          <div className="lg:col-span-2 ">
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-variant  shadow-(--shadow-level-1) overflow-hidden">
              <div className="flex flex-col md:flex-row  divide-x divide-gray-200 ">
                {/* Product Image */}
                <div className="flex-shrink-0 w-full md:w-[38%] p-6 flex items-center justify-center">
                  <img
                    src={product.imageUrl || undefined}
                    alt={product.name}
                    className="w-full max-w-70 aspect-square object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 p-6 md:p-8 md:pl-0 ml-6  flex flex-col justify-center">
                  <div className="mb-4">
                    <h2 className="text-headline-md md:text-headline-lg font-[900] md:font-bold text-on-primary-fixed mb-3">
                      {product.name}
                    </h2>
                    <p className="text-body-md md:text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                      {product.description ||
                        `High quality ${product.category} for your daily needs. Best in class ${product.unit} packaging.`}
                    </p>
                  </div>

                  {/* Price Section */}
                  <div className="mb-4">
                    <p className="text-[13px] font-semibold text-on-surface-variant mb-2">
                      {t("product.yourPrice")}
                    </p>
                    <div className="flex items-baseline gap-3 mb-3">
                      <span className="text-3xl md:text-4xl font-bold text-[var(--color-on-primary-fixed)]">
                        Rs. {displayPrice}
                      </span>
                      {oldPrice && (
                        <span className="text-body-md md:text-body-lg text-[var(--color-on-surface-variant)] line-through opacity-60">
                          Rs. {oldPrice}
                        </span>
                      )}
                    </div>
                    <div>
                      <span
                        className={`h-6.25 mt-4 px-[8px] py-[4px] rounded-full inline-flex items-center text-(--text-label-sm) leading-(--text-label-sm--line-height) font-bold ${isOutOfStock ? "bg-red-100 text-red-800" : "bg-primary-fixed"}`}
                      >
                        {stockText}
                      </span>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center border border-outline-variant rounded-default bg-[var(--color-surface-categories)] overflow-hidden">
                      <button
                        onClick={decrementQty}
                        className="p-3 text-[var(--color-on-surface)] hover:bg-[var(--color-surface-lowest)] transition"
                      >
                        <svg width="9" height="2" viewBox="0 0 9 2" fill="none">
                          <path
                            d="M0 1.16667V0H8.16667V1.16667H0Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                      <input
                        type="text"
                        value={quantity}
                        readOnly
                        className="flex-1 text-center font-bold text-[var(--color-on-surface)] bg-transparent py-2 px-4 outline-none"
                      />
                      <button
                        onClick={incrementQty}
                        className="p-3 text-[var(--color-on-surface)] hover:bg-[var(--color-surface-lowest)] transition"
                      >
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
                          <path
                            d="M3.5 4.66667H0V3.5H3.5V0H4.66667V3.5H8.16667V4.66667H4.66667V8.16667H3.5V4.66667Z"
                            fill="currentColor"
                          />
                        </svg>
                      </button>
                    </div>

                    <div className="flex mt-4 justify-between flex-col sm:flex-row gap-3 sm:gap-0">
                      <button
                        disabled={isOutOfStock}
                        onClick={() => {
                          addToCart(product, quantity, displayPrice);
                          toast.success(
                            t("product.addedToCart", {
                              quantity,
                              name: product.name,
                            }),
                          );
                        }}
                        className={`w-62 h-[48px] border-0 rounded-default flex items-center justify-center gap-1.5 font-bold ${isOutOfStock ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-primary text-(--color-on-primary) cursor-pointer hover:opacity-90"}`}
                      >
                        <ShoppingCart size={16} />
                        {isOutOfStock
                          ? t("stock.outOfStock")
                          : t("product.addToCart")}
                      </button>
                      <button
                        type="button"
                        disabled={isOutOfStock && restockRequested}
                        onClick={isOutOfStock ? handleRestock : handleBuyNow}
                        className={`w-30.25 h-[48px] border-0 rounded-default flex items-center justify-center gap-1.5 font-bold shadow-(--shadow-level-2) ${
                          isOutOfStock && restockRequested
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : "bg-outline-border-pill text-(--color-on-secondary) cursor-pointer hover:bg-gray-100"
                        }`}
                      >
                        {isOutOfStock ? <Bell size={16} /> : null}
                        {isOutOfStock
                          ? restockRequested
                            ? t("product.requested")
                            : t("product.notify")
                          : t("product.buyNow")}
                      </button>
                    </div>
                    {restockMessage && (
                      <p
                        className={`text-sm ${restockRequested ? "text-primary" : "text-error"}`}
                      >
                        {restockMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Out Of Stock Contextual Notice Banner */}
            {isOutOfStock && (
              <div className="flex items-start gap-3 rounded-md border border-secondary-fixed-dim bg-secondary-fixed p-4 shadow-(--shadow-level-1)">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-on-secondary-container" />
                <p className="text-sm font-semibold text-on-secondary-container leading-relaxed">
                  {t("product.outOfStockNotice")}
                </p>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Wholesale Pricing Card */}
            <div className="bg-[var(--color-surface-categories)] rounded-[var(--radius-md)] border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)]">
              <h3 className="font-bold text-[var(--color-on-primary-fixed)] mb-4">
                {t("product.discountTable")}
              </h3>

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <div>{t("product.qty")}</div>
                  <div>{t("product.price")}</div>
                  <div className="text-right">{t("product.saving")}</div>
                </div>

                <div className="grid grid-cols-3 gap-2 px-3 py-3 bg-(--color-surface-lowest) rounded-default border border-outline-variant/20">
                  <div className="text-sm font-medium text-(--color-on-surface)">
                    {t("product.retail")}
                  </div>
                  <div className="text-sm font-bold text-[var(--color-on-primary-fixed)]">
                    Rs. {product.retailPrice}
                  </div>
                  <div className="text-right text-xs text-[var(--color-on-surface-variant)] italic opacity-60">
                    {t("common.none")}
                  </div>
                </div>

                {validTiers.map((tier, index) => {
                  const saving = (
                    (tier.discountAmount /
                      (product.retailPrice * tier.minQuantity)) *
                    100
                  ).toFixed(1);
                  const isActive = index === activeTierIndex;
                  return (
                    <div
                      key={index}
                      className={`grid grid-cols-3 gap-2 px-3 py-3 rounded-default border ${isActive ? "bg-[var(--color-secondary-fixed)]/40 border-[var(--color-secondary)]" : "bg-[var(--color-secondary-fixed)]/20 border-[var(--color-secondary-fixed-dim)]/30"}`}
                    >
                      <div className="text-sm font-medium text-[var(--color-on-surface)]">
                        {tier.maxQuantity
                          ? `${tier.minQuantity}–${tier.maxQuantity}`
                          : `${tier.minQuantity}+`}
                      </div>
                      <div className="text-sm font-bold text-[var(--color-secondary)]">
                        Rs. {tier.discountAmount} off
                      </div>
                      <div className="text-right text-xs font-bold text-[var(--color-secondary)]">
                        up to {saving}%
                      </div>
                    </div>
                  );
                })}

                {validTiers.length === 0 && (
                  <p className="px-3 py-3 text-xs text-[var(--color-on-surface-variant)]">
                    {t("product.noDiscounts")}
                  </p>
                )}
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)]">
              <h3 className="font-bold text-[var(--color-on-primary-fixed)] mb-4">
                {t("product.specifications")}
              </h3>

              <div className="space-y-0 divide-y divide-[var(--color-outline-variant)]/20">
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    {t("product.grade")}
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.grade || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    {t("product.unitSize")}
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.unit || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    {t("product.packCount")}
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.packCount || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    {t("product.shelfLife")}
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.shelfLife || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    {t("product.origin")}
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.origin || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* 30-Day Price Trend */}
            <div className="bg-[var(--color-surface-lowest)] rounded-[var(--radius-md)] border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[var(--color-on-primary-fixed)]">
                  30-Day Trend
                </h3>
                <div className="inline-block px-2.5 py-1 bg-[var(--color-primary-fixed)] rounded-full">
                  <span className="text-xs font-bold text-[var(--color-on-primary-fixed)]">
                    {trendPercent > 0 ? "+" : ""}
                    {trendPercent.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-center gap-1 h-24 py-4 px-2">
                {pricePoints.map((price, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${Math.max((price / maxPrice) * 100, 8)}%`,
                      backgroundColor:
                        i < pricePoints.length - 4
                          ? "rgba(0, 69, 43, 0.2)"
                          : i < pricePoints.length - 1
                            ? "rgba(0, 69, 43, 0.6)"
                            : "var(--color-primary)",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between items-start text-xs text-[var(--color-on-surface-variant)]">
                <div>30d ago</div>
                <div className="font-bold text-[var(--color-on-primary-fixed)]">
                  Today (Rs. {latestPrice})
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "var(--spacing-3xl)" }}>
          <h2
            style={{
              margin: 0,
              marginBottom: 24,
              fontSize: 30,
              fontWeight: 700,
              color: "var(--color-on-background)",
            }}
          >
            {t("product.similarProducts")}
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(297px,1fr))",
              gap: 34,
            }}
          >
            {similarProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
