import { useState, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Nav from "../../components/layout/Nav";
import Footer from "../../components/layout/Footer";

const OtpVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

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
                  Enter 6-digit OTP
                </h1>

                <p
                  className="
                  text-body-md
                  mt-2
                  text-on-surface-variant
                  max-w-70
                "
                >
                  We have sent a verification code to your registered mobile
                  number.
                </p>
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
                Continue
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
                Resend OTP
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
};

export default OtpVerification;
