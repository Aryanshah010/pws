import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Trash2,
  Pencil,
  AlertTriangle,
} from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import { useGoBack } from "../../hooks/useBackNavigation";

const BasketReview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const goBack = useGoBack("/myorder");
  const basketId = new URLSearchParams(location.search).get("id");
  const { token, addToCart, loadCart } = useStore();

  const [basket, setBasket] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notified, setNotified] = useState({});

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!basketId) {
      setError("No basket selected.");
      setLoading(false);
      return;
    }
    apiRequest(`/orders/baskets/${basketId}/review`, {
      headers: authHeader(token),
    })
      .then((data) => {
        setBasket(data.basket);
        setItems(data.items);
      })
      .catch((requestError) =>
        setError(requestError.message || "Could not load this basket"),
      )
      .finally(() => setLoading(false));
  }, [basketId, token, navigate]);

  const dropItem = (productId, name) => {
    setItems((current) =>
      current.filter((item) => String(item.productId) !== String(productId)),
    );
    if (name) toast.info(`${name} removed from this basket`);
  };

  const keepItem = (item) => {
    addToCart(item.product, item.quantity, item.unitPrice);
    dropItem(item.productId);
    toast.success(`${item.name} added to cart`);
  };

  const notifyMe = async (item) => {
    try {
      await apiRequest(`/products/${item.productId}/restock-subscriptions`, {
        method: "POST",
        headers: authHeader(token),
      });
      setNotified((current) => ({ ...current, [item.productId]: true }));
      toast.success(`We'll alert you when ${item.name} is back`);
    } catch (requestError) {
      const message = requestError.message || "Could not request notification";
      setError(message);
      toast.error(message);
    }
  };

  const checkout = () => {
    loadCart(
      items
        .filter((item) => item.available)
        .map((item) => ({
          product: item.product,
          quantity: item.quantity,
          price: item.unitPrice,
        })),
    );
    toast.success(`${availableItems.length} item(s) moved to your cart`);
    navigate("/cart");
  };

  const availableItems = items.filter((item) => item.available);
  const summary = {
    availableCount: availableItems.length,
    priceChangedCount: items.filter((item) => item.priceDelta !== 0).length,
    outOfStockCount: items.length - availableItems.length,
    estimatedTotal: availableItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0,
    ),
  };

  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-on-background) p-4 md:p-8 lg:px-16">
      {/* Top Navigation Row (Back Button) */}
      <div className="mx-8 mb-6">
        <button
          onClick={goBack}
          aria-label="Go back"
          className="p-2 hover:bg-surface-dim rounded-full transition-colors text-(--color-on-surface)"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-(length:--text-headline-lg) leading-(--text-headline-lg--line-height) font-(--text-headline-lg--font-weight)">
            {basket?.name || "My Basket Review"}
          </h1>

          <div className="flex items-center gap-2 bg-[var(--color-surface-categories)] px-4 py-2 rounded-default border border-[var(--color-outline-variant)]">
            <CheckCircle2 size={16} className="text-[var(--color-primary)]" />
            <span className="text-(length:--text-label-sm) leading-(--text-label-sm--line-height) font-semibold text-on-surface-variant uppercase tracking-wider">
              Current stock and prices checked today
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Basket Items */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Items Table/List */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-border shadow-(--shadow-level-1) overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-4 px-6 py-4 border-b border-outline-variant bg-[#F5F3F0]">
                <div className="text-[length:var(--text-label-sm)] font-semibold text-[#414943] uppercase tracking-wider">
                  Item
                </div>
                <div className="text-[length:var(--text-label-sm)] font-semibold text-[#414943] uppercase tracking-wider">
                  Status
                </div>
                <div className="text-[length:var(--text-label-sm)] font-semibold text-[#414943] uppercase tracking-wider">
                  Action
                </div>
              </div>

              {loading && (
                <p className="p-6 text-center text-[#717973]">
                  Checking today&apos;s stock and prices...
                </p>
              )}

              {!loading && error && (
                <p className="p-6 text-center text-[var(--color-error)]">
                  {error}
                </p>
              )}

              {!loading && !error && items.length === 0 && (
                <p className="p-6 text-center text-[#717973]">
                  Nothing left to review in this basket.
                </p>
              )}

              {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (!item.available) {
                  return (
                    <div
                      key={item.productId}
                      className="grid grid-cols-[2fr_1.5fr_1fr] px-6 py-5 items-center bg-[#FBF9F5]"
                    >
                      <div>
                        <div className="text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-outline)]">
                          {item.name}{" "}
                          <span className="text-[#717973] font-semibold text-(length:--text-body-md)">
                            x{item.quantity}
                          </span>
                        </div>
                        <div className="text-[length:var(--text-label-md)] text-[var(--color-outline)] mt-1">
                          <span>
                            Last Rs.{item.priceAtSave ?? item.unitPrice}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className="bg-error-container text-on-error-container px-2 py-1 rounded-full text-(length:--text-label-sm) font-bold">
                          OUT OF STOCK
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => notifyMe(item)}
                          disabled={notified[item.productId]}
                          className="border border-outline-border text-(--color-on-surface) px-4 py-1 rounded-full text-[13px] font-semibold hover:bg-surface-dim transition-colors disabled:opacity-60"
                        >
                          {notified[item.productId] ? "Requested" : "Notify"}
                        </button>
                        <button
                          onClick={() => dropItem(item.productId, item.name)}
                          className="text-[var(--color-error)] hover:bg-[var(--color-error-container)] p-1.5 rounded-[var(--radius-sm)] transition-colors"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  );
                }

                /* In-stock row, with the price-change chip when it moved. */
                return (
                  <div
                    key={item.productId}
                    className={`grid grid-cols-[2fr_1.5fr_1fr] gap-4 px-6 py-5 items-center ${
                      isLast
                        ? ""
                        : "border-b border-[var(--color-outline-variant)]"
                    }`}
                  >
                    <div>
                      <div className="text-[length:var(--text-body-lg)] font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface)]">
                        {item.name}{" "}
                        <span className="text-[#717973] font-semibold text-(length:--text-body-md)">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="text-[length:var(--text-label-md)] text-[var(--color-on-surface-variant)] mt-1">
                        {item.priceAtSave != null && (
                          <span
                            className={`line-through text-outline mr-2 ${
                              item.priceDelta === 0
                                ? "border-r border-w-[2px] border-[#C1C8C1]"
                                : ""
                            }`}
                          >
                            Last Rs.{item.priceAtSave}
                          </span>
                        )}
                        <span
                          className={`text-[14px] font-semibold ${
                            item.priceDelta !== 0 ? "text-secondary" : ""
                          }`}
                        >
                          Today Rs.{item.unitPrice}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {item.priceDelta !== 0 && (
                        <span className="bg-secondary-fixed text-[#D4820A] px-2 py-1 rounded-sm text-(length:--text-label-sm) font-bold">
                          PRICE CHANGED {item.priceDelta > 0 ? "+" : "-"}RS.
                          {Math.abs(item.priceDelta)}
                        </span>
                      )}
                      <span className="bg-primary-fixed text-on-primary-fixed-variant flex px-2 py-1 rounded-full text-[11px] font-bold">
                        {item.stockStatus === "Low Stock"
                          ? "LOW STOCK"
                          : "IN STOCK"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => keepItem(item)}
                        className="bg-[var(--color-primary)] text-(--color-on-primary) px-4 py-1 rounded-full text-[13px] font-semibold hover:bg-(--color-primary-container) transition-colors"
                      >
                        Keep
                      </button>
                      <button
                        onClick={() => dropItem(item.productId, item.name)}
                        className="text-error hover:bg-error-container p-1.5 rounded-[var(--radius-sm)] transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                      <button
                        onClick={() =>
                          navigate(`/view-product?id=${item.productId}`)
                        }
                        className="text-outline hover:bg-surface-dim p-1.5 rounded-sm transition-colors"
                      >
                        <Pencil size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Warning Alert */}
            <div className="bg-secondary-fixed border border-[#FFB86B] p-4 rounded-md flex items-start gap-3 mt-2 shadow-[var(--shadow-level-1)]">
              <AlertTriangle
                className="text-[#D4820A] shrink-0 mt-0.5"
                size={20}
              />
              <p className="text-[length:var(--text-body-md)] leading-[var(--text-body-md--line-height)] text-[#D4820A] font-bold">
                Review these changes before checkout. Basket will not order
                automatically due to stock or price variations from your
                template.
              </p>
            </div>
          </div>

          {/* Right Column: Sidebar / Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--color-surface-lowest)] rounded-md p-6 border border-outline-border shadow-[var(--shadow-level-2)] sticky top-8">
              <h2 className="text-(length:--text-headline-md) leading-(--text-headline-md--line-height) font-bold mb-4  text-(--color-on-surface)  ">
                Basket Summary
              </h2>
              <div className="mb-4 mt-0 px-0 border-b border-solid border-outline-border"></div>
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between items-center text-(length:--text-body-lg) text-on-surface-variant">
                  <span>Available Items</span>
                  <span className="font-[var(--text-headline-sm--font-weight)] text-[var(--color-on-surface)]">
                    {summary.availableCount}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[length:var(--text-body-lg)] text-[var(--color-on-surface-variant)]">
                  <span>Price Changes</span>
                  <span className="font-[var(--text-headline-sm--font-weight)] text-[var(--color-secondary)]">
                    {summary.priceChangedCount}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[length:var(--text-body-lg)] text-[var(--color-on-surface-variant)]">
                  <span>Out of Stock</span>
                  <span className="font-[var(--text-headline-sm--font-weight)] text-[var(--color-error)]">
                    {summary.outOfStockCount}
                  </span>
                </div>
              </div>

              <div className="border-t border-dashed border-outline-variant my-6"></div>

              <div className="flex justify-between items-end mb-8">
                <div className="flex flex-col">
                  <span className="text-[length:var(--text-label-sm)] font-[var(--text-label-sm--font-weight)] text-[var(--color-outline)] uppercase tracking-wider">
                    Estimated Total
                  </span>
                  <span className="text-[length:var(--text-label-sm)] text-[var(--color-outline)]">
                    Excludes out of stock
                  </span>
                </div>
                <div className="text-[length:var(--text-headline-lg)] font-[var(--text-headline-lg--font-weight)] text-[var(--color-primary-container)]">
                  Rs. {summary.estimatedTotal}
                </div>
              </div>

              <button
                onClick={checkout}
                disabled={summary.availableCount === 0}
                className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 rounded-[var(--radius-default)] text-[length:var(--text-headline-sm)] font-[var(--text-headline-sm--font-weight)] hover:bg-[var(--color-primary-container)] transition-colors shadow-[var(--shadow-level-1)] mb-4 disabled:opacity-50"
              >
                Review Cart &amp; Checkout
              </button>

              <div className="text-center">
                <button
                  onClick={() => navigate("/myorder")}
                  className=" text-[14px] text-[#6B7280] font-bold hover:text-(--color-on-surface) transition-colors"
                >
                  &larr; Back to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BasketReview;
