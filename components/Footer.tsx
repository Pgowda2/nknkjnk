import React from 'react';
import { Code2, ArrowUp, Mail, Phone, MapPin, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PERSONAL_INFO } from '../data/portfolioData.js';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surfaceLight/80 dark:bg-[#090d12]/80 backdrop-blur-xs border-t border-gray-200/80 dark:border-gray-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-gray-200 dark:border-gray-800">
          
          {/* Educator Info */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-bold">
                <Code2 size={16} />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                {PERSONAL_INFO.name}
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-sm">
              Senior Coding Instructor & STEM Educator with 8+ years of online teaching experience for Grades 1–12. Inspiring the next generation of engineers, creators, and problem solvers.
            </p>
            <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-2 pt-1">
              <span>Mysuru, Karnataka, India</span>
              <span aria-hidden="true">·</span>
              <a href={`mailto:${PERSONAL_INFO.email}`} className="hover:text-brand-600">
                {PERSONAL_INFO.email}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Navigation
            </h4>
            <div className="flex flex-col space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <a href="#about" className="hover:text-brand-600 dark:hover:text-white transition-colors">About & Summary</a>
              <a href="#experience" className="hover:text-brand-600 dark:hover:text-white transition-colors">Teaching Experience</a>
              <a href="#skills" className="hover:text-brand-600 dark:hover:text-white transition-colors">Technical Skills & EdTech</a>
              <a href="#curriculum" className="hover:text-brand-600 dark:hover:text-white transition-colors">Grades 1–12 Curricula</a>
              <a href="#playground" className="hover:text-brand-600 dark:hover:text-white transition-colors">Interactive Code Lab</a>
              <a href="#resume" className="hover:text-brand-600 dark:hover:text-white transition-colors">Official Printable Resume</a>
              <a 
                href="https://www.codingal.com/@aishwaryagsr219/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline flex items-center gap-1 pt-1"
              >
                <span>Verified Codingal Profile (4.9★)</span>
                <span>↗</span>
              </a>
            </div>
          </div>

          {/* Connect & Book */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-gray-200 mb-3">
              Get in Touch
            </h4>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div>Phone: {PERSONAL_INFO.phone}</div>
              <div>Classes: 1-on-1 & Small Batches</div>
              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-600 text-white text-xs font-bold shadow-xs hover:bg-brand-700 transition-colors"
                >
                  Book Demo Session
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-3">
            <p>© {new Date().getFullYear()} Aishwarya Gowda S R. All rights reserved.</p>
            <span>•</span>
            <Link
              to="/publisher/login"
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
            >
              Educator Studio
            </Link>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 font-bold transition-colors cursor-pointer"
          >
            Back to Top <ArrowUp size={14} />
          </button>
        </div>

      </div>
    </footer>
  );
};
