import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { BookOpen, ShieldCheck, Plus, LogOut, ExternalLink, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useTheme } from '../context/ThemeContext.js';

export const PublisherNavbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/publisher/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Brand with Publisher Badge */}
        <div className="flex items-center gap-3">
          <Link to="/publisher/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
              <BookOpen size={16} />
            </div>
            <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white font-sans">
              Inkwell
            </span>
          </Link>
          <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 dark:bg-brand-950 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
            <ShieldCheck size={12} /> Publisher
          </span>
        </div>

        {/* Links and Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/publisher/dashboard"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              location.pathname === '/publisher/dashboard'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/publisher/posts/new"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
          >
            <Plus size={14} />
            <span>New Post</span>
          </Link>

          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Open live visitor site in new tab"
          >
            <ExternalLink size={13} />
            <span>View Site</span>
          </Link>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>

          {/* Publisher User & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 dark:border-gray-800">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] text-gray-400 leading-tight">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
              title="Sign Out of Publisher Mode"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
