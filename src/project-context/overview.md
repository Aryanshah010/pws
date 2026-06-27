# Inspirations — Overview

> Reference sites studied: rasan.com.np and merokirana.com  
> Purpose: Identify patterns to adopt and anti-patterns to avoid for Pathivara's single-supplier context.

---

## Side-by-Side Comparison

| Dimension | rasan.com.np | merokirana.com | Pathivara (Target) |
|---|---|---|---|
| **Business model** | Multi-vendor B2B marketplace | Multi-vendor grocery delivery | Single-supplier B2B+B2C |
| **Fulfillment** | Delivery-centric | Home delivery | Pickup-only |
| **Target user** | Retailers / businesses | Urban consumers | Kirana owners + households |
| **Language** | English-primary | English-primary | English + Nepali toggle |
| **Pricing** | Wholesale/bulk | Retail | Role-based (wholesale vs retail) |
| **Stock visibility** | Listed but not live | Live stock on some items | Live badge on every card |
| **Ordering** | Registered business accounts | Open cart + delivery | Registered buyer + pickup slot |
| **Trust signals** | Business verification | Ratings, return policy | Guarantee banner, PDF receipt, dual confirmation |
| **Mobile UX** | Desktop-first, mobile-adapted | Mobile-first | Mobile-first, offline-lite |

---

## What to Adopt from Both Sites

### Navigation Structure (Jakob's Law)
Both sites use a top search bar + category navigation + bottom/side nav. This is the established mental model for Nepali e-commerce users. Adopt:
- Top search bar (always visible)
- Category-based browsing (accessible from homepage)
- Cart icon in top-right with badge counter

### Product Card Pattern
Both sites show image + name + price on a grid card. Users already know this pattern. Adopt:
- 2-column product grid on mobile
- Tap-to-open product detail
- Card-level "Add to Cart" button (or "+") on the card itself

### Checkout Flow Reference
merokirana uses a multi-section checkout. Adopt the **section grouping** concept but collapse to a **single scrollable page** (Pathivara constraint: simpler for low-literacy users).

---

## What to Improve / Avoid

### Anti-Pattern: Delivery UI Complexity
Both reference sites have delivery address input, delivery time selection, delivery fee calculation. **Exclude entirely** for Pathivara — pickup-only removes this entire complexity layer.

### Anti-Pattern: Multi-Vendor Friction
RASAN requires choosing between multiple vendors for the same product. **Pathivara has one vendor** — this entire decision layer disappears. Product pages go directly to Add to Cart.

### Anti-Pattern: English-Only Search
Neither reference site supports Nepali search aliases. **Pathivara must solve this** — it is a primary differentiator for the Jhapa market.

### Anti-Pattern: No Role-Based Pricing
Both sites show one price to all users. **Pathivara shows tiered pricing** (guest retail / logged-in wholesale) — a critical differentiator for kirana pasal buyers.

### Anti-Pattern: No Price History
Neither site shows price history charts. **Pathivara includes a 30-day sparkline** — directly addressing the #1 pain point (surprise price changes).

---

## Key UI Patterns to Reference

| Pattern | Source | Applied Where |
|---|---|---|
| Horizontal category scroll shelf | merokirana homepage | Pathivara staples quick-access shelf |
| Stock badge on product card | rasan.com.np | Live In Stock / Low / Out badge |
| Bottom tab navigation | Both sites | Pathivara 4-tab bottom nav |
| Full-width primary CTA at checkout | Both sites | "Confirm Order" sticky bottom button |
| Order history list with card layout | Both sites | Pathivara order history screen |
| Search autocomplete overlay | merokirana | Pathivara autocomplete with images |
