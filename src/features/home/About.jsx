import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-md py-xl min-h-screen font-sans">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-lg transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <h1 className="text-headline-md md:text-headline-lg font-bold text-primary mb-md">
        About Pathivara Staples
      </h1>
      
      <div className="flex flex-col gap-md text-body-lg text-on-surface-variant leading-relaxed">
        <p>
          Pathivara Staples is a single-supplier B2B and B2C grocery hub situated in Jhapa, Nepal. We represent a streamlined, transparent approach to supplying essential food staples like rice, grains, cold-pressed oils, lentils, and spices.
        </p>

        <h2 className="text-headline-sm font-bold text-on-surface mt-sm">Our Key Differences:</h2>
        <ul className="list-disc pl-lg flex flex-col gap-xs">
          <li><strong>Direct Sourcing:</strong> We cut out multi-vendor friction and deal directly, passing down volume discount savings.</li>
          <li><strong>Role-Based Tiered Pricing:</strong> Kirana pasal shop owners get wholesale discounts, while households get honest retail pricing.</li>
          <li><strong>Zero-Delivery Pickup Model:</strong> No delivery delays, fees, or address errors. Choose a pickup slot at your convenience.</li>
          <li><strong>Live Stock Badge:</strong> What you see is exactly what is in stock in our physical warehouse.</li>
        </ul>
      </div>
    </div>
  );
}
