import React from "react";
import { ShoppingCart, Bell, ChevronRight, ChevronDown } from "lucide-react";
const products = [
  {
    name: "Mustard Oil 1L",
    price: "Rs. 160",
    stock: "IN STOCK",
    action: "Add",
  },
  {
    name: "Tea Box",
    price: "Rs. 320",
    stock: "LOW STOCK",
    action: "Add",
  },
  {
    name: "Rice 25kg",
    price: "Rs. 2100",
    oldPrice: "Rs. 2350",
    stock: "LOW STOCK",
    action: "Add",
  },
  {
    name: "Flour 10kg",
    price: "Rs. 720",
    stock: "OUT OF STOCK",
    action: "Notify",
  },
  {
    name: "Sugar 5kg",
    price: "Rs. 475",
    stock: "IN STOCK",
    action: "Add",
  },
  {
    name: "Dal 5kg",
    price: "Rs. 650",
    stock: "IN STOCK",
    action: "Add",
  },
];

const categories = ["Rice", "Oil", "Soap", "Flour", "Dal"];

const STOCK_COLORS = {
  "IN STOCK": "var(--color-primary-fixed)",
  "LOW STOCK": "var(--color-secondary-fixed)",
  "OUT OF STOCK": "var(--color-error-container)",
};

/* Keep products, categories, STOCK_COLORS unchanged */

function StockBadge({ stock }) {
  return (
    <span
      style={{
        height: 25,
        padding: "4px 10px",
        borderRadius: "var(--radius-full)",
        background: STOCK_COLORS[stock],

        display: "inline-flex",
        alignItems: "center",

        fontSize: "var(--text-label-sm)",
        lineHeight: "var(--text-label-sm--line-height)",
        fontWeight: 700,
      }}
    >
      {stock}
    </span>
  );
}

function ActionButton({ action }) {
  const notify = action === "Notify";

  return (
    <button
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
      {notify ? <Bell size={16} /> : <ShoppingCart size={16} />}
      {action}
    </button>
  );
}

function ProductCard({ product }) {
  return (
    <article
      style={{
        background: "var(--color-surface-lowest)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        boxShadow: "var(--shadow-level-1)",

        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 222,

          background: "var(--color-primary-fixed)",

          display: "grid",
          placeItems: "center",

          position: "relative",
        }}
      >
        <div
          style={{
            width: 140,
            height: 140,

            borderRadius: "var(--radius-lg)",

            border: "3px dashed var(--color-outline)",
          }}
        />

        <span
          style={{
            position: "absolute",
            bottom: 20,

            color: "var(--color-on-surface-variant)",

            fontSize: "var(--text-label-sm)",
          }}
        >
          PRODUCT IMAGE
        </span>
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
            }}
          >
            {product.price}
          </div>

          {product.oldPrice && (
            <div
              style={{
                color: "var(--color-outline)",

                textDecoration: "line-through",
              }}
            >
              {product.oldPrice}
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
          <StockBadge stock={product.stock} />

          <ActionButton action={product.action} />
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <main
      style={{
        background: "var(--color-background)",

        width: "100%",
      }}
    >
      {/* Navbar */}

      <div
        style={{
          width: "100%",

          display: "flex",

          alignItems: "stretch",
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
            Categories
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
            {categories.map((c) => (
              <button
                key={c}
                style={{
                  width: 237,

                  height: 48,

                  border: 0,

                  borderRadius: "var(--radius-default)",

                  background: "var(--color-surface-categories)",
                  display: "flex",

                  alignItems: "center",

                  justifyContent: "space-between",

                  padding: "0 var(--spacing-md)",

                  cursor: "pointer",
                }}
              >
                {c}

                <ChevronRight size={16} />
              </button>
            ))}
          </div>

          <div
            style={{
              width: 237,

              marginTop: "var(--spacing-lg)",

              fontWeight: 900,
            }}
          >
            See All →
          </div>

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
            <strong>ⓘ Note:</strong>

            <div
              style={{
                marginTop: "var(--spacing-sm)",
              }}
            >
              Pickup-only, collect from Pathivara Wholesale center located at
              the main market hub.
            </div>
          </div>
        </aside>

        <section
          style={{
            flex: 1,

            padding: "52px var(--spacing-2xl)",
          }}
        >
          <div
            style={{
              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",

              marginBottom: 52,
            }}
          >
            <h1
              style={{
                margin: 0,

                fontSize: 30,

                fontWeight: 700,
              }}
            >
              All Products
            </h1>

            <button
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
              Filter
              <ChevronDown size={16} />
            </button>
          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns: "repeat(auto-fit,minmax(297px,1fr))",

              gap: 34,
            }}
          >
            {products.map((p) => (
              <ProductCard key={p.name} product={p} />
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
    </main>
  );
}
