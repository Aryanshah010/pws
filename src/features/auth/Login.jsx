import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../../store/store';
import { Phone, Lock, ArrowLeft } from 'lucide-react';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const setUser = useStore((state) => state.setUser);
  
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [recoverySent, setRecoverySent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!phoneNumber || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Simulate login and set a mock user
    const mockUser = {
      name: phoneNumber === '9812345678' ? 'Hari Prasad (Kirana Shop)' : 'Sita Devi',
      phone: phoneNumber,
      type: phoneNumber === '9812345678' ? 'shop' : 'household',
    };
    
    setUser(mockUser);
    
    // Request notification permission after login (Sprint 1 task 8)
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    
    navigate('/');
  };

  const handleRecovery = () => {
    if (!phoneNumber) {
      setError('Please enter your phone number first');
      return;
    }
    setRecoverySent(true);
    setError('');
    setTimeout(() => {
      alert(`OTP code sent to ${phoneNumber}. (Use '1234' to reset)`);
    }, 500);
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
            Log In to Pathivara
          </h2>
          <p className="font-sans text-body-md text-on-surface-variant mt-xs">
            Access wholesale and retail prices
          </p>
        </div>

        {error && (
          <div className="mb-md p-md bg-error-container text-on-error-container rounded-default text-body-md font-semibold">
            {error}
          </div>
        )}

        {recoverySent && (
          <div className="mb-md p-md bg-primary-fixed/30 text-on-primary-fixed rounded-default text-body-md font-semibold">
            Password recovery SMS sent! Please check your messages.
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {/* Phone Number Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-sans text-label-sm font-bold text-on-surface">
              Phone Number
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="tel"
                placeholder="98XXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-xl pr-md py-sm bg-surface-low border border-outline-variant rounded-default text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-xs">
            <label className="font-sans text-label-sm font-bold text-on-surface">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-xl pr-md py-sm bg-surface-low border border-outline-variant rounded-default text-body-md text-on-surface focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Recovery link */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleRecovery}
              className="text-label-sm font-bold text-secondary hover:underline"
            >
              Forgot Password? (Recover via SMS)
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-md bg-primary text-white font-sans text-label-md font-bold rounded-default hover:bg-primary-container shadow-level-1 hover:shadow-level-2 transition-all"
          >
            Log In
          </button>
        </form>

        {/* Register footer */}
        <div className="mt-xl text-center text-body-md text-on-surface-variant">
          New to Pathivara?{' '}
          <Link to="/register" className="font-bold text-primary hover:underline">
            Register Account
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-lg p-md bg-surface-container rounded-default text-label-sm text-on-surface-variant flex flex-col gap-xs">
          <p className="font-bold">Test Accounts:</p>
          <p>• Shop/Wholesale: <code className="bg-white px-1">9812345678</code> / password</p>
          <p>• Household: <code className="bg-white px-1">9876543210</code> / password</p>
        </div>

      </div>
    </div>
  );
}
