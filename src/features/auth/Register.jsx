import { Lock, Phone, User, ChevronDown } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";

export default function RegisterPage() {
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
                Create Account
              </h1>

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
                  Full Name
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
                    placeholder="Enter your full name"
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
                    placeholder="Enter your number"
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
                  Password
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
                  Buyer Type
                </label>

                <div className="relative">
                  <select
                    defaultValue=""
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
                      Choose buyer type
                    </option>
                    <option value="individual">Household/Regular Buyer</option>
                    <option value="bulk">Shop/Bulk Buyer</option>
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
                Continue
              </button>

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
                  Already have an account?
                </span>

                <button
                  className="
                    text-[12px]
                    text-[#3F81EA]
                    underline
                    underline-offset-[2px]
                  "
                >
                  Login
                </button>
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
                className="
                    text-[12px]
                    text-[#3F81EA]
                    font-bold
                  "
              >
                Browse as a guest →
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
