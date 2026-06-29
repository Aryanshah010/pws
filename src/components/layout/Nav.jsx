import { useState } from "react";

function LeafIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6.524 22.5C6.074 22.5 5.674 22.3625 5.324 22.0875C4.974 21.8125 4.733 21.4583 4.6 21.025L2.05 11.775C1.966 11.4583 2.02 11.1667 2.212 10.9C2.404 10.6333 2.666 10.5 3 10.5H7.75L12.15 3.95C12.233 3.8167 12.35 3.7083 12.5 3.625C12.65 3.5417 12.808 3.5 12.975 3.5C13.141 3.5 13.3 3.5417 13.45 3.625C13.6 3.7083 13.716 3.8167 13.8 3.95L18.2 10.5H23C23.333 10.5 23.595 10.6333 23.787 10.9C23.979 11.1667 24.033 11.4583 23.95 11.775L21.4 21.025C21.266 21.4583 21.025 21.8125 20.675 22.0875C20.325 22.3625 19.925 22.5 19.475 22.5H6.524ZM13 18.5C13.55 18.5 14.02 18.3042 14.412 17.9125C14.804 17.5208 15 17.05 15 16.5C15 15.95 14.804 15.4792 14.412 15.0875C14.02 14.6958 13.55 14.5 13 14.5C12.45 14.5 11.979 14.6958 11.587 15.0875C11.195 15.4792 11 15.95 11 16.5C11 17.05 11.195 17.5208 11.587 17.9125C11.979 18.3042 12.45 18.5 13 18.5ZM10.175 10.5H15.8L13 6.3L10.175 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="2" y="4.5"  width="16" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="9.25" width="16" height="1.5" rx="0.75" fill="currentColor" />
      <rect x="2" y="14"   width="16" height="1.5" rx="0.75" fill="currentColor" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "About",  href: "#about"  },
  { label: "Login",  href: "#login"  },
];

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]         = useState(null);

  return (
    <>
      <style>{`
        .nav {
          width: 100%;
          height: var(--spacing-3xl);           /* 64px */
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-outline-variant);
          display: flex;
          align-items: center;
          padding: 0 var(--spacing-lg);
          position: relative;
          z-index: 50;
        }

        .nav__inner {
          width: 100%;
          max-width: 1512px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* ── Brand ── */
        .nav__brand {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          text-decoration: none;
          flex-shrink: 0;
        }

        .nav__logo-circle {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-full);
          background: var(--color-primary-container);
          color: var(--color-on-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .nav__brand-name {
          font-family: var(--font-sans);
          font-size: var(--text-headline-sm);
          font-weight: var(--text-headline-sm--font-weight);
          line-height: var(--text-headline-sm--line-height);
          color: var(--color-primary-container);
          letter-spacing: -0.3px;
        }

        /* ── Right cluster ── */
        .nav__right {
          display: flex;
          align-items: center;
        }

        .nav__links {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .nav__link {
          font-family: var(--font-sans);
          font-size: var(--text-label-md);
          font-weight: var(--text-label-md--font-weight);
          line-height: var(--text-label-md--line-height);
          color: var(--color-on-surface-variant);
          text-decoration: none;
          padding: var(--spacing-sm) 14px;
          border-radius: var(--radius-default);
          transition:
            background var(--duration-medium) var(--ease-standard),
            color      var(--duration-medium) var(--ease-standard);
          cursor: pointer;
          white-space: nowrap;
        }

        .nav__link:hover {
          background: var(--color-surface-low);
          color: var(--color-primary-container);
        }

        .nav__link--active {
          color: var(--color-primary-container);
          background: color-mix(in srgb, var(--color-primary-container) 8%, transparent);
        }

        /* ── Separator ── */
        .nav__sep {
          width: 1px;
          height: 16px;
          background: var(--color-outline-variant);
          margin: 0 var(--spacing-md);
          flex-shrink: 0;
        }

        /* ── CTA button ── */
        .nav__cta {
          font-family: var(--font-sans);
          font-size: var(--text-label-md);
          font-weight: var(--text-label-md--font-weight);
          line-height: 1;
          color: var(--color-on-primary);
          background: var(--color-primary-container);
          border: none;
          border-radius: var(--radius-default);
          padding: 0 var(--spacing-md);
          height: 32px;
          cursor: pointer;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          letter-spacing: 0.1px;
          flex-shrink: 0;
          transition:
            background var(--duration-medium) var(--ease-standard),
            transform  var(--duration-short)  var(--ease-standard);
        }

        .nav__cta:hover  { background: var(--color-primary); }
        .nav__cta:active { transform: scale(0.98); }

        /* ── Mobile toggle ── */
        .nav__toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: var(--spacing-xs);
          border-radius: var(--radius-default);
          color: var(--color-on-surface-variant);
          align-items: center;
          justify-content: center;
          transition: background var(--duration-medium) var(--ease-standard);
        }

        .nav__toggle:hover { background: var(--color-surface-low); }

        /* ── Mobile drawer ── */
        .nav__drawer {
          display: none;
          position: absolute;
          top: var(--spacing-3xl);
          left: 0;
          right: 0;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-outline-variant);
          padding: var(--spacing-sm) var(--spacing-lg) var(--spacing-md);
          flex-direction: column;
          gap: var(--spacing-xs);
          box-shadow: var(--shadow-level-2);
        }

        .nav__drawer--open { display: flex; }

        .nav__drawer-link {
          font-family: var(--font-sans);
          font-size: var(--text-label-md);
          font-weight: var(--text-label-md--font-weight);
          color: var(--color-on-surface-variant);
          text-decoration: none;
          padding: 10px var(--spacing-sm);
          border-radius: var(--radius-default);
          transition:
            background var(--duration-medium) var(--ease-standard),
            color      var(--duration-medium) var(--ease-standard);
        }

        .nav__drawer-link:hover {
          background: var(--color-surface-low);
          color: var(--color-primary-container);
        }

        .nav__drawer-cta {
          font-family: var(--font-sans);
          font-size: var(--text-label-md);
          font-weight: var(--text-label-md--font-weight);
          color: var(--color-on-primary);
          background: var(--color-primary-container);
          border: none;
          border-radius: var(--radius-default);
          padding: 10px var(--spacing-sm);
          cursor: pointer;
          text-align: left;
          margin-top: var(--spacing-sm);
          transition: background var(--duration-medium) var(--ease-standard);
        }

        .nav__drawer-cta:hover { background: var(--color-primary); }

        /* ── Responsive breakpoint ── */
        @media (max-width: 640px) {
          .nav__links,
          .nav__sep,
          .nav__cta   { display: none; }
          .nav__toggle { display: flex; }
        }
      `}</style>

      <nav className="nav" role="navigation" aria-label="Main navigation">
        <div className="nav__inner">

          {/* Brand */}
          <a className="nav__brand" href="/" aria-label="Pathivara home">
            <div className="nav__logo-circle">
              <LeafIcon size={22} />
            </div>
            <span className="nav__brand-name">Pathivara</span>
          </a>

          {/* Desktop right cluster */}
          <div className="nav__right">
            <ul className="nav__links" role="list">
              {NAV_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={`nav__link${active === label ? " nav__link--active" : ""}`}
                    onClick={(e) => { e.preventDefault(); setActive(label); }}
                    aria-current={active === label ? "page" : undefined}
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="nav__sep" aria-hidden="true" />

            <a href="#register" className="nav__cta" onClick={(e) => e.preventDefault()}>
              Register Now
            </a>

            {/* Mobile hamburger */}
            <button
              className="nav__toggle"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="nav-drawer"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          id="nav-drawer"
          className={`nav__drawer${mobileOpen ? " nav__drawer--open" : ""}`}
          role="menu"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="nav__drawer-link"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault();
                setActive(label);
                setMobileOpen(false);
              }}
            >
              {label}
            </a>
          ))}
          <button
            className="nav__drawer-cta"
            role="menuitem"
            onClick={() => setMobileOpen(false)}
          >
            Register Now
          </button>
        </div>
      </nav>
    </>
  );
}