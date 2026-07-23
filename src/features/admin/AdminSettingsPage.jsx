import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useStore } from "../../store/store";
import Spinner from "../../components/common/Spinner";
import { apiRequest, authHeader } from "../../services/api";
import {
  CheckCircle2,
  Trash2,
  Plus,
  QrCode,
  Clock,
  MessageCircle,
  Store,
} from "lucide-react";


export default function AdminSettingsPage() {
  const { token } = useStore();
  const qrFileRef = useRef(null);

  const [settings, setSettings] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [newSlot, setNewSlot] = useState("");
  const [newBusinessType, setNewBusinessType] = useState("");

  const load = async () => {
    try {
      const data = await apiRequest("/settings/admin", {
        headers: authHeader(token),
      });
      setSettings(data.settings);
    } catch (requestError) {
      setError(requestError.message || "Could not load store settings");
    }
  };

  useEffect(() => {
    if (token) load();
  }, [token]);

  const field = (key, value) =>
    setSettings((current) => ({ ...current, [key]: value }));

  const handleQrFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    if (file.size > 2 * 1024 * 1024) {
      setError("QR image must be 2MB or smaller");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      field("paymentQrImage", event.target.result);
      field("paymentQrName", file.name);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    setSaving(true);
    setError("");
    setStatus("");
    try {
      const data = await apiRequest("/settings", {
        method: "PUT",
        headers: authHeader(token),
        body: JSON.stringify({
          paymentQrImage: settings.paymentQrImage,
          paymentQrName: settings.paymentQrName,
          contactWhatsApp: settings.contactWhatsApp,
          pickupSlots: settings.pickupSlots,
          businessTypes: settings.businessTypes,
          minMarginPercent: settings.minMarginPercent,
          maxDiscountPercent: settings.maxDiscountPercent,
        }),
      });
      setSettings(data.settings);
      setStatus("Store settings saved");
      toast.success("Store settings saved");
    } catch (requestError) {
      const message = requestError.message || "Could not save store settings";
      setError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (!settings) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1b1c1a]">Store Settings</h1>
          <p className="text-sm text-outline mt-0.5">
            Loading your store configuration...
          </p>
        </div>
        {error && (
          <div className="rounded-xl border border-[#ffdad6] bg-[#ffdad6]/40 px-4 py-3 text-sm font-semibold text-[#ba1a1a]">
            {error}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1b1c1a]">Store Settings</h1>
        <p className="text-sm text-outline mt-0.5">
          The payment QR, contact number and pickup slots your buyers see.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-[#ffdad6] bg-[#ffdad6]/40 px-4 py-3 text-sm font-semibold text-[#ba1a1a]">
          {error}
        </div>
      )}
      {status && (
        <div className="rounded-xl border border-[#aef1ca] bg-[#aef1ca]/30 px-4 py-3 text-sm font-semibold text-[#00452b] flex items-center gap-2">
          <CheckCircle2 size={16} />
          {status}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment QR */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50 flex items-center gap-2">
            <QrCode size={16} className="text-[#1b5e40]" />
            <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
              Payment QR
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <button
              type="button"
              onClick={() => qrFileRef.current?.click()}
              className="w-full h-48 rounded-xl border-2 border-dashed border-[#C1C8C1]/60 bg-[#F5F3F0] flex flex-col items-center justify-center gap-2 text-[#707972] hover:bg-[#E2EAE3]/40 transition overflow-hidden"
            >
              {settings.paymentQrImage ? (
                <img
                  src={settings.paymentQrImage}
                  alt="Payment QR"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <>
                  <QrCode size={24} />
                  <span className="text-xs font-semibold">
                    Click to upload your payment QR
                  </span>
                  <span className="text-[10px]">PNG or JPG up to 2MB</span>
                </>
              )}
            </button>
            <input
              ref={qrFileRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) => handleQrFile(event.target.files[0])}
            />
            {settings.paymentQrImage && (
              <button
                type="button"
                onClick={() => {
                  field("paymentQrImage", "");
                  field("paymentQrName", "");
                }}
                className="flex items-center gap-2 text-xs font-semibold text-[#ba1a1a] hover:underline"
              >
                <Trash2 size={13} />
                Remove QR
              </button>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50 flex items-center gap-2">
            <MessageCircle size={16} className="text-[#1b5e40]" />
            <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
              WhatsApp Contact
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              Number with country code
            </label>
            <input
              value={settings.contactWhatsApp || ""}
              onChange={(event) =>
                field("contactWhatsApp", event.target.value.replace(/\D/g, ""))
              }
              placeholder="9779800000000"
              className="w-full rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] px-4 py-2.5 text-sm text-[#1b1c1a] outline-none focus:border-[#1b5e40]"
            />
            <p className="text-xs text-[#707972]">
              Used by the &ldquo;Contact on WhatsApp&rdquo; buttons. Leave empty
              to hide them.
            </p>
          </div>
        </div>

        {/* Margin floor */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50 flex items-center gap-2">
            <MessageCircle size={16} className="text-[#1b5e40]" />
            <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
              Minimum Margin
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-[#707972]">
              Lowest margin you will sell at (%)
            </label>
            <input
              type="number"
              min={0}
              max={89}
              value={settings.minMarginPercent ?? 10}
              onChange={(event) =>
                field("minMarginPercent", Number(event.target.value))
              }
              className="w-full rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] px-4 py-2.5 text-sm text-[#1b1c1a] outline-none focus:border-[#1b5e40]"
            />
            <p className="text-xs text-[#707972]">
              No buyer price and no discount tier can be saved below this margin
              on the product&rsquo;s cost price. Products with no cost entered
              are not checked.
            </p>

            <label className="block pt-2 text-xs font-bold uppercase tracking-wider text-[#707972]">
              Deepest discount any tier may give (%)
            </label>
            <input
              type="number"
              min={1}
              max={90}
              value={settings.maxDiscountPercent ?? 40}
              onChange={(event) =>
                field("maxDiscountPercent", Number(event.target.value))
              }
              className="w-full rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] px-4 py-2.5 text-sm text-[#1b1c1a] outline-none focus:border-[#1b5e40]"
            />
            <p className="text-xs text-[#707972]">
              Applies even when no cost price is set, so a figure typed into the
              wrong column cannot become a 99% discount.
            </p>
          </div>
        </div>

        {/* Pickup slots */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50 flex items-center gap-2">
            <Clock size={16} className="text-[#1b5e40]" />
            <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
              Pickup Slots
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            {settings.pickupSlots.length === 0 && (
              <p className="text-xs text-[#707972]">
                No slots yet. Buyers cannot check out until you add at least
                one.
              </p>
            )}
            {settings.pickupSlots.map((slot, index) => (
              <div key={index} className="flex items-center gap-3">
                <input
                  value={slot.label}
                  onChange={(event) => {
                    const next = [...settings.pickupSlots];
                    next[index] = { ...slot, label: event.target.value };
                    field("pickupSlots", next);
                  }}
                  className="flex-1 rounded-xl border border-[#C1C8C1]/60 bg-[#F5F3F0] px-4 py-2 text-sm text-[#1b1c1a] outline-none focus:border-[#1b5e40]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const next = [...settings.pickupSlots];
                    next[index] = { ...slot, available: !slot.available };
                    field("pickupSlots", next);
                  }}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide transition ${
                    slot.available
                      ? "bg-[#aef1ca] text-[#00452b]"
                      : "bg-[#E2EAE3] text-[#707972]"
                  }`}
                >
                  {slot.available ? "Open" : "Closed"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    field(
                      "pickupSlots",
                      settings.pickupSlots.filter((_, i) => i !== index),
                    )
                  }
                  className="text-[#ba1a1a] hover:bg-[#ffdad6]/40 p-1.5 rounded-lg transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <div className="flex items-center gap-3 pt-1">
              <input
                value={newSlot}
                onChange={(event) => setNewSlot(event.target.value)}
                placeholder="e.g. 11 AM - 1 PM"
                className="flex-1 rounded-xl border border-[#C1C8C1]/60 bg-white px-4 py-2 text-sm text-[#1b1c1a] outline-none focus:border-[#1b5e40]"
              />
              <button
                type="button"
                disabled={!newSlot.trim()}
                onClick={() => {
                  field("pickupSlots", [
                    ...settings.pickupSlots,
                    { label: newSlot.trim(), available: true },
                  ]);
                  setNewSlot("");
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1b5e40] text-white text-sm font-semibold hover:bg-[#00452b] transition disabled:opacity-50"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Business types */}
        <div className="bg-white rounded-2xl border border-[#C1C8C1]/40 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#C1C8C1]/30 bg-[#F5F3F0]/50 flex items-center gap-2">
            <Store size={16} className="text-[#1b5e40]" />
            <p className="text-xs font-bold text-[#707972] uppercase tracking-wider">
              Wholesale Business Types
            </p>
          </div>
          <div className="px-6 py-5 space-y-3">
            {settings.businessTypes.length === 0 && (
              <p className="text-xs text-[#707972]">
                No business types yet. These fill the dropdown on the wholesale
                request form.
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {settings.businessTypes.map((type, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E2EAE3] text-[#404943] text-xs font-semibold"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() =>
                      field(
                        "businessTypes",
                        settings.businessTypes.filter((_, i) => i !== index),
                      )
                    }
                    className="text-[#ba1a1a]"
                  >
                    <Trash2 size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 pt-1">
              <input
                value={newBusinessType}
                onChange={(event) => setNewBusinessType(event.target.value)}
                placeholder="e.g. Grocery Shop"
                className="flex-1 rounded-xl border border-[#C1C8C1]/60 bg-white px-4 py-2 text-sm text-[#1b1c1a] outline-none focus:border-[#1b5e40]"
              />
              <button
                type="button"
                disabled={!newBusinessType.trim()}
                onClick={() => {
                  field("businessTypes", [
                    ...settings.businessTypes,
                    newBusinessType.trim(),
                  ]);
                  setNewBusinessType("");
                }}
                className="flex items-center gap-1 px-3 py-2 rounded-xl bg-[#1b5e40] text-white text-sm font-semibold hover:bg-[#00452b] transition disabled:opacity-50"
              >
                <Plus size={14} />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1b5e40] text-white text-sm font-semibold hover:bg-[#00452b] transition active:scale-95 disabled:opacity-50"
      >
        {saving ? <Spinner /> : <CheckCircle2 size={16} />}
        {saving ? "Saving..." : "Save Store Settings"}
      </button>
    </div>
  );
}
