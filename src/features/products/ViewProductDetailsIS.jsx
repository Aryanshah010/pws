import { useState, useEffect } from "react";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "../../store/store";

// Reuse the exact same card component the Homepage uses, instead of a
// hand-duplicated copy. This is the single source of truth for product
// cards — any future style change to HomePage's ProductCard automatically
// stays in sync here too.
import { ProductCard } from "../home/HomePage";

const similarProducts = [
  {
    name: "Mustard Oil 5L",
    price: "Rs. 400",
    stock: "IN STOCK",
    action: "Add",
  },
  {
    name: "Sunflower Oil 1L",
    price: "Rs. 195",
    stock: "IN STOCK",
    action: "Add",
  },
  {
    name: "Ghee 1L",
    price: "Rs. 850",
    oldPrice: "Rs. 920",
    stock: "LOW STOCK",
    action: "Add",
  },
];

export default function ViewProductDetailIS() {
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get("id");

  const { user, addToCart } = useStore();
  const isWholesale = user?.role === "verified_wholesale";

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5050/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProduct(data.data);
          }
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [id]);

  const incrementQty = () => setQuantity((q) => q + 1);
  const decrementQty = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  if (loading) return <div className="p-8 text-center">Loading product details...</div>;
  if (!product) return <div className="p-8 text-center text-red-500">Product not found.</div>;

  let displayPrice = product.retailPrice;
  let oldPrice = null;

  if (isWholesale && product.tierPrices && product.tierPrices.length > 0) {
    oldPrice = product.retailPrice;
    displayPrice = product.tierPrices[0].price; // Default wholesale base
    // If quantity hits a tier, adjust price dynamically
    const sortedTiers = [...product.tierPrices].sort((a, b) => b.minQuantity - a.minQuantity);
    const applicableTier = sortedTiers.find((t) => quantity >= t.minQuantity);
    if (applicableTier) {
      displayPrice = applicableTier.price;
    }
  }

  const isOutOfStock = product.stock <= 0;
  const stockText = product.stockStatus || (isOutOfStock ? "Out of Stock" : "In Stock");

  return (
    <div className="min-h-screen bg-(--color-background) ">
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
          {/* Left: Product Card */}
          <div className="lg:col-span-2 ">
            <div className="bg-(--color-surface-lowest) rounded-md border border-outline-variant  shadow-(--shadow-level-1) overflow-hidden">
              <div className="flex flex-col md:flex-row  divide-x divide-gray-200 ">
                {/* Product Image */}
                <div className="flex-shrink-0 w-full md:w-[38%] p-6 flex items-center justify-center">
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/9fc7279e09abeb7ff2274131215bf3820cf8349c?width=547"
                    alt="Mustard Oil 1L"
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
                      High quality {product.category} for your daily needs. Best in class {product.unit} packaging.
                    </p>
                  </div>

                  {/* Price Section */}
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
                      <span className={`h-6.25 mt-4 px-[8px] py-[4px] rounded-full inline-flex items-center text-(--text-label-sm) leading-(--text-label-sm--line-height) font-bold ${isOutOfStock ? 'bg-red-100 text-red-800' : 'bg-primary-fixed'}`}>
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
                        onClick={() => addToCart(product, quantity, displayPrice)}
                        className={`w-62 h-[48px] border-0 rounded-default flex items-center justify-center gap-1.5 font-bold ${isOutOfStock ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-primary text-(--color-on-primary) cursor-pointer hover:opacity-90'}`}>
                        <ShoppingCart size={16} />
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      </button>
                      <button 
                        disabled={isOutOfStock}
                        className={`w-30.25 h-[48px] border-0 rounded-default flex items-center justify-center gap-1.5 font-bold shadow-(--shadow-level-2) ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-outline-border-pill text-(--color-on-secondary) cursor-pointer hover:bg-gray-100'}`}>
                        Rs. Buy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Wholesale Pricing Card */}
            <div className="bg-[var(--color-surface-categories)] rounded-[var(--radius-md)] border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)]">
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
                  const saving = ((product.retailPrice - tier.price) / product.retailPrice * 100).toFixed(1);
                  return (
                    <div key={index} className="grid grid-cols-3 gap-2 px-3 py-3 bg-[var(--color-secondary-fixed)]/20 rounded-default border border-[var(--color-secondary-fixed-dim)]/30">
                      <div className="text-sm font-medium text-[var(--color-on-surface)]">
                        {tier.minQuantity}+
                      </div>
                      <div className="text-sm font-bold text-[var(--color-secondary)]">
                        Rs. {tier.price}
                      </div>
                      <div className="text-right text-xs font-bold text-[var(--color-secondary)]">
                        {saving}% Off
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Product Specifications */}
            <div className="bg-(--color-surface-lowest) rounded-md border border-[var(--color-outline-variant)]/30 p-6 shadow-[var(--shadow-level-1)]">
              <h3 className="font-bold text-[var(--color-on-primary-fixed)] mb-4">
                Specifications
              </h3>

              <div className="space-y-0 divide-y divide-[var(--color-outline-variant)]/20">
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Grade
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    A
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Unit Size
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    1L PET Bottle
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Shelf Life
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    12 Months
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 text-sm">
                  <span className="font-medium text-[var(--color-on-surface-variant)] uppercase text-xs tracking-wider">
                    Origin
                  </span>
                  <span className="font-bold text-[var(--color-on-surface)]">
                    Terai, Nepal
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
                    -2.4%
                  </span>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-center gap-1 h-24 py-4 px-2">
                {[
                  28.8, 26.39, 31.19, 33.59, 24, 21.59, 19.19, 16.8, 14.39,
                  13.44, 12, 10.55,
                ].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{
                      height: `${(h / 33.59) * 100}%`,
                      backgroundColor:
                        i < 8
                          ? "rgba(0, 69, 43, 0.2)"
                          : i < 11
                            ? "rgba(0, 69, 43, 0.6)"
                            : "var(--color-primary)",
                    }}
                  />
                ))}
              </div>

              <div className="flex justify-between items-start text-xs text-[var(--color-on-surface-variant)]">
                <div>30d ago</div>
                <div className="font-bold text-[var(--color-on-primary-fixed)]">
                  Today (Rs. 160)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products — heading style copied exactly from HomePage's
            "All Products" h1 (raw 30px/700, no token forced since none in
            index.css matches 30px exactly), grid copied exactly too. */}
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
              <ProductCard key={p.name} product={p} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
