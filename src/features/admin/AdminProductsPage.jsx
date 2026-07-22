import { useState, useRef, useCallback, useEffect } from "react";
import { useStore } from "../../store/store";
import { apiRequest, authHeader } from "../../services/api";
import {
  Plus,
  Search,
  ChevronDown,
  Edit2,
  Trash2,
  X,
  Upload,
  Package,
  AlertTriangle,
  ShoppingBag,
  ImageIcon,
  GripVertical,
  PlusCircle,
  Minus,
  CheckCircle2,
  Bell,
  ShoppingCart,
} from "lucide-react";

const CATEGORIES = [
  "Oil",
  "Rice",
  "Flour",
  "Dal",
  "Beverages",
  "Essentials",
  "Soap",
  "Spices",
  "Other",
];

const GRADES = ["A", "B", "Premium", "Standard"];

const STOCK_OPTIONS = ["IN STOCK", "LOW STOCK", "OUT OF STOCK"];

const STOCK_STYLES = {
  "IN STOCK": {
    badge: "bg-[#aef1ca] text-[#00452b]",
    dot: "bg-[#00452b]",
  },
  "LOW STOCK": {
    badge: "bg-[#fff3cd] text-[#895100]",
    dot: "bg-[#ffa535]",
  },
  "OUT OF STOCK": {
    badge: "bg-[#ffdad6] text-[#ba1a1a]",
    dot: "bg-[#ba1a1a]",
  },
};

const EMPTY_PRODUCT = {
  name: "",
  price: "",
  oldPrice: "",
  description: "",
  stock: "IN STOCK",
  stockQty: "",
  category: "Oil",
  image: null,
  unit: "",
  grade: "A",
  shelfLife: "",
  origin: "",
  pricingTiers: [{ minQty: 1, maxQty: 9, price: "" }],
};

function formatPrice(p) {
  if (!p && p !== 0) return "—";
  return `Rs. ${Number(p).toLocaleString()}`;
}

function DeleteModal({ product, onConfirm, onCancel }) {
  if (!product) return null;
  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-[calc(100%-2rem)] sm:w-100  shrink-0 bg-white rounded-2xl shadow-xl p-6 z-10">
        <div className="w-12 h-12 rounded-full bg-[#ffdad6] flex items-center justify-center mb-4">
          <Trash2 size={20} className="text-[#ba1a1a]" />
        </div>
        <h3 className="text-base font-bold text-[#1b1c1a] mb-1">
          Delete Product?
        </h3>
        <p className="text-sm text-[#707972] mb-6">
          You are about to permanently delete{" "}
          <span className="font-semibold text-[#1b1c1a]">
            &quot;{product.name}&quot;
          </span>
          . This cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-[#404943] border border-[#C1C8C1]/60 hover:bg-[#F5F3F0] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#ba1a1a] hover:bg-[#93000a] transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Live ProductCard Preview (mirrors HomePage style)
// ─────────────────────────────────────────────

function ProductCardPreview({ form }) {
  const stockStyle = STOCK_STYLES[form.stock] || STOCK_STYLES["IN STOCK"];
  const isNotify = form.stock === "OUT OF STOCK";

  return (
    <div className="flex flex-col rounded-xl overflow-hidden shadow-md border border-[#C1C8C1]/40 bg-white max-w-[240px] w-full">
      {/* Image area */}
      <div
        className="h-[180px] flex items-center justify-center relative"
        style={{ background: "var(--color-primary-fixed, #aef1ca)" }}
      >
        {form.image ? (
          <img
            src={form.image}
            alt={form.name}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#707972]">
            <div className="w-[88px] h-[88px] rounded-xl border-2 border-dashed border-[#9EA5A0] flex items-center justify-center">
              <ImageIcon size={28} className="opacity-40" />
            </div>
            <span className="text-[11px] font-medium tracking-wide uppercase">
              Product Image
            </span>
          </div>
        )}
      </div>

      {/* Info area */}
      <div className="p-4 flex flex-col gap-1">
        <p className="text-sm font-bold text-[#1b1c1a] leading-tight line-clamp-1">
          {form.name || "Product Name"}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-extrabold text-[#1b1c1a]">
            {form.price ? `Rs. ${form.price}` : "Rs. —"}
          </span>
          {form.oldPrice && (
            <span className="text-sm text-[#9EA5A0] line-through">
              Rs. {form.oldPrice}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <span
            className={`text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${stockStyle.badge}`}
          >
            {form.stock}
          </span>
          <button
            type="button"
            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white ${
              isNotify ? "bg-[#707972]" : "bg-[#1b5e40]"
            }`}
          >
            {isNotify ? <Bell size={10} /> : <ShoppingCart size={10} />}
            {isNotify ? "Notify" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}


function PricingTierEditor({ tiers, onChange }) {
  const addTier = () => {
    const last = tiers[tiers.length - 1];
    const newMin = last?.maxQty ? last.maxQty + 1 : 1;
    onChange([...tiers, { minQty: newMin, maxQty: null, price: "" }]);
  };

  const removeTier = (idx) => {
    onChange(tiers.filter((_, i) => i !== idx));
  };

  const updateTier = (idx, field, value) => {
    onChange(
      tiers.map((t, i) =>
        i === idx ? { ...t, [field]: value === "" ? null : Number(value) } : t,
      ),
    );
  };

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 text-[10px] font-bold uppercase tracking-wider text-[#707972] px-1">
        <span>Min Qty</span>
        <span>Max Qty</span>
        <span>Price (Rs.)</span>
        <span />
      </div>
      {tiers.map((tier, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[1fr_1fr_1fr_32px] gap-2 items-center"
        >
          <input
            type="number"
            min={1}
            value={tier.minQty ?? ""}
            onChange={(e) => updateTier(idx, "minQty", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition"
          />
          <input
            type="number"
            min={1}
            placeholder="∞"
            value={tier.maxQty ?? ""}
            onChange={(e) => updateTier(idx, "maxQty", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition placeholder:text-[#9EA5A0]"
          />
          <input
            type="number"
            min={0}
            value={tier.price ?? ""}
            onChange={(e) => updateTier(idx, "price", e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition"
          />
          <button
            type="button"
            onClick={() => removeTier(idx)}
            disabled={tiers.length <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#ba1a1a] hover:bg-[#ffdad6]/50 transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Minus size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addTier}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#1b5e40] hover:text-[#00452b] mt-1 transition"
      >
        <PlusCircle size={14} /> Add Tier
      </button>
    </div>
  );
}


function ProductDrawer({ open, editProduct, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_PRODUCT);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);

  // Populate form when opening for edit
  useState(() => {
    if (editProduct) {
      setForm({
        ...EMPTY_PRODUCT,
        ...editProduct,
        price: editProduct.price ?? "",
        oldPrice: editProduct.oldPrice ?? "",
        stockQty: editProduct.stockQty ?? "",
        pricingTiers:
          editProduct.pricingTiers?.length > 0
            ? editProduct.pricingTiers
            : EMPTY_PRODUCT.pricingTiers,
      });
    } else {
      setForm(EMPTY_PRODUCT);
    }
  });

  // Keep form in sync when editProduct changes
  const prevEditRef = useRef(null);
  if (prevEditRef.current !== editProduct) {
    prevEditRef.current = editProduct;
    if (editProduct) {
      // will be set on next render via useEffect-equivalent pattern
    }
  }

  // Re-initialize when drawer opens
  const [initialized, setInitialized] = useState(false);
  if (open && !initialized) {
    setInitialized(true);
    if (editProduct) {
      setForm({
        ...EMPTY_PRODUCT,
        ...editProduct,
        price: editProduct.price ?? "",
        oldPrice: editProduct.oldPrice ?? "",
        stockQty: editProduct.stockQty ?? "",
        pricingTiers:
          editProduct.pricingTiers?.length > 0
            ? editProduct.pricingTiers
            : EMPTY_PRODUCT.pricingTiers,
      });
    } else {
      setForm(EMPTY_PRODUCT);
    }
  }
  if (!open && initialized) {
    setInitialized(false);
  }

  const field = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => field("image", e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    handleImageFile(e.dataTransfer.files[0]);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      stockQty: Number(form.stockQty),
    });
  };

  const inputCls =
    "w-full px-3 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition placeholder:text-[#9EA5A0]";
  const labelCls =
    "block text-xs font-bold text-[#404943] mb-1.5 uppercase tracking-wider";

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-[900px] bg-[#F0F4F0] shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#C1C8C1]/40 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-[#1b1c1a]">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-xs text-[#707972] mt-0.5">
              {editProduct
                ? `Editing: ${editProduct.name}`
                : "Fill in the product details below"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5F3F0] text-[#707972] hover:text-[#1b1c1a] transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body: form + preview */}
        <div className="flex-1 overflow-hidden flex">
          {/* Scrollable form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* IMAGE UPLOAD */}
            <div>
              <label className={labelCls}>Product Image</label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                className={`relative cursor-pointer rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center h-40 ${
                  dragOver
                    ? "border-[#1b5e40] bg-[#aef1ca]/20"
                    : "border-[#C1C8C1]/60 bg-white hover:border-[#1b5e40]/50 hover:bg-[#F5F3F0]/50"
                }`}
              >
                {form.image ? (
                  <>
                    <img
                      src={form.image}
                      alt="preview"
                      className="h-full w-full object-contain rounded-2xl"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        field("image", null);
                      }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-[#ba1a1a] hover:bg-white transition shadow"
                    >
                      <X size={13} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-[#9EA5A0]">
                    <Upload size={28} />
                    <p className="text-sm font-medium text-center">
                      <span className="text-[#1b5e40] font-semibold">
                        Click to upload
                      </span>{" "}
                      or drag & drop
                    </p>
                    <p className="text-xs">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />
              </div>
            </div>

            {/* NAME + CATEGORY */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Product Name *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mustard Oil 1L"
                  value={form.name}
                  onChange={(e) => field("name", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => field("category", e.target.value)}
                  className={inputCls}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className={labelCls}>Description *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe the product…"
                value={form.description}
                onChange={(e) => field("description", e.target.value)}
                className={`${inputCls} resize-none`}
              />
            </div>

            {/* PRICE + OLD PRICE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Buyer Price (Rs.) *</label>
                <input
                  required
                  type="number"
                  min={0}
                  placeholder="e.g. 160"
                  value={form.price}
                  onChange={(e) => field("price", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>MRP / Old Price (Rs.)</label>
                <input
                  type="number"
                  min={0}
                  placeholder="Optional — shown crossed out"
                  value={form.oldPrice}
                  onChange={(e) => field("oldPrice", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* STOCK STATUS + QTY */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Stock Status *</label>
                <select
                  value={form.stock}
                  onChange={(e) => field("stock", e.target.value)}
                  className={inputCls}
                >
                  {STOCK_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Stock Quantity *</label>
                <input
                  required
                  type="number"
                  min={0}
                  placeholder="e.g. 240"
                  value={form.stockQty}
                  onChange={(e) => field("stockQty", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* UNIT + GRADE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Unit / Pack Size</label>
                <input
                  type="text"
                  placeholder="e.g. 1L PET Bottle"
                  value={form.unit}
                  onChange={(e) => field("unit", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Grade</label>
                <select
                  value={form.grade}
                  onChange={(e) => field("grade", e.target.value)}
                  className={inputCls}
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* SHELF LIFE + ORIGIN */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Shelf Life</label>
                <input
                  type="text"
                  placeholder="e.g. 12 Months"
                  value={form.shelfLife}
                  onChange={(e) => field("shelfLife", e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Origin</label>
                <input
                  type="text"
                  placeholder="e.g. Terai, Nepal"
                  value={form.origin}
                  onChange={(e) => field("origin", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* PRICING TIERS */}
            <div>
              <label className={labelCls}>Discount Pricing Tiers</label>
              <div className="bg-white rounded-xl border border-[#C1C8C1]/40 p-4">
                <PricingTierEditor
                  tiers={form.pricingTiers}
                  onChange={(tiers) => field("pricingTiers", tiers)}
                />
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-2 pb-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-[#404943] border border-[#C1C8C1]/60 hover:bg-white transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#1b5e40] hover:bg-[#00452b] transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={16} />
                {editProduct ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </form>

          {/* Live Preview Panel */}
          <div className="hidden lg:flex w-[280px] shrink-0 flex-col bg-white border-l border-[#C1C8C1]/40 p-6 gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#707972] mb-3">
                Live Card Preview
              </p>
              <p className="text-xs text-[#9EA5A0] leading-relaxed mb-4">
                This is how the product will appear on the homepage.
              </p>
            </div>
            <ProductCardPreview form={form} />

            {/* Mini spec preview */}
            {(form.unit || form.grade || form.shelfLife || form.origin) && (
              <div className="mt-2 rounded-xl border border-[#C1C8C1]/40 p-3 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#707972] mb-2">
                  Specifications
                </p>
                {[
                  ["Grade", form.grade],
                  ["Unit", form.unit],
                  ["Shelf Life", form.shelfLife],
                  ["Origin", form.origin],
                ]
                  .filter(([, v]) => v)
                  .map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs">
                      <span className="text-[#707972] uppercase tracking-wide">
                        {k}
                      </span>
                      <span className="font-semibold text-[#1b1c1a]">{v}</span>
                    </div>
                  ))}
              </div>
            )}

            {/* Pricing tiers preview */}
            {form.pricingTiers.length > 0 && (
              <div className="rounded-xl border border-[#C1C8C1]/40 p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#707972] mb-2">
                  Pricing Tiers
                </p>
                <div className="space-y-1.5">
                  {form.pricingTiers.map((t, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs items-center"
                    >
                      <span className="text-[#707972]">
                        {t.minQty}
                        {t.maxQty ? `–${t.maxQty}` : "+"}
                      </span>
                      <span className="font-bold text-[#1b5e40]">
                        {t.price ? `Rs. ${t.price}` : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// Product Row (Table)
// ─────────────────────────────────────────────

function ProductRow({ product, onEdit, onDelete }) {
  const stockStyle = STOCK_STYLES[product.stock] || STOCK_STYLES["IN STOCK"];

  return (
    <tr className="hover:bg-[#F5F3F0]/50 transition group">
      {/* Image + Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex-shrink-0 overflow-hidden border border-[#C1C8C1]/40 bg-[#aef1ca]/20 flex items-center justify-center">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <Package size={18} className="text-[#9EA5A0]" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-[#1b1c1a] leading-tight">
              {product.name}
            </p>
            <p className="text-xs text-[#707972] mt-0.5">{product.id}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4 text-sm text-[#404943]">{product.category}</td>

      {/* Price */}
      <td className="px-4 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold text-[#1b1c1a]">
            {formatPrice(product.price)}
          </span>
          {product.oldPrice && (
            <span className="text-xs text-[#9EA5A0] line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
      </td>

      {/* Stock */}
      <td className="px-4 py-4">
        <div className="flex flex-col gap-1">
          <span
            className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${stockStyle.badge}`}
          >
            {product.stock}
          </span>
          <span className="text-xs text-[#707972] pl-1">
            {product.stockQty} units
          </span>
        </div>
      </td>

      {/* Unit */}
      <td className="px-4 py-4 text-sm text-[#404943]">
        {product.unit || "—"}
      </td>

      {/* Tiers */}
      <td className="px-4 py-4 text-xs text-[#707972]">
        {product.pricingTiers.length} tier
        {product.pricingTiers.length !== 1 ? "s" : ""}
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={() => onEdit(product)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E2EAE3] text-[#1b5e40] transition"
            title="Edit"
          >
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#ffdad6]/50 text-[#ba1a1a] transition"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}



function ProductMobileCard({ product, onEdit, onDelete }) {
  const stockStyle = STOCK_STYLES[product.stock] || STOCK_STYLES["IN STOCK"];
  return (
    <div className="p-4 flex gap-3 border-b border-[#C1C8C1]/30 last:border-0">
      <div className="w-14 h-14 rounded-xl flex-shrink-0 border border-[#C1C8C1]/40 bg-[#aef1ca]/20 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <Package size={20} className="text-[#9EA5A0]" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1b1c1a] truncate">
              {product.name}
            </p>
            <p className="text-xs text-[#707972]">{product.category}</p>
          </div>
          <span
            className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${stockStyle.badge}`}
          >
            {product.stock}
          </span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#1b1c1a]">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-[#9EA5A0] line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#E2EAE3] text-[#1b5e40] transition"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => onDelete(product)}
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#ffdad6]/60 text-[#ba1a1a] transition"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function AdminProductsPage() {
  const { token } = useStore();
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [sortBy, setSortBy] = useState("createdAt");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const mapProduct = (product) => ({
    id: product._id,
    name: product.name,
    price: product.retailPrice,
    oldPrice: product.priceHistory?.[0]?.price,
    description: product.description,
    stock: product.stockStatus?.toUpperCase(),
    stockQty: product.stock,
    category: product.category,
    image: product.imageUrl,
    unit: product.unit,
    grade: product.grade,
    shelfLife: product.shelfLife,
    origin: product.origin,
    pricingTiers: (product.tierPrices || []).map((tier) => ({
      minQty: tier.minQuantity,
      maxQty: null,
      price: tier.price,
    })),
    createdAt: product.createdAt,
  });
  const loadProducts = async () => {
    try {
      const data = await apiRequest("/products");
      setProducts(data.products.map(mapProduct));
    } catch {
      setProducts([]);
    }
  };
  useEffect(() => {
    loadProducts();
  }, []);

  // ── Stats ─────────────────────────────────
  const totalProducts = products.length;
  const lowStock = products.filter((p) => p.stock === "LOW STOCK").length;
  const outOfStock = products.filter((p) => p.stock === "OUT OF STOCK").length;

  // ── Filtering + Sorting ───────────────────
  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      const matchCat =
        categoryFilter === "all" || p.category === categoryFilter;
      const matchStock = stockFilter === "all" || p.stock === stockFilter;
      return matchSearch && matchCat && matchStock;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "stock") return a.stockQty - b.stockQty;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  // ── Handlers ──────────────────────────────
  const openAdd = () => {
    setEditProduct(null);
    setDrawerOpen(true);
  };

  const openEdit = (product) => {
    setEditProduct(product);
    setDrawerOpen(true);
  };

  const handleSave = async (data) => {
    const body = {
      name: data.name,
      retailPrice: Number(data.price),
      category: data.category,
      unit: data.unit,
      stock: Number(data.stockQty),
      imageUrl: data.image || "",
      description: data.description || "",
      grade: data.grade || "",
      shelfLife: data.shelfLife || "",
      origin: data.origin || "",
      tierPrices: (data.pricingTiers || [])
        .filter((tier) => tier.minQty && tier.price !== "")
        .map((tier) => ({
          minQuantity: Number(tier.minQty),
          price: Number(tier.price),
        })),
    };
    try {
      await apiRequest(
        editProduct ? `/products/${editProduct.id}` : "/products",
        {
          method: editProduct ? "PUT" : "POST",
          headers: authHeader(token),
          body: JSON.stringify(body),
        },
      );
      await loadProducts();
      setDrawerOpen(false);
      setEditProduct(null);
    } catch {
      /* retain drawer so the entered values remain available */
    }
  };

  const handleDelete = async () => {
    if (deleteTarget) {
      try {
        await apiRequest(`/products/${deleteTarget.id}`, {
          method: "DELETE",
          headers: authHeader(token),
        });
        await loadProducts();
        setDeleteTarget(null);
      } catch {
        /* deletion is not applied locally on failure */
      }
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Page Header ─────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#1b1c1a]">Products</h1>
            <p className="text-sm text-[#707972] mt-0.5">
              Manage your product catalogue — add, edit, and remove products.
            </p>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1b5e40] text-white text-sm font-bold hover:bg-[#00452b] transition shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <Plus size={16} />
            Add Product
          </button>
        </div>

        {/* ── Stat Row ──────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#E2EAE3] text-[#1b5e40] flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1b1c1a] leading-none">
                {totalProducts}
              </p>
              <p className="text-xs text-[#707972] mt-1">Total Products</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#fff3cd] text-[#895100] flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#895100] leading-none">
                {lowStock}
              </p>
              <p className="text-xs text-[#707972] mt-1">Low Stock</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
              <Package size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#ba1a1a] leading-none">
                {outOfStock}
              </p>
              <p className="text-xs text-[#707972] mt-1">Out of Stock</p>
            </div>
          </div>
        </div>

        {/* ── Filters ───────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm p-4 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707972]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name, category, or ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] placeholder:text-[#707972] outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition"
            />
          </div>

          {/* Category filter */}
          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] font-medium outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition cursor-pointer"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707972] pointer-events-none"
            />
          </div>

          {/* Stock filter */}
          <div className="relative">
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] font-medium outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition cursor-pointer"
            >
              <option value="all">All Stock</option>
              {STOCK_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707972] pointer-events-none"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] text-sm text-[#1b1c1a] font-medium outline-none focus:ring-2 focus:ring-[#1b5e40]/20 focus:border-[#1b5e40]/40 transition cursor-pointer"
            >
              <option value="createdAt">Newest First</option>
              <option value="name">Name A–Z</option>
              <option value="price">Price: Low → High</option>
              <option value="price_desc">Price: High → Low</option>
              <option value="stock">Stock: Low → High</option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#707972] pointer-events-none"
            />
          </div>
        </div>

        {/* ── Product Table ─────────────────── */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[820px]">
              <thead>
                <tr className="bg-[#F5F3F0] border-b border-[#C1C8C1]/40">
                  <th className="text-left px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Product
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Category
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Price
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Stock
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Unit
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Tiers
                  </th>
                  <th className="text-left px-4 py-3.5 text-xs font-bold uppercase tracking-wider text-[#404943]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C1C8C1]/30">
                {filtered.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    onEdit={openEdit}
                    onDelete={setDeleteTarget}
                  />
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-16 text-sm text-[#707972]"
                    >
                      <Package
                        size={32}
                        className="mx-auto text-[#C1C8C1] mb-3"
                      />
                      <p>No products match your search.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-[#C1C8C1]/30">
            {filtered.map((product) => (
              <ProductMobileCard
                key={product.id}
                product={product}
                onEdit={openEdit}
                onDelete={setDeleteTarget}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-16 text-sm text-[#707972]">
                <Package size={32} className="mx-auto text-[#C1C8C1] mb-3" />
                <p>No products match your search.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs text-[#707972] text-right">
          Showing {filtered.length} of {products.length} products
        </p>
      </div>

      {/* ── Drawer ────────────────────────── */}
      <ProductDrawer
        open={drawerOpen}
        editProduct={editProduct}
        onClose={() => {
          setDrawerOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSave}
      />

      {/* ── Delete Modal ──────────────────── */}
      <DeleteModal
        product={deleteTarget}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
