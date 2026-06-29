import { useState } from "react";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";

const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
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
                Reset Password
              </button>

              {/* BACK TO LOGIN */}
              <a
                href="/login"
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
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ChangePassword;
