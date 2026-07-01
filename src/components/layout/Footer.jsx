function ShareIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="18" cy="5"  r="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="6"  cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.5"/>
      <line x1="8.59"  y1="13.51" x2="15.42" y2="17.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15.41" y1="6.51"  x2="8.59"  y2="10.49" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.54 5C6.6 5.89 6.75 6.76 6.99 7.59L5.79 8.79C5.38 7.6 5.12 6.32 5.03 5H6.54ZM16.4 17.02C17.25 17.26 18.12 17.41 19 17.47V18.96C17.68 18.87 16.4 18.61 15.2 18.21L16.4 17.02ZM7.5 3H4C3.45 3 3 3.45 3 4C3 13.39 10.61 21 20 21C20.55 21 21 20.55 21 20V16.51C21 15.96 20.55 15.51 20 15.51C18.76 15.51 17.55 15.31 16.43 14.94C16.33 14.9 16.22 14.89 16.12 14.89C15.86 14.89 15.61 14.99 15.41 15.18L13.21 17.38C10.38 15.93 8.06 13.62 6.62 10.79L8.82 8.59C9.1 8.31 9.18 7.92 9.07 7.57C8.7 6.45 8.5 5.25 8.5 4C8.5 3.45 8.05 3 7.5 3Z"
        fill="currentColor"
      />
    </svg>
  );
}

const FOOTER_LINKS = [
  { label: "Contact", href: "#contact" },
  { label: "Terms",   href: "#terms"   },
  { label: "Privacy", href: "#privacy" },
];

const SOCIAL_ICONS = [
  {
    label: "Share",
    href:  "#share",
    icon:  <ShareIcon />,
    style: "outline", // outlined circle, blue icon
  },
  {
    label: "Contact by phone",
    href:  "#phone",
    icon:  <PhoneIcon />,
    style: "filled",  // green filled circle, white icon
  },
];

export default function Footer() {
  return (
    <>
      <style>{`
        .footer {
          width: 100%;
          background: var(--color-outline-variant);   
          border-top: 1px solid var(--color-outline-variant);
          font-family: var(--font-sans);
        }

        .footer__inner {
          max-width: 1512px;
          margin: 0 auto;
          padding: 0 var(--spacing-4xl);             
          height: 111px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-xl);
        }

        /* ── LEFT: brand + copyright ── */
        .footer__brand {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);                    /* 4px vertical gap */
          flex-shrink: 0;
        }

        .footer__brand-name {
          font-family: var(--font-sans);
          font-size: var(--text-label-md);           /* 14px */
          font-weight: 700;
          line-height: var(--text-label-md--line-height);
          color: var(--color-on-primary-fixed);      /* #002112 — deep dark green */
          letter-spacing: -0.1px;
          text-decoration: none;
        }

        .footer__copyright {
          font-family: var(--font-sans);
          font-size: var(--text-label-sm);           /* 12px */
          font-weight: var(--text-label-sm--font-weight); /* 500 */
          line-height: var(--text-label-sm--line-height);
          color: var(--color-on-surface-variant);    /* #404943 */
          white-space: nowrap;
        }

        /* ── CENTER: footer nav links ── */
        .footer__nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-xl);                    /* 32px between links */
          list-style: none;
          margin: 0;
          padding: 0;
          flex-shrink: 0;
        }

        .footer__nav-link {
          font-family: var(--font-sans);
          font-size: var(--text-label-md);           /* 14px */
          font-weight: var(--text-label-md--font-weight); /* 500 */
          line-height: var(--text-label-md--line-height);
          color: var(--color-on-surface-variant);    /* #404943 */
          text-decoration: none;
          white-space: nowrap;
          transition:
            color var(--duration-medium) var(--ease-standard);
        }

        .footer__nav-link:hover {
          color: var(--color-primary-container);
        }

        /* ── RIGHT: social icon buttons ── */
        .footer__social {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);                    /* 8px between icons */
          flex-shrink: 0;
        }

        .footer__icon-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          text-decoration: none;
          transition:
            opacity    var(--duration-medium) var(--ease-standard),
            transform  var(--duration-short)  var(--ease-standard),
            box-shadow var(--duration-medium) var(--ease-standard);
          flex-shrink: 0;
        }

        .footer__icon-btn:hover  { opacity: 0.85; }
        .footer__icon-btn:active { transform: scale(0.95); }

        /* Outlined style — share icon */
        .footer__icon-btn--outline {
          background: transparent;
          border: 1px solid var(--color-outline-variant);  /* #C1C8C1 */
          color: #0052D5;                              /* LinkedIn/share brand blue */
        }

        .footer__icon-btn--outline:hover {
          box-shadow: var(--shadow-level-1);
        }

        /* Filled style — phone icon */
        .footer__icon-btn--filled {
          background: var(--color-primary-container); /* #1B5E40 */
          border: none;
          color: var(--color-on-primary);             /* #ffffff */
        }

        .footer__icon-btn--filled:hover {
          box-shadow: var(--shadow-level-2);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .footer__inner {
            padding: 0 var(--spacing-lg);
            flex-wrap: wrap;
            height: auto;
            padding-top: var(--spacing-lg);
            padding-bottom: var(--spacing-lg);
            gap: var(--spacing-md);
          }

          .footer__nav {
            gap: var(--spacing-lg);
            order: 3;
            width: 100%;
          }

          .footer__brand { order: 1; }
          .footer__social { order: 2; }
        }

        @media (max-width: 480px) {
          .footer__nav {
            gap: var(--spacing-md);
            flex-wrap: wrap;
          }

          .footer__copyright {
            white-space: normal;
          }
        }
      `}</style>

      <footer className="footer" role="contentinfo">
        <div className="footer__inner">

          {/* LEFT — Brand + copyright */}
          <div className="footer__brand">
            <a href="/" className="footer__brand-name" aria-label="Pathivara home">
              Pathivara
            </a>
            <span className="footer__copyright">
              © 2025 Pathivara. All rights reserved.
            </span>
          </div>

          {/* CENTER — Nav links */}
          <ul className="footer__nav" role="list">
            {FOOTER_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="footer__nav-link"
                  onClick={(e) => e.preventDefault()}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* RIGHT — Social / contact icons */}
          <div className="footer__social" role="list" aria-label="Social links">
            {SOCIAL_ICONS.map(({ label, href, icon, style }) => (
              <a
                key={label}
                href={href}
                className={`footer__icon-btn footer__icon-btn--${style}`}
                aria-label={label}
                role="listitem"
                onClick={(e) => e.preventDefault()}
              >
                {icon}
              </a>
            ))}
          </div>

        </div>
      </footer>
    </>
  );
}