import { useState } from "react";
import { Phone, ArrowLeft } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";

const ForgetPassword = () => {
  const [phone, setPhone] = useState("");

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
                src="src/assets/fp.png"
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
                Forgot Password?
              </h1>

              <p
                className="
                  mt-[8px]
                  text-body-md
                  text-on-surface-variant
                  max-w-[280px]
                "
              >
                Enter your registered phone number to receive a One- Time
                Password (OTP) for account recovery.
              </p>

              {/* PHONE NUMBER */}
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
                  Phone Number
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
                    placeholder="98XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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

              {/* SUBMIT */}
              <button
                type="submit"
                onClick={handleSubmit}
                className="
                  mt-6.5
                  h-[52px]
                  rounded-default
                  bg-primary
                  text-headline-xs
                  font-semibold
                  text-on-primary
                "
              >
                Send OTP
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
                Cancel
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default ForgetPassword;
