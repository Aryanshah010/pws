import { useEffect, useState } from "react";
import { ChevronLeft, ShoppingCart, Bell, AlertCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import { ProductCard } from "../home/HomePage";


export default function ViewProductDetailOOS() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [restockMessage, setRestockMessage] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const id = new URLSearchParams(location.search).get("id");
  const { user, token } = useStore();

  useEffect(() => {
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

  const handleRestock = async () => {
    if (!user || !token) return navigate("/login");
    try {
      await apiRequest(`/products/${product._id}/restock-subscriptions`, {
        method: "POST",
        headers: authHeader(token),
      });
      setRestockMessage("Restock notification requested");
      toast.success(`We'll alert you when ${product.name} is back`);
    } catch (error) {
      const message = error.message || "Could not request notification";
      setRestockMessage(message);
      toast.error(message);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading product details...</div>;
  if (!product)
    return (
      <div className="p-8 text-center text-red-500">Product not found.</div>
    );

  const isWholesale = user?.role === "verified_wholesale";
  const startingTier = product.tierPrices?.find(
    (tier) => tier.minQuantity <= 1,
  );
  const displayPrice =
    isWholesale && startingTier?.price < product.retailPrice
      ? startingTier.price
      : product.retailPrice;
  const oldPrice =
    displayPrice !== product.retailPrice ? product.retailPrice : null;

  return (
    <div className="min-h-screen bg-(--color-background)">
      {/* Product Detail sub-header */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6 pb-2 md:pt-8">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center w-6 h-6 text-[var(--color-on-surface)] hover:opacity-70 transition shrink-0"
          >
            <ChevronLeft size={24} />
          </Link>
          <h1 className="text-headline-sm md:text-headline-md font-semibold text-[var(--color-on-surface)]">
            Product Detail
          </h1>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Product Card & Alert Notification */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-variant shadow-(--shadow-level-1) overflow-hidden">
              <div className="flex flex-col md:flex-row divide-x divide-gray-200">
                {/* Product Image Wrapper */}
                <div className="flex-shrink-0 w-full md:w-[38%] p-6 flex items-center justify-center">
                  <img
                    src={product.imageUrl || undefined}
                    alt={product.name}
                    className="w-full max-w-70 aspect-square object-contain"
                  />
                </div>

                {/* Product Description Details */}
                <div className="flex-1 p-6 md:p-8 md:pl-0 ml-6 flex flex-col justify-center">
                  <div className="mb-4">
                    <h2 className="text-headline-md md:text-headline-lg font-[900] md:font-bold text-on-primary-fixed mb-3">
                      {product.name}
                    </h2>
                    <p className="text-body-md md:text-body-lg text-[var(--color-on-surface-variant)] leading-relaxed">
                      {product.description ||
                        `High quality ${product.category} for your daily needs. Best in class ${product.unit} packaging.`}
                    </p>
                  </div>

                  {/* Price Block */}
                  <div className="mb-4">
                    <p className="text-[13px] font-semibold text-on-surface-variant mb-2">
                      Your buyer price:
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
                      {/* Out of Stock Status Flag */}
                      <span className="h-6.25 mt-4 px-[8px] py-[4px] rounded-full bg-[#ffdad6] text-[#93000A] inline-flex items-center text-(--text-label-sm) leading-(--text-label-sm--line-height) font-bold">
                        OUT OF STOCK
                      </span>
                    </div>
                  </div>

                  {/* Quantity Actions & Interactive States */}
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex items-center border border-outline-variant rounded-default bg-[var(--color-surface-categories)] opacity-60 overflow-hidden">
                      <button
                        onClick={decrementQty}
                        disabled
                        className="p-3 text-[var(--color-on-surface)] cursor-not-allowed opacity-50"
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
                        className="flex-1 text-center font-bold text-[var(--color-on-surface)] bg-transparent py-2 px-4 outline-none cursor-not-allowed"
                      />
                      <button
                        onClick={incrementQty}
                        disabled
                        className="p-3 text-[var(--color-on-surface)] cursor-not-allowed opacity-50"
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
                      {/* Disabled Add to Cart Action */}
                      <button
                        disabled
                        className="w-62 h-[48px] border-0 cursor-not-allowed rounded-default bg-[#e4e2df] flex items-center justify-center gap-1.5 text-[#404943]/50 font-bold"
                      >
                        <ShoppingCart size={16} />
                        Add to Cart
                      </button>
                      {/* Active Restock Notification Action */}
                      <button
                        onClick={handleRestock}
                        disabled={
                          restockMessage === "Restock notification requested"
                        }
                        className="w-30.25 h-[48px] border-0 cursor-pointer rounded-default bg-outline-border-pill text-white flex items-center justify-center gap-1.5 font-bold shadow-(--shadow-level-2) hover:opacity-90 transition disabled:opacity-60"
                      >
                        <Bell size={16} />
                        {restockMessage ? "Requested" : "Notify"}
                      </button>
                    </div>
                    {restockMessage && (
                      <p className="text-sm text-[var(--color-primary)]">
                        {restockMessage}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Out Of Stock Contextual Notice Banner */}
            <div className="flex items-start gap-3 rounded-[12px] border border-[#ffb86b] bg-[#ffdcbc] p-4 shadow-(--shadow-level-1)">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#6b3f00]" />
              <p className="text-sm font-semibold text-[#6b3f00] leading-relaxed">
                This Item cannot be ordered right now. You can click on notify
                to get SMS and notifications when the product is back in stock.
              </p>
            </div>
          </div>

          {/* Right Column: Inactive Informational Tables (Blurred) */}
          <div className="flex flex-col gap-6">
            {/* Wholesale Pricing Card (Blurred) */}
            <div className="bg-[var(--color-surface-categories)] rounded-[var(--radius-md)] border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)] filter blur-[1.5px] opacity-50 pointer-events-none select-none">
              <h3 className="font-bold text-[var(--color-on-primary-fixed)] mb-4">
                Discount Pricing Table
              </h3>

              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2 px-3 py-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  <div>QTY</div>
                  <div>PRICE</div>
                  <div className="text-right">SAVING</div>
                </div>

                <div className="grid grid-cols-3 gap-2 px-3 py-3 bg-(--color-surface-lowest) rounded-default border border-outline-variant/20">
                  <div className="text-sm font-medium text-(--color-on-surface)">
                    Retail
                  </div>
                  <div className="text-sm font-bold text-[var(--color-on-primary-fixed)]">
                    Rs. {product.retailPrice}
                  </div>
                  <div className="text-right text-xs text-[var(--color-on-surface-variant)] italic opacity-60">
                    None
                  </div>
                </div>

                {product.tierPrices?.map((tier, index) => {
                  const isBest = index === product.tierPrices.length - 1;
                  const saving = (
                    ((product.retailPrice - tier.price) / product.retailPrice) *
                    100
                  ).toFixed(1);
                  return (
                    <div
                      key={index}
                      className={
                        isBest
                          ? "grid grid-cols-3 gap-2 px-3 py-3 bg-[var(--color-primary)] rounded-default text-[var(--color-on-primary)]"
                          : "grid grid-cols-3 gap-2 px-3 py-3 bg-[var(--color-secondary-fixed)]/20 rounded-default border border-[var(--color-secondary-fixed-dim)]/30"
                      }
                    >
                      <div
                        className={
                          isBest
                            ? "text-sm font-medium"
                            : "text-sm font-medium text-[var(--color-on-surface)]"
                        }
                      >
                        {tier.minQuantity}+
                      </div>
                      <div
                        className={
                          isBest
                            ? "text-sm font-bold"
                            : "text-sm font-bold text-[var(--color-secondary)]"
                        }
                      >
                        Rs. {tier.price}
                      </div>
                      <div
                        className={
                          isBest
                            ? "text-right text-xs font-bold"
                            : "text-right text-xs font-bold text-[var(--color-secondary)]"
                        }
                      >
                        {isBest ? "Best Rate" : `${saving}% Off`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Specifications Table (Blurred) */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)] filter blur-[1.5px] opacity-50 pointer-events-none select-none">
              <h3 className="font-bold text-[var(--color-on-primary-fixed)] mb-4">
                Specifications
              </h3>

              <div className="space-y-0 divide-y divide-[var(--color-outline-variant)]/20">
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Grade
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.grade || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Unit Size
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.unit || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Shelf Life
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.shelfLife || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Origin
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    {product.origin || "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Recommendation Grid Layout */}
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
            Similar Products
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
