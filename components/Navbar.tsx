import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  FileText, 
  Calendar, 
  Sparkles, 
  GraduationCap, 
  Briefcase, 
  MessageSquare,
  Lock,
  ShieldCheck,
  Award,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext.js';
import { useAuth } from '../context/AuthContext.js';
import { PERSONAL_INFO } from '../data/portfolioData.js';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'About', href: '#about', icon: GraduationCap },
    { label: 'Experience', href: '#experience', icon: Briefcase },
    { label: 'Skills & EdTech', href: '#skills', icon: Code2 },
    { label: 'Curriculum (K–12)', href: '#curriculum', icon: Sparkles },
    { label: 'Interactive Lab', href: '#playground', icon: Code2 },
    { label: 'Resume', href: '#resume', icon: FileText },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-[#0d1117]/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 dark:border-gray-800' 
          : 'bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand Identity */}
        <a 
          href="#hero" 
          onClick={(e) => handleNavClick(e, '#hero')}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-indigo-500 text-white flex items-center justify-center font-bold shadow-sm transition-transform group-hover:scale-105">
            <Code2 size={20} />
          </div>
          <div>
            <span className="text-base sm:text-lg font-extrabold text-gray-900 dark:text-white tracking-tight leading-tight block">
              {PERSONAL_INFO.name}
            </span>
            <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 block tracking-wide">
              Senior Coding Instructor • Grades 1–12
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-gray-600 dark:text-gray-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-brand-600 dark:after:bg-brand-400 hover:after:w-full after:transition-all"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* Codingal Verified Badge Link */}
          <a
            href="https://www.codingal.com/@aishwaryagsr219/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
            title="Verified Codingal Instructor Profile (4.9★)"
          >
            <Award size={13} className="text-amber-600" />
            <span className="hidden lg:inline">Codingal (4.9★)</span>
            <span className="lg:hidden">4.9★</span>
            <ExternalLink size={11} className="text-amber-600 dark:text-amber-400" />
          </a>

          {/* Quick Book Trial Class Button */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, '#contact')}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-sm hover:shadow-glow transform hover:-translate-y-0.5 cursor-pointer"
          >
            <Calendar size={14} />
            <span>Book Trial Class</span>
          </a>

          {/* Publisher Studio Access */}
          {user && user.role === 'publisher' ? (
            <Link
              to="/publisher/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all"
              title="Educator Studio"
            >
              <ShieldCheck size={14} />
              <span className="hidden md:inline">Studio</span>
            </Link>
          ) : (
            <Link
              to="/publisher/login"
              className="inline-flex items-center gap-1.5 p-2 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Educator Login"
            >
              <Lock size={15} />
            </Link>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#0d1117] border-b border-gray-200 dark:border-gray-800 px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-brand-50 dark:hover:bg-brand-950/40 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
              >
                <IconComponent size={16} className="text-brand-600 shrink-0" />
                <span>{link.label}</span>
              </a>
            );
          })}

          <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
            <a
              href="https://www.codingal.com/@aishwaryagsr219/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-center text-xs font-bold shadow-2xs flex items-center justify-center gap-2"
            >
              <Award size={15} className="text-amber-600" />
              <span>Verified Codingal Profile (4.9★ · 1,934+ Classes)</span>
              <ExternalLink size={12} />
            </a>

            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, '#contact')}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-white text-center text-xs font-bold shadow-sm flex items-center justify-center gap-2"
            >
              <Calendar size={14} />
              Book Trial Class / Consultation
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
