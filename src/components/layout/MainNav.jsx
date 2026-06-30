import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, ShoppingCart, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top utility bar */}
      <div className="w-full bg-[#6C977D] py-1.5 px-0 sm:px-">
        <div className="max-w-[1512px] mx-auto flex justify-end items-center gap-6">
          <Link
            to="/about"
            className="text-white font-[Montserrat] text-sm font-normal hover:text-white/80 transition-colors"
          >
            About
          </Link>
          <button className="text-[#0052D5] font-[Montserrat] text-sm font-normal hover:opacity-80 transition-opacity bg-white/10 px-2 py-0.5 rounded">
            EN/NE
          </button>
          <button className="text-[#BA1A1A] font-[Montserrat] text-sm font-normal hover:opacity-80 transition-opacity">
            Logout
          </button>
        </div>
      </div>

      {/* Main navbar */}
      <nav className="w-full bg-[#FBF9F5] border-b border-[#C1C8C1]">
        <div className="max-w-[1512px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4 lg:gap-6">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#1B5E40] flex items-center justify-center flex-shrink-0">
              <svg
                width="22"
                height="19"
                viewBox="0 0 22 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.51288 19C4.06288 19 3.66288 18.8625 3.31288 18.5875C2.96288 18.3125 2.72121 17.9583 2.58788 17.525L0.0378788 8.275C-0.0454545 7.95833 0.00871213 7.66667 0.200379 7.4C0.392045 7.13333 0.654545 7 0.987879 7H5.73788L10.1379 0.45C10.2212 0.316667 10.3379 0.208333 10.4879 0.125C10.6379 0.0416667 10.7962 0 10.9629 0C11.1295 0 11.2879 0.0416667 11.4379 0.125C11.5879 0.208333 11.7045 0.316667 11.7879 0.45L16.1879 7H20.9879C21.3212 7 21.5837 7.13333 21.7754 7.4C21.967 7.66667 22.0212 7.95833 21.9379 8.275L19.3879 17.525C19.2545 17.9583 19.0129 18.3125 18.6629 18.5875C18.3129 18.8625 17.9129 19 17.4629 19H4.51288ZM10.9879 15C11.5379 15 12.0087 14.8042 12.4004 14.4125C12.792 14.0208 12.9879 13.55 12.9879 13C12.9879 12.45 12.792 11.9792 12.4004 11.5875C12.0087 11.1958 11.5379 11 10.9879 11C10.4379 11 9.96704 11.1958 9.57538 11.5875C9.18371 11.9792 8.98788 12.45 8.98788 13C8.98788 13.55 9.18371 14.0208 9.57538 14.4125C9.96704 14.8042 10.4379 15 10.9879 15ZM8.16288 7H13.7879L10.9629 2.8L8.16288 7Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="text-[#1B5E40] font-[Montserrat] text-2xl font-bold leading-8 hidden sm:block">
              Pathivara
            </span>
          </Link>

          {/* Search Bar - grows in the middle */}
          <div className="flex-1 max-w-[592px] mx-auto hidden md:block">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717973]"
                size={18}
              />
              <input
                type="text"
                placeholder="Search rice, tori tel..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-[#E2EAE3] rounded-full text-sm text-[#1D1B20] placeholder:text-[#6B7280] font-[Montserrat] font-normal focus:outline-none focus:ring-2 focus:ring-[#1B5E40]/30"
              />
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden text-[#414943] font-[Montserrat] text-base font-medium hover:text-[#1B5E40] transition-colors whitespace-nowrap lg:flex items-center gap-6 mx-0 flex-shrink-0">
            <Link to="/cart">Cart</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/track">Track Order</Link>
            <button className="relative p-1 hover:opacity-80 transition-opacity">
              <svg
                width="17"
                height="21"
                viewBox="0 0 17 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 17.85V15.75H2.125V8.4C2.125 6.9475 2.56771 5.66125 3.45312 4.54125C4.33854 3.40375 5.48958 2.66 6.90625 2.31V1.575C6.90625 1.1375 7.05677 0.769999 7.35781 0.472499C7.67656 0.1575 8.05729 0 8.5 0C8.94271 0 9.31458 0.1575 9.61563 0.472499C9.93438 0.769999 10.0938 1.1375 10.0938 1.575V2.31C11.5104 2.66 12.6615 3.40375 13.5469 4.54125C14.4323 5.66125 14.875 6.9475 14.875 8.4V15.75H17V17.85H0ZM8.5 21C7.91563 21 7.41094 20.7987 6.98594 20.3962C6.57865 19.9762 6.375 19.4775 6.375 18.9H10.625C10.625 19.4775 10.4125 19.9762 9.9875 20.3962C9.58021 20.7987 9.08438 21 8.5 21ZM4.25 15.75H12.75V8.4C12.75 7.245 12.3339 6.25625 11.5016 5.43375C10.6693 4.61125 9.66875 4.2 8.5 4.2C7.33125 4.2 6.33073 4.61125 5.49844 5.43375C4.66615 6.25625 4.25 7.245 4.25 8.4V15.75Z"
                  fill="#1D1B20"
                />
              </svg>
            </button>
            <button className="w-7 h-7 rounded-full bg-white border border-[#C1C8C1]/20 flex items-center justify-center hover:opacity-80 transition-opacity shadow-sm">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                  fill="#1D1B20"
                />
              </svg>
            </button>
          </div>

          {/* Mobile right section */}
          <div className="flex items-center gap-3 ml-auto lg:hidden">
            <button className="p-1 text-[#414943]">
              <Search size={20} />
            </button>
            <Link to="/cart" className="p-1 text-[#414943]">
              <ShoppingCart size={20} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 text-[#414943]"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[#717973]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search rice, tori tel..."
              className="w-full pl-10 pr-4 py-2 bg-[#E2EAE3] rounded-full text-sm text-[#1D1B20] placeholder:text-[#6B7280] font-[Montserrat] focus:outline-none focus:ring-2 focus:ring-[#1B5E40]/30"
            />
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#C1C8C1] bg-[#FBF9F5] px-4 py-4 flex flex-col gap-4">
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2 border-b border-[#C1C8C1]/40"
            >
              Cart
            </Link>
            <Link
              to="/orders"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2 border-b border-[#C1C8C1]/40"
            >
              My Orders
            </Link>
            <Link
              to="/track"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2 border-b border-[#C1C8C1]/40"
            >
              Track Order
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-[#414943] font-[Montserrat] text-base font-medium py-2"
            >
              About
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
