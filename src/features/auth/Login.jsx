import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Lock, Phone } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../store/store";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";
import Spinner from "../../components/common/Spinner";

export default function LoginPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const [phone, setPhone] = useState(location.state?.phone || "");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, password }),
      });
      setUser(data.user, data.token);
      const firstName = data.user.fullName?.split(" ")[0] || "there";

      if (data.user.role === "admin") {
        toast.success(t("auth.welcomeBack", { name: firstName }));
        return navigate("/admin");
      }

      if (data.firstLogin) {
        toast.success(t("auth.welcomeNew", { name: firstName }));
        const needsWholesaleForm =
          data.user.role === "bulk/shop" &&
          data.user.wholesaleStatus === "not_requested";
        return navigate(
          needsWholesaleForm ? "/wholesale-form" : "/account-active",
        );
      }

      toast.success(t("auth.welcomeBack", { name: firstName }));
      navigate("/homepage");
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
                src="src/assets/bora.jpg"
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
                {t("auth.loginTitle")}
              </h1>

              <p
                className="
                  mt-[8px]
                  text-body-md
                  text-on-surface-variant
                  max-w-[280px]
                "
              >
                {t("auth.loginSubtitle")}
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin}>
                {/* PHONE */}
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
                      left-3
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
                      h-11
                      w-full
                      rounded-default
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

                {/* LINKS */}
                <div
                  className="
                  mt-2.5
                  flex
                  justify-between
                  items-center
                "
                >
                  <Link
                    to="/forget-password"
                    className="
                    text-[12px]
                    font-semibold
                    text-[#3F81EA]
                  "
                  >
                    {t("auth.forgotPassword")}
                  </Link>

                  <div className="flex items-center gap-0.5">
                    <span
                      className="
                      text-[12px]
                      font-semibold
                      text-black
                    "
                    >
                      {t("auth.newBuyer")}
                    </span>

                    <Link
                      to="/register"
                      className="
                      text-[12px]
                      font-semibold
                      text-[#D4820A]
                    "
                    >
                      {t("auth.register")}
                    </Link>
                  </div>
                </div>

                {/* LOGIN */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                  mt-6.5
                  h-13
                  rounded-default
                  bg-primary
                  text-headline-xs
                  font-semibold
                  text-on-primary
                  w-full
                  disabled:opacity-70
                "
                >
                  {loading ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <Spinner />
                      {t("auth.loggingIn")}
                    </span>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>

              {/* DIVIDER */}
              <div
                className="
                  mt-5.5
                  flex
                  items-center
                  gap-3
                "
              >
                <div className="flex-1 h-px bg-outline-variant" />
                <span className="text-label-sm text-outline">OR</span>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              {/* GUEST */}
              <button
                onClick={() => navigate("/homepage")}
                className="
                  mt-4.5
                  h-[48px]
                  w-full
                  rounded-default
                  border
                  border-[#C1C8C1]
                  bg-transparent
                  text-[12px]
                  font-semibold
                  text-on-surface
                "
              >
                {t("auth.browseGuest")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
