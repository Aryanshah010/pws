import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";
import { useStore } from "../../store/store";
import { toast } from "react-toastify";
import { apiRequest } from "../../services/api";
import Spinner from "../../components/common/Spinner";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { recovery, setRecovery } = useStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return setError("Passwords do not match");
    }
    if (!recovery?.resetToken) return navigate("/forget-password");
    setError("");
    setLoading(true);
    try {
      await apiRequest("/auth/password-reset", {
        method: "PUT",
        body: JSON.stringify({
          resetToken: recovery.resetToken,
          password: newPassword,
        }),
      });
      setRecovery(null);
      toast.success("Password changed — please log in");
      navigate("/login");
    } catch (err) {
      const message = err.message || "Could not change password";
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
                src="src/assets/reset_pass.png"
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
                Change your Password
              </h1>

              <p
                className="
                  mt-[8px]
                  text-body-md
                  text-on-surface-variant
                  max-w-[280px]
                "
              >
                Enter a new secure password below to update your account access.
              </p>

              {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}

              {/* NEW PASSWORD */}
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
                  New Password
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
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new password"
                    className="
                      h-[44px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#C1C8C1]
                      bg-[#F4FBF4]
                      pl-[48px]
                      pr-[44px]
                      text-body-md
                      outline-none
                      focus:border-primary
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="
                      absolute
                      right-[12px]
                      top-1/2
                      -translate-y-1/2
                      text-outline
                    "
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* CONFIRM PASSWORD */}
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
                  Confirm Password
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
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Confirm new password"
                    className="
                      h-[44px]
                      w-full
                      rounded-[8px]
                      border
                      border-[#C1C8C1]
                      bg-[#F4FBF4]
                      pl-[48px]
                      pr-[44px]
                      text-body-md
                      outline-none
                      focus:border-primary
                    "
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="
                      absolute
                      right-[12px]
                      top-1/2
                      -translate-y-1/2
                      text-outline
                    "
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* CHANGE PASSWORD */}
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
                  font-bold
                  text-on-primary
                "
              >
                {loading ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Spinner size={18} />
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>

              <Link
                to="/login"
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
                <ArrowLeft size={14} />
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ChangePassword;
