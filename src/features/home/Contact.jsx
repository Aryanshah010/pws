import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MapPin, Mail, MessageSquare } from "lucide-react";
import { apiRequest } from "../../services/api";
import { useHomePath } from "../../hooks/useBackNavigation";

export default function Contact() {
  const navigate = useNavigate();
  const homePath = useHomePath();
  const [whatsApp, setWhatsApp] = useState("");

  useEffect(() => {
    apiRequest("/settings")
      .then((data) => setWhatsApp(data.settings?.contactWhatsApp || ""))
      .catch(() => setWhatsApp(""));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-md py-xl min-h-screen font-sans">
      <button
        onClick={() => navigate(homePath)}
        className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-lg transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Home
      </button>

      <h1 className="text-headline-md md:text-headline-lg font-bold text-primary mb-md">
        Contact Pathivara Staples
      </h1>

      <p className="text-body-lg text-on-surface-variant leading-relaxed mb-lg">
        Have questions about wholesale registration, pickup slots, or bulk
        orders? Get in touch with us through any of our channels. Our support
        team is ready to assist you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-md">
        {/* Contact Info */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-default bg-primary-fixed/40 flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-label-sm font-bold text-on-surface">
                Jhapa Warehouse Hub
              </p>
              <p className="text-body-md text-on-surface-variant">
                Birtamode-5, Jhapa, Nepal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-default bg-primary-fixed/40 flex items-center justify-center text-primary">
              <Phone size={20} />
            </div>
            <div>
              <p className="text-label-sm font-bold text-on-surface">
                Direct Call Line
              </p>
              <p className="text-body-md text-on-surface-variant">
                +977-9800000000
              </p>
            </div>
          </div>

          <div className="flex items-center gap-md">
            <div className="w-10 h-10 rounded-default bg-primary-fixed/40 flex items-center justify-center text-primary">
              <Mail size={20} />
            </div>
            <div>
              <p className="text-label-sm font-bold text-on-surface">
                Email Support
              </p>
              <p className="text-body-md text-on-surface-variant">
                support@pathivara.com
              </p>
            </div>
          </div>
        </div>

        {/* Messaging Box */}
        <div className="bg-surface-low border border-outline-variant p-lg rounded-md flex flex-col gap-sm">
          <h3 className="text-body-lg font-bold text-on-surface">
            Quick Chats
          </h3>
          <p className="text-body-md text-on-surface-variant">
            Click below to open chat directly with our store administrator:
          </p>
          <div className="flex flex-col gap-sm mt-xs">
            {whatsApp ? (
              <a
                href={`https://wa.me/${whatsApp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-xs py-sm bg-white border border-[#C1C8C1] rounded-default text-primary hover:bg-primary hover:text-white transition-all font-semibold"
              >
                <MessageSquare size={16} />
                Open WhatsApp Chat
              </a>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                No WhatsApp number published yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
