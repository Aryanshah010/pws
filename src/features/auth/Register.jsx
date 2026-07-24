import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { Lock, Phone, User, ChevronDown } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";
import Spinner from "../../components/common/Spinner";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("household/individual");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone, password, role }),
      });
      toast.success(data.message || "Account created. Please log in.");

      if (data.user?.role === "bulk/shop" && data.token) {
        return navigate("/wholesale-form", {
          state: {
            fromRegistration: true,
            token: data.token,
            user: data.user,
          },
        });
      }

      navigate("/login", { state: { phone } });
    } catch (err) {
      const message = err.message || "Failed to connect to server";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-background">
      <Nav />
      <section
        className="
          min-h-[calc(100vh-160px)]
          px-[24px]
          py-[72px]
          flex
          items-center
          justify-center
        "
      >
        <div
          className="
            w-full
            max-w-[920px]
            rounded-[8px]
            overflow-hidden
            bg-surface-lowest
            border
            border-outline-variant
            shadow-[var(--shadow-level-1)]
          "
        >
          <div
            className="
              grid
              grid-cols-[1.12fr_0.88fr]
              min-h-[560px]
            "
          >
            {/* IMAGE AREA */}
            <div
              className="
                bg-surface
                border-r
                border-outline-variant
              "
            >
              <img
                src="src/assets/rawfood.jpg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            {/* FORM */}
            <div
              className="
                px-[42px]
                py-[48px]
                flex
                flex-col
                justify-center
              "
            >
              <h1
                className="
                  text-headline-lg
                  font-bold
                  text-primary
                "
              >
                {t("auth.createAccount")}
              </h1>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleRegister}>
                {/* FULL NAME */}
                <div className="mt-[30px]">
                  <label
                    className="
                    mb-[8px]
                    block
                    text-label-sm
                    font-semibold
                    text-on-surface-variant
                  "
                  >
                    {t("auth.fullName")}
                  </label>

                  <div className="relative">
                    <div
                      className="
                      absolute
                      left-[12px]
                      top-1/2
                      -translate-y-1/2
                      flex
                      h-[24px]
                      w-[24px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F4FBF4]
                    "
                    >
                      <User size={14} color="#9EA5A0" />
                    </div>

                    <input
                      type="text"
                      placeholder={t("auth.fullNamePlaceholder")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="
                      h-[44px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#C1C8C1]
                      bg-[#F4FBF4]
                      pl-[48px]
                      pr-3.5
                      text-body-md
                      outline-none
                      focus:border-primary
                    "
                    />
                  </div>
                </div>

                {/* PHONE NUMBER */}
                <div className="mt-4.5">
                  <label
                    className="
                    mb-[8px]
                    block
                    text-label-sm
                    font-semibold
                    text-on-surface-variant
                  "
                  >
                    {t("auth.phone")}
                  </label>

                  <div className="relative">
                    <div
                      className="
                      absolute
                      left-[12px]
                      top-1/2
                      -translate-y-1/2
                      flex
                      h-[24px]
                      w-[24px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F4FBF4]
                    "
                    >
                      <Phone size={14} color="#9EA5A0" />
                    </div>

                    <input
                      type="text"
                      placeholder={t("auth.phonePlaceholder")}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="
                      h-[44px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#C1C8C1]
                      bg-[#F4FBF4]
                      pl-[48px]
                      pr-3.5
                      text-body-md
                      outline-none
                      focus:border-primary
                    "
                    />
                  </div>
                </div>

                {/* PASSWORD */}
                <div className="mt-4.5">
                  <label
                    className="
                    mb-[8px]
                    block
                    text-label-sm
                    font-semibold
                    text-on-surface-variant
                  "
                  >
                    {t("auth.password")}
                  </label>

                  <div className="relative">
                    <div
                      className="
                      absolute
                      left-[12px]
                      top-1/2
                      -translate-y-1/2
                      flex
                      h-[24px]
                      w-[24px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#F4FBF4]
                    "
                    >
                      <Lock size={14} color="#9EA5A0" />
                    </div>

                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="
                      h-[44px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#C1C8C1]
                      bg-[#F4FBF4]
                      pl-[48px]
                      pr-3.5
                      text-body-md
                      outline-none
                      focus:border-primary
                    "
                    />
                  </div>
                </div>

                {/* Buyer Type */}
                <div className="mt-4.5">
                  <label
                    className="
                    mb-[8px]
                    block
                    text-label-sm
                    font-semibold
                    text-on-surface-variant
                  "
                  >
                    {t("auth.buyerType")}
                  </label>

                  <div className="relative">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      className="
                      h-[44px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#C1C8C1]
                      bg-[#F4FBF4]
                      pl-[14px]
                      pr-[40px]
                      text-body-md
                      text-on-surface-variant
                      outline-none
                      focus:border-primary
                      appearance-none
                    "
                    >
                      <option value="" disabled>
                        {t("auth.chooseBuyerType")}
                      </option>
                      <option value="household/individual">
                        {t("auth.household")}
                      </option>
                      <option value="bulk/shop">{t("auth.shopBulk")}</option>
                    </select>

                    <div
                      className="
                      pointer-events-none
                      absolute
                      right-[12px]
                      top-1/2
                      -translate-y-1/2
                    "
                    >
                      <ChevronDown size={16} color="#6B7280" />
                    </div>
                  </div>
                </div>

                {/* CONTINUE */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                  mt-6.5
                  h-[52px]
                  w-full
                  rounded-default
                  bg-primary
                  text-headline-xs
                  font-semibold
                  text-on-primary
                  disabled:opacity-70
                "
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Spinner />
                      {t("auth.creatingAccount")}
                    </span>
                  ) : (
                    "Continue"
                  )}
                </button>
              </form>

              {/* ALREADY HAVE ACCOUNT */}
              <div
                className="
                  mt-[18px]
                  flex
                  items-center
                  justify-center
                  gap-[2px]
                "
              >
                <span
                  className="
                    text-[12px]
                    text-on-surface
                  "
                >
                  {t("auth.haveAccount")}
                </span>

                <Link
                  to="/login"
                  className="
                    text-[12px]
                    text-[#3F81EA]
                    underline
                    underline-offset-[2px]
                  "
                >
                  {t("auth.loginButton")}
                </Link>
              </div>

              <div
                className="
                  mt-[14px]
                  flex
                  items-center
                  justify-center
                  gap-[6px]
                "
              >
                <span
                  className="
                    text-[12px]
                    text-outline
                  "
                >
                  or
                </span>
              </div>
              <button
                onClick={() => navigate("/homepage")}
                className="
                    text-[12px]
                    text-[#3F81EA]
                    font-bold
                  "
              >
                {t("auth.browseAsGuest")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
