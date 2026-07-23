import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../store/store";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";
import Spinner from "../../components/common/Spinner";

const OtpVerification = () => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { recovery, setRecovery } = useStore();

  const handleChange = (index, value) => {
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!recovery?.phone) {
      navigate("/forget-password");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await apiRequest("/auth/password-reset/verify", {
        method: "POST",
        body: JSON.stringify({ phone: recovery.phone, otp: otp.join("") }),
      });
      setRecovery({ ...recovery, resetToken: data.resetToken });
      toast.success(t("auth.otpVerified"));
      navigate("/change-password");
    } catch (err) {
      const message = err.message || "Could not verify OTP";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!recovery?.phone) return navigate("/forget-password");
    setError("");
    try {
      const data = await apiRequest("/auth/password-reset/request", {
        method: "POST",
        body: JSON.stringify({ phone: recovery.phone }),
      });
      setRecovery({ phone: recovery.phone, demoOtp: data.demoOtp || null });
      toast.success(t("auth.otpResent"));
    } catch (err) {
      const message = err.message || "Could not resend OTP";
      setError(message);
      toast.error(message);
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
                src="src/assets/enter-otp-concept-illustration_86047-735.png"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>

            {/* FORM */}
            <div
              className="
                px-10.5
                flex
                flex-col
                justify-center
              "
            >
              <div className="mb-16">
                <h1
                  className="
                  text-headline-lg
                  font-bold
                  text-primary
                "
                >
                  {t("auth.otpTitle")}
                </h1>

                <p
                  className="
                  text-body-md
                  mt-2
                  text-on-surface-variant
                  max-w-70
                "
                >
                  {t("auth.otpSubtitle")}
                </p>
                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
                    {error}
                  </div>
                )}
                {recovery?.demoOtp && (
                  <p className="mt-2 text-xs text-on-surface-variant">
                    Demo OTP: {recovery.demoOtp}
                  </p>
                )}
              </div>

              {/* OTP INPUTS */}
              <div>
                <div className="flex gap-[10px]">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="
                        w-[44px]
                        h-[48px]
                        rounded-[8px]
                        border
                        border-[#C1C8C1]
                        bg-[#F4FBF4]
                        text-center
                        text-headline-sm
                        font-semibold
                        text-on-surface
                        outline-none
                        focus:border-primary
                        caret-primary
                      "
                    />
                  ))}
                </div>
              </div>

              {/* VERIFY */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="
                  mt-6.5
                  h-13
                  rounded-default
                  bg-primary
                  text-headline-xs
                  font-semibold
                  text-on-primary
                "
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner size={18} />
                    {t("auth.verifying")}
                  </span>
                ) : (
                  "Continue"
                )}
              </button>

              {/* BACK TO LOGIN */}
              <button
                type="button"
                onClick={handleResend}
                className="
                  mt-[18px]
                  flex
                  items-center
                  justify-center
                  gap-[6px]
                  text-label-sm
                  font-semibold
                  text-primary
                "
              >
                {t("auth.resendOtp")}
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default OtpVerification;
