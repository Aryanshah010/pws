import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import Spinner from "../../components/common/Spinner";
import { apiRequest, authHeader } from "../../services/api";

export default function CustomBasketTemplate() {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { cart, token } = useStore();
  const navigate = useNavigate();
  const save = async () => {
    if (!token) return navigate("/login");
    setSaving(true);
    setError("");
    try {
      await apiRequest("/orders/baskets", {
        method: "POST",
        headers: authHeader(token),
        body: JSON.stringify({
          name,
          items: cart.map((item) => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });
      toast.success(`Saved "${name.trim()}" as a reusable basket`);
      navigate("/myorder");
    } catch (requestError) {
      setError(requestError.message);
      toast.error(requestError.message || "Could not save this basket");
    } finally {
      setSaving(false);
    }
  };
  return (
    <main className="min-h-screen bg-(--color-background) text-(--color-on-background) p-4 md:p-8 lg:px-16 flex flex-col items-center">
      <div className="w-full max-w-260.75 flex flex-col gap-6 mt-4">
        <div className="bg-(--color-surface-lowest) rounded-md p-6 md:p-8 border border-outline-border shadow-[var(--shadow-level-1)]">
          <h2 className="text-[24px] font-bold text-(--color-primary-container) mb-6">
            Custom Template
          </h2>
          <label className="text-sm font-semibold">Name this Basket:</label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Example my weekly basket"
            className="mt-2 w-full px-4 py-4 bg-[#F4FBF4] border border-[#C1C8C1] rounded-sm outline-none"
          />
        </div>
        <div className="bg-[var(--color-surface-lowest)] rounded-[var(--radius-md)] p-6 md:p-8 border border-[var(--color-outline-variant)] shadow-[var(--shadow-level-1)]">
          <h2 className="text-[22px] font-bold text-[var(--color-primary-container)] mb-6">
            Order Table
          </h2>
          <div className="border border-[var(--color-outline-variant)] rounded overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1.5fr] bg-surface-low px-6 py-4 text-xs font-bold uppercase">
              <span>Item</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Current price per unit</span>
            </div>
            {cart.length ? (
              cart.map((item) => (
                <div
                  key={item.product._id}
                  className="grid grid-cols-[2fr_1fr_1.5fr] px-6 py-5 border-t border-[var(--color-outline-variant)]"
                >
                  <span className="font-semibold">{item.product.name}</span>
                  <span className="text-center">{item.quantity}</span>
                  <span className="text-right">Rs. {item.price}</span>
                </div>
              ))
            ) : (
              <p className="p-6 text-center text-[#717973]">
                Your cart is empty.
              </p>
            )}
          </div>
          <div className="mt-6 bg-surface-categories border-l-4 border-l-(--color-primary-container) p-4 rounded-r-default flex gap-3">
            <Info size={20} />
            <p>
              Saving a basket does not place an order. Stock and prices are
              checked again when you use it.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={save}
            disabled={saving || !cart.length || !name.trim()}
            className="w-full max-w-[320px] bg-[var(--color-primary)] text-white py-4 rounded-[var(--radius-default)] text-lg font-semibold disabled:opacity-50"
          >
            {saving ? (
              <span className="inline-flex items-center justify-center gap-2">
                <Spinner size={18} />
                Saving...
              </span>
            ) : (
              "Save Template"
            )}
          </button>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            onClick={() => navigate(-1)}
            className="text-lg font-semibold text-[var(--color-on-surface-variant)]"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
