import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { User, Phone, Lock, Home, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [buyerType, setBuyerType] = useState('household'); // 'household' or 'shop'
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !phone || !password) {
      setError('Please fill in all fields');
      return;
    }

    const mockUser = {
      name,
      phone,
      type: buyerType,
    };

    setUser(mockUser);
    
    // Request notification permission after registration (Sprint 1 task 8)
    if ('Notification' in window) {
      Notification.requestPermission();
    }

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-2xl px-md">
      <div className="max-w-md w-full mx-auto bg-surface-lowest rounded-lg border border-outline-variant shadow-level-3 p-xl">
        
        {/* Back Link */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-lg transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Title */}
        <div className="text-center mb-xl">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-headline-sm mx-auto mb-sm">
            P
          </div>
          <h2 className="font-sans text-headline-sm font-bold text-on-surface">
            Create Pathivara Account
          </h2>
          <p className="font-sans text-body-md text-on-surface-variant mt-xs">
            Join Jhapa's premium e-grocery hub
          </p>
        </div>

        {error && (
          <div className="mb-md p-md bg-error-container text-on-error-container rounded-default text-body-md font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          
          {/* Full Name */}
          <div className="flex flex-col gap-xs">
            <label className="font-sans text-label-sm font-bold text-on-surface">
              Full Name / Business Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="text"
                placeholder="Enter full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-xl pr-md py-sm bg-surface-low border border-outline-variant rounded-default text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Phone Number */}
          <div className="flex flex-col gap-xs">
            <label className="font-sans text-label-sm font-bold text-on-surface">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-xl pr-md py-sm bg-surface-low border border-outline-variant rounded-default text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-xs">
            <label className="font-sans text-label-sm font-bold text-on-surface">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="password"
                placeholder="Choose a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-xl pr-md py-sm bg-surface-low border border-outline-variant rounded-default text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Buyer Type Selector */}
          <div className="flex flex-col gap-xs">
            <label className="font-sans text-label-sm font-bold text-on-surface">
              Account Type (Select One)
            </label>
            <div className="grid grid-cols-2 gap-sm">
              
              {/* Household */}
              <button
                type="button"
                onClick={() => setBuyerType('household')}
                className={`p-md rounded-default border-2 flex flex-col items-center gap-xs text-center transition-all ${
                  buyerType === 'household'
                    ? 'border-primary bg-primary-fixed/30 text-on-primary-fixed'
                    : 'border-outline-variant text-on-surface-variant hover:border-outline'
                }`}
              >
                <Home size={20} />
                <span className="font-sans text-label-sm font-bold">Household</span>
                <span className="text-[10px] opacity-80 font-medium">Standard Retail Rates</span>
              </button>

              {/* Shop/Bulk Buyer */}
              <button
                type="button"
                onClick={() => setBuyerType('shop')}
                className={`p-md rounded-default border-2 flex flex-col items-center gap-xs text-center transition-all ${
                  buyerType === 'shop'
                    ? 'border-primary bg-primary-fixed/30 text-on-primary-fixed'
                    : 'border-outline-variant text-on-surface-variant hover:border-outline'
                }`}
              >
                <ShoppingBag size={20} />
                <span className="font-sans text-label-sm font-bold">Shop Owner</span>
                <span className="text-[10px] opacity-80 font-medium">Wholesale Pricing Tiers</span>
              </button>

            </div>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-md bg-primary text-white font-sans text-label-md font-bold rounded-default hover:bg-primary-container shadow-level-1 hover:shadow-level-2 transition-all mt-sm"
          >
            Create Account
          </button>

        </form>

        {/* Login footer */}
        <div className="mt-xl text-center text-body-md text-on-surface-variant">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-primary hover:underline">
            Log In
          </Link>
        </div>

      </div>
    </div>
  );
}
