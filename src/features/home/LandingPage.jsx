import rice from "../../assets/rice.svg";
import oil from "../../assets/oil.svg";
import flour from "../../assets/flour.svg";
import dal from "../../assets/dal.svg";

import { ShieldCheck, LayoutGrid, RotateCcw, Truck } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-on-background">
      <section className="mx-auto max-w-378 px-17 pt-11.5 pb-20">
        {/* HERO */}
        <div className="grid grid-cols-[520px_1fr] items-start gap-46">
          {/* LEFT */}
          <div className="pt-14.5">
            <h1
              className="
                            text-[56px]
                            leading-[64px]
                            font-extrabold
                            tracking-[-0.02em]
                            text-primary
                        "
            >
              Pickup only
            </h1>

            <div className="mt-7">
              <p className="text-[18px] font-semibold leading-7">
                Live stock before order
              </p>

              <div className="mt-2.5 flex items-center gap-2.5">
                <span className="text-[18px] font-semibold">
                 💬 WhatsApp/SMS confirmation
                </span>
              </div>

              <p
                className="
                                mt-[24px]
                                max-w-105
                                text-body-md
                                leading-5.5
                                text-on-surface-variant
                            "
              >
                You receive exactly what you ordered or can raise an issue with
                photo proof. Our guarantee ensures transparency and quality with
                every pickup.
              </p>
            </div>

            <button
              className="
                            mt-9
                            h-14
                            rounded-default
                            bg-primary
                            px-7
                            text-[15px]
                            font-semibold
                            text-on-primary
                        "
            >
              Register Now
            </button>
          </div>

          {/* RIGHT */}
          <div className="w-160">
            {/* GUARANTEE */}
            <div
              className="
                            mb-4.5
                            flex
                            h-14.5
                            items-center
                            gap-3
                            rounded-default
                            bg-[#DDE7DE]
                            px-4.5
                        "
            >
              <div
                className="
                                flex
                                h-6.5
                                w-6.5
                                items-center
                                justify-center
                                rounded-full
                                bg-primary
                            "
              >
                <ShieldCheck size={14} color="white" />
              </div>

              <div>
                <div className="text-[13px] font-bold">
                  First order guarantee:
                  <span className="font-medium">
                    {" "}
                    receive exactly what you ordered.
                  </span>
                </div>
              </div>
            </div>

            {/* IMAGE */}
            <div
              className="
                            overflow-hidden
                            rounded-default
                            border
                            border-outline-variant
                        "
            >
              <img
                src="/src/assets/warehouse.jpg"
                alt=""
                className="
                                h-90
                                w-full
                                object-cover
                            "
              />
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section className="mt-21">
          <h2 className="text-[34px] font-bold leading-10">Features</h2>

          <div className="mt-7 grid grid-cols-3 gap-15">
            <FeatureCard
              icon={<LayoutGrid size={18} />}
              iconBg="#CFE7D4"
              title="Browse Products"
              text="Explore our curated selection of fresh produce and pantry essentials available for immediate pickup."
            />

            <FeatureCard
              icon={<RotateCcw size={18} />}
              iconBg="#F6DFC7"
              title="My Orders / Reorder"
              text="Quickly access your purchase history and restock your favorites with just a single click."
            />

            <FeatureCard
              icon={<Truck size={18} />}
              iconBg="#F5D1C8"
              title="Track Order"
              text="Real-time status updates from order confirmation through to your scheduled pickup time."
            />
          </div>
        </section>

        {/* QUICK ACCESS */}
        <section className="mt-18">
          <h3 className="text-[34px] font-bold">Staples Quick Access</h3>

          <div className="mt-6.5 flex gap-[16px]">
            <Chip image={rice} label="Rice" />
            <Chip image={oil} label="Oil" />
            <Chip image={flour} label="Flour" />
            <Chip image={dal} label="Dal" />
            <Chip label="More" />
          </div>
        </section>
      </section>
    </main>
  );
}

function FeatureCard({ icon, iconBg, title, text }) {
  return (
    <div
      className="
            rounded-[10px]
            border
            border-outline-variant
            bg-surface-lowest
            p-5.5
            shadow-(--shadow-level-1)
        "
    >
      <div
        className="
                mb-4.5
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-default
            "
        style={{
          background: iconBg,
        }}
      >
        {icon}
      </div>

      <h3 className="text-[18px] font-bold">{title}</h3>

      <p className="mt-2.5 text-body-md text-on-surface-variant">{text}</p>
    </div>
  );
}

function Chip({ image, label }) {
  return (
    <button
      className="
                flex
                h-[54px]
                items-center
                gap-[10px]
                rounded-full
                border
                border-outline-variant
                bg-surface
                px-[18px]
                text-[14px]
                font-[600]
            "
    >
      {image && (
        <img src={image} alt="" className="h-[18px] w-[18px] object-contain" />
      )}

      <span>{label}</span>
    </button>
  );
}
