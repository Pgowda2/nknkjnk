import React, { useState } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, X, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { loginPublisher, DEFAULT_PUBLISHER } from '../utils/auth';

interface PublisherLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  actionReason?: string;
}

export const PublisherLoginModal: React.FC<PublisherLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  actionReason,
}) => {
  const [passcode, setPasscode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const res = loginPublisher(passcode);
      setLoading(false);
      if (res.success) {
        setPasscode('');
        onSuccess();
        onClose();
      } else {
        setError(res.message || 'Incorrect passcode. Access is restricted to the publisher.');
      }
    }, 250);
  };

  const handleUseDefaultKey = () => {
    setPasscode('madhurya2026');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Shield Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mb-5">
          <ShieldCheck size={26} />
        </div>

        <h3 className="text-xl font-extrabold text-gray-900 tracking-tight font-sans">
          Publisher Access Required
        </h3>

        <p className="text-xs text-gray-500 mt-1.5 leading-relaxed font-sans">
          {actionReason || 'Only the verified publisher can upload Markdown files, draft articles, edit, or delete blogs. Readers have read-only access.'}
        </p>

        {/* Publisher Identity Badge */}
        <div className="mt-4 p-3 rounded-2xl bg-surfaceLight border border-gray-200/80 flex items-center gap-3">
          <img
            src={DEFAULT_PUBLISHER.avatar}
            alt={DEFAULT_PUBLISHER.name}
            className="w-10 h-10 rounded-full object-cover border border-white shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-gray-900 truncate flex items-center gap-1.5">
              <span>{DEFAULT_PUBLISHER.name}</span>
              <span className="text-[10px] font-semibold text-brand-700 bg-brand-50 px-1.5 py-0.2 rounded">
                Publisher
              </span>
            </div>
            <div className="text-[11px] text-gray-500 truncate">
              {DEFAULT_PUBLISHER.email}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
              Publisher Passkey / Passcode
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={15} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passcode}
                onChange={(e) => {
                  setPasscode(e.target.value);
                  if (error) setError(null);
                }}
                autoFocus
                placeholder="Enter publisher passcode..."
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                title={showPassword ? 'Hide passcode' : 'Show passcode'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-shake">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick passkey helper */}
          <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
            <span>Passkey: <code className="font-mono font-bold text-gray-800 bg-gray-100 px-1.5 py-0.5 rounded">madhurya2026</code></span>
            <button
              type="button"
              onClick={handleUseDefaultKey}
              className="text-brand-600 hover:text-brand-700 font-semibold hover:underline cursor-pointer"
            >
              Fill default key
            </button>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-gray-900 hover:bg-brand-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              <KeyRound size={14} />
              {loading ? 'Verifying...' : 'Unlock Publishing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
