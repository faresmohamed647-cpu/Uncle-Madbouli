# Feteer House (بيت الفطير) — Online Ordering Storefront

A bilingual (Arabic RTL / English LTR) online ordering platform for a traditional Egyptian Feteer bakery, built strictly with semantic HTML5, CSS3, and modular Vanilla JavaScript. Customers can browse categories, search and filter the menu, customize Feteer sizes and add-ons with live pricing, manage a persistent shopping cart, and complete Cash-on-Delivery orders.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> Since the clarifying questions were skipped, the plan proceeds with the recommended defaults below. You can request adjustments to any of these choices before we begin building.

- **Default Language & Layout Direction**: Bilingual storefront defaulting to **Arabic (RTL)** with an instant **English (LTR)** toggle persisted across pages, ensuring seamless readability for both Arabic and English visitors.
- **Temporary Brand Identity**: Uses **"بيت الفطير · Feteer House"** stored in a single central configuration module so the final restaurant name, contact details, and logo can be swapped in one place later.
- **Currency & Delivery Areas**: Prices in **Egyptian Pounds (EGP / ج.م)** with Cairo and Giza delivery districts (Zamalek, Maadi, Nasr City, Dokki, Mohandessin, New Cairo, Heliopolis, 6th of October) and a clear free-delivery threshold.
- **Vue 3 Multi-Page Architecture**: Uses Vue 3 Composition API route views, Vue Router, and Pinia within the existing Vite multi-page build, while preserving the storefront design and business behavior.

---

## 1. Overview & Core Concept

- **What It Does**: Provides a complete customer-facing e-commerce experience for ordering freshly baked Egyptian savory Feteer, sweet Feteer, traditional Meshaltet, stone-baked pizzas, drinks, and artisanal extras online without requiring login or backend infrastructure.
- **Target Audience / Persona**: Hungry local families, office groups, and late-night foodies browsing on mobile phones or desktop browsers who want a fast, appetizing, trustworthy way to customize and order authentic Feteer.
- **Key Value**: Combines warm, appetizing editorial food photography with frictionless customization (size, extra baladi qishta/cheese/honey, special baking notes) and reliable local cart persistence.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Discovery & Quick Order (Home)**: Visitors land on a full-bleed split showcase featuring golden layered Feteer, an Arabic display headline, and direct routes to explore the menu or order immediately. Below, they browse the 6 food categories, Best Sellers with 1-click Quick Add or Customize, Special Bundles, 4 Bakery Craftsmanship Pillars, and attributed Customer Reviews.
2. **Browsing & Filtering (Menu)**: Customers filter by category tabs (All, Savory Feteer, Sweet Feteer, Meshaltet, Pizza, Drinks, Extras) or type in the live search bar (matching both Arabic and English keywords) to narrow down dishes in real time.
3. **Customization & Dynamic Pricing (Product Details Modal & Dedicated View)**: Clicking any dish opens its detailed configuration view (available both as an accessible quick-customize modal and as a shareable dedicated product page). Customers pick a Size (Medium, Large, Family), toggle Add-ons, adjust quantity, enter special baking instructions, and watch the total price recalculate instantaneously before adding to cart.
4. **Cart Management & Persistence (Shopping Cart)**: Customers review customized line items (with chosen size, extras, and notes), step quantities up or down, remove items, inspect the subtotal, delivery fee, and free-delivery progress, and proceed to checkout—with all state preserved in browser `localStorage`.
5. **Order Placement & Confirmation (Checkout)**: Customers complete a validated delivery form (Name, Egyptian mobile number, Area/District, Street Address, Delivery Notes), review their itemized order summary under Cash on Delivery, and confirm to receive an instant order receipt screen with an order reference number and estimated delivery window.
6. **Brand Trust & Contact (About Us & Contact)**: Visitors explore the bakery's heritage, baladi ghee dough-layering story, opening hours, WhatsApp direct chat trigger, click-to-call phone link, location map embed, and inquiry form.

### Visual Identity & Theme

- **Aesthetic Direction**: Artisanal Egyptian Bakery & Warm Editorial Storefront — tactile, appetizing, uncluttered, and high-contrast, inspired by warm linen, toasted crust, and brushed brass.
- **Color Palette & Mood** (60-30-10 discipline):
  - *Dominant Canvas (60%)*: Warm Bakery Beige (`#F7F0E5`) for page backgrounds and breathing space.
  - *Structural Surfaces (30%)*: Soft Cream Card Surface (`#FFFDF8`), Secondary Warm Brown (`#8B6345`) for muted metadata and borders (`rgba(90, 56, 37, 0.14)`), and Deep Espresso Text (`#302117`).
  - *High-Intent Accents (10%)*: Primary Roasted Brown (`#5A3825`) for primary buttons and active navigation states, paired with Accent Gold (`#C69A63`) for focal highlights, pricing emphasis, and focus indicators.
- **Typography & Hierarchy**:
  - *Bilingual Display*: **El Messiri** (Arabic headlines) paired with **Playfair Display** (English headlines) using `clamp(2.25rem, 4vw, 3.75rem)` hero sizing and `text-wrap: balance`.
  - *Bilingual UI & Body*: **Cairo** (Arabic) paired with **Plus Jakarta Sans** (English) at `15px–16px` (`1.6` line-height) with `font-variant-numeric: tabular-nums` enforced on every price, counter, and order summary row.
- **Component Styling & Layout**:
  - *3-Zone Top Bar*: Single-line Brand wordmark, concise navigation links (`Home`, `Menu`, `About Us`, `Contact`), and primary action zone (Language toggle, Cart counter link, and `Order Now` button) plus responsive mobile slide-out drawer.
  - *Uniform Product Cards*: High-aspect-ratio (`4:3`) food imagery occupying the upper ~65% of the card, clean unboxed category metadata (`Savory Feteer · Best Seller` without pill-badge clutter), dish title, concise description, tabular price, and crisp action buttons.
  - *Single-Elevation Depth*: Cards sit on `#FFFDF8` with subtle warm hairline borders and a gentle `2px` hover lift (`150ms–200ms cubic-bezier(0.16, 1, 0.3, 1)`), avoiding nested card-inside-card boxes.
- **Interactive Feedback & Motion**:
  - Slide-in confirmation toast whenever an item is added or updated in the cart, paired with an animated cart badge counter bump.
  - Inline validation feedback on checkout and contact forms, empty-state illustrations/CTAs when search yields zero matches or cart is empty, and `prefers-reduced-motion` support.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Product Details Experience (Quick Modal + Dedicated Product Page)**
  - *Chosen Approach*: Support both a fast Product Customization Modal directly on the Home/Menu pages and a full dedicated Product Details page linked via URL query parameters (`?id=...`).
  - *Why*: Users browsing the menu can customize and add items without losing their scroll/filter position, while direct links to specific dishes remain shareable and bookmarkable.
  - *Alternatives Considered*: Only a modal (breaks deep-linking) or only a separate page (adds navigation friction when ordering multiple customized Feteer).
- **Decision 2: Client-Side Bilingual Dictionary & RTL/LTR Attribute Switching**
  - *Chosen Approach*: Store Arabic (`ar`) and English (`en`) copy directly in structured JavaScript data modules and toggle `document.documentElement.dir` and `lang` dynamically while saving the preference in `localStorage`.
  - *Why*: Guarantees instant switching without page reloads or duplicate HTML files for each language, and keeps every label, price unit, and menu item synchronized.
  - *Alternatives Considered*: Duplicating every HTML page per language (doubles maintenance overhead for the restaurant owner).
- **Decision 3: Multi-Page Entry Points Served via Vanilla ES Modules**
  - *Chosen Approach*: Separate semantic HTML documents for each storefront section sharing common header/footer rendering, cart store, i18n helper, and centralized catalog data.
  - *Why*: Satisfies the requirement for clean, framework-free HTML5/CSS3/JS separation while avoiding duplicated navbar/footer markup or inconsistent cart states across pages.

---

## 4. Technical Architecture & Data Strategy *(Technical Reference)*

### Architecture & Component Diagram

```
┌───────────────────────────────────────────────────────────────────────────┐
│                     BROWSER STORAGE & CENTRAL DATA                        │
│  ┌─────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐  │
│  │ Brand & Config Data │  │ Menu Catalog & Addons│  │  localStorage    │  │
│  │ (Name, Fees, Hours) │  │ (AR/EN Items, Deals) │  │ (Cart, Lang, Ord)│  │
│  └──────────┬──────────┘  └──────────┬───────────┘  └────────┬─────────┘  │
└─────────────┼────────────────────────┼───────────────────────┼────────────┘
              │                        │                       │
              ▼                        ▼                       ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                      SHARED VANILLA JS MODULES                            │
│  ┌──────────────┐  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │ i18n Engine  │  │ Cart Store &     │  │ Shared Layout & Modal UI    │  │
│  │ (RTL / LTR)  │  │ Price Calculator │  │ (Navbar, Footer, Toast, PDP)│  │
│  └──────┬───────┘  └────────┬─────────┘  └──────────────┬──────────────┘  │
└─────────┼───────────────────┼───────────────────────────┼─────────────────┘
          │                   │                           │
          ▼                   ▼                           ▼
┌───────────────────────────────────────────────────────────────────────────┐
│                       MULTI-PAGE HTML STOREFRONT                          │
│                                                                           │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌──────────┐  ┌──────────┐  │
│  │   Home    │  │   Menu    │  │  Product  │  │   Cart   │  │ Checkout │  │
│  │  Landing  │  │  Catalog  │  │  Details  │  │ Summary  │  │  & COD   │  │
│  └───────────┘  └───────────┘  └───────────┘  └──────────┘  └──────────┘  │
│                 ┌───────────┐  ┌───────────┐                              │
│                 │ About Us  │  │  Contact  │                              │
│                 │ Heritage  │  │ & Map/WA  │                              │
│                 └───────────┘  └───────────┘                              │
└───────────────────────────────────────────────────────────────────────────┘
```

### Data Model & State

- **Brand Configuration**: Editable object holding temporary name (`Feteer House` / `بيت الفطير`), phone, WhatsApp number, email, currency symbol, base delivery fee (`35 EGP`), free-delivery threshold (`450 EGP`), opening hours, and delivery districts.
- **Product Entity**: `{ id, category, name: { ar, en }, description: { ar, en }, basePrice, image, isBestSeller, hasSizes, sizes: [{ id, label, priceDelta }], availableAddons: [addonId] }`.
- **Addon Entity**: `{ id, name: { ar, en }, price }`.
- **Special Offer Entity**: `{ id, title: { ar, en }, description: { ar, en }, originalPrice, offerPrice, image, itemsIncluded }`.
- **Cart Line Item (`localStorage`)**: `{ cartItemId, productId, sizeId, addonIds[], instructions, quantity, unitPrice }` — where `cartItemId` is computed from `productId + sizeId + sorted(addonIds) + instructions` so identical customizations merge cleanly while distinct customizations stay separate.
- **Order Record (`localStorage` last receipt)**: `{ orderNumber, createdAt, customer: { fullName, phone, district, address, notes }, items[], subtotal, deliveryFee, total, paymentMethod: "COD" }`.

### Interactive Component & State Mapping

- **Shared Navbar & Mobile Drawer**: Reads Cart Store item count on boot and subscribes to custom `cart:updated` window events to update the badge in real time; dispatches `lang:changed` events on language switch.
- **Menu Filter & Search Controller**: Listens to category button clicks, URL `?category=` parameters, and debounced search input to filter the catalog array and render either matching product cards or a zero-results reset prompt.
- **Product Customizer (Modal & Product Page)**: Binds radio/button size selection, addon checkboxes, quantity steppers, and special-notes textarea; recalculates `(basePrice + sizeDelta + sum(addons)) * quantity` on every change and commits the configured line item to the Cart Store with toast feedback.
- **Cart Page Controller**: Renders line items from `localStorage`, handles quantity increment/decrement/removal, recalculates subtotal, free-delivery threshold progress, and delivery fee, and switches cleanly to an empty-cart view when all items are removed.
- **Checkout Form & Receipt Controller**: Validates required fields (non-empty name, valid Egyptian 11-digit phone starting with `01`, selected district, address), blocks submission with inline field errors if invalid, and on valid submit persists the simulated receipt, clears the cart, updates the navbar counter to `0`, and swaps the view to the Order Confirmation screen.
- **Contact Inquiry Controller**: Handles form validation and instant confirmation banner alongside live WhatsApp deep-link generation and click-to-call links.
