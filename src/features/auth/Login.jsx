import { Lock, Phone } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";

export default function LoginPage() {
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
              {/*
                            Insert later

                            <img
                                src={loginImage}
                                alt=""
                                className="
                                    h-full
                                    w-full
                                    object-cover
                                "
                            />
                            */}
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
                                    text-headline-md
                                    font-bold

                                    text-primary
                                "
              >
                Login to Pathivara
              </h1>

              <p
                className="
                                    mt-[8px]
                                    text-body-md
                                    text-on-surface-variant
                                    max-w-[280px]
                                "
              >
                Welcome back. Please enter your credentials to continue.
              </p>

              {/* PHONE */}
              <div className="mt-[30px]">
                <label
                  className="
                                        mb-[8px]
                                        block
                                        text-label-sm
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
                    <Phone size={14} color="#717973" />
                  </div>

                  <input
                    type="text"
                    placeholder="Enter your number"
                    className="
                                            h-[44px]
                                            w-full
                                            rounded-[8px]
                                            border
                                            border-outline-variant
                                            bg-surface
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
                                        text-on-surface-variant
                                    "
                >
                  Password
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
                    <Lock size={14} color="#717973" />
                  </div>

                  <input
                    type="password"
                    placeholder="••••••••"
                    className="
                                            h-11
                                            w-full
                                            rounded-default
                                            border
                                            border-outline-variant
                                            bg-surface
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
                <button
                  className="
                                        text-[12px]
                                        text-[#3F81EA]
                                    "
                >
                  Forgot password?
                </button>

                <div className="flex items-center gap-0.5">
                  <span
                    className="
                                            text-[12px]
                                            font-semibold
                                            text-black
                                        "
                  >
                    New Buyer?
                  </span>

                  <button
                    className="
                                            text-[12px]
                                            font-normal
                                            text-[#D4820A]
                                        "
                  >
                    Register
                  </button>
                </div>
              </div>

              {/* LOGIN */}
              <button
                className="
                                    mt-6.5
                                    h-13
                                    rounded-default
                                    bg-primary
                                    text-label-md
                                    font-medium
                                    text-on-primary
                                "
              >
                Login
              </button>

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

                <span
                  className="
                                        text-label-sm
                                        text-outline
                                    "
                >
                  OR
                </span>

                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              {/* GUEST */}
              <button
                className="
                                    mt-4.5
                                    h-[48px]
                                    rounded-default
                                    border
                                    border-[#C1C8C1]
                                    bg-transparent
                                    text-[12px]
                                    font-semibold
                                    text-on-surface
                                "
              >
                Continue browsing as guest
              </button>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
