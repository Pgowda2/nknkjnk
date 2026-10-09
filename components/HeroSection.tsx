import React, { useState, useEffect } from 'react';
import { 
  ArrowDown, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  Blocks,
  Terminal,
  Smartphone,
  ExternalLink,
  Award,
  Star
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.js';

export const HeroSection: React.FC = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % PERSONAL_INFO.subRoles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative pt-28 md:pt-36 pb-20 overflow-hidden bg-gradient-to-b from-brand-50/60 via-white/40 to-transparent dark:from-brand-950/20 dark:via-transparent dark:to-transparent border-b border-gray-100/80 dark:border-gray-800/80">
      {/* Background ambient lighting */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-br from-cyan-400/15 via-brand-500/10 to-indigo-500/5 dark:from-cyan-400/5 dark:via-brand-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-gradient-to-bl from-teal-400/15 to-indigo-500/10 rounded-full blur-[100px] pointer-events-none animate-float" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            
            {/* Live Availability Status & Codingal Badge */}
            <div className="flex items-center gap-2.5 flex-wrap mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold shadow-2xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>{PERSONAL_INFO.availability}</span>
              </div>

              <a
                href="https://www.codingal.com/@aishwaryagsr219/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200/90 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-100 transition-colors shadow-2xs"
                title="View Verified Instructor Profile on Codingal"
              >
                <Award size={13} className="text-amber-600" />
                <span>Codingal Verified (4.9★ · 1,934+ Classes)</span>
                <ExternalLink size={11} className="text-amber-600 dark:text-amber-400" />
              </a>
            </div>

            {/* Main Greeting & Name */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-4">
              Aishwarya <span className="text-brand-600 dark:text-brand-400">Gowda S R</span>
            </h1>

            {/* Animated Sub-role Display */}
            <div className="min-h-12 flex items-center mb-5 flex-wrap">
              <span className="text-lg sm:text-2xl font-medium text-gray-500 dark:text-gray-400 mr-2">Specializing in</span>
              <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white underline decoration-brand-500/70 decoration-2 underline-offset-4 transition-all duration-300">
                {PERSONAL_INFO.subRoles[currentRoleIndex]}
              </span>
            </div>

            {/* Tagline Summary */}
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed mb-8">
              {PERSONAL_INFO.tagline}
            </p>

            {/* Quick Unboxed Metadata Separators */}
            <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-gray-500 dark:text-gray-400 mb-8">
              <span>8+ Years Teaching Experience</span>
              <span aria-hidden="true">·</span>
              <span>Grades 1–12 (Ages 6–18)</span>
              <span aria-hidden="true">·</span>
              <span>Scratch & Python</span>
              <span aria-hidden="true">·</span>
              <span>MIT App Inventor & AI/ML</span>
              <span aria-hidden="true">·</span>
              <span>Mysuru, India</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto mb-10">
              <a
                href="#contact"
                onClick={(e) => scrollToSection(e, 'contact')}
                className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-all duration-200 shadow-md hover:shadow-glow transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <Calendar size={16} />
                Book Trial Class / Consultation
              </a>

              <a
                href="#resume"
                onClick={(e) => scrollToSection(e, 'resume')}
                className="px-6 py-3.5 rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold text-xs border border-gray-200 dark:border-gray-700 transition-all duration-200 shadow-2xs hover:shadow-sm transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <FileText size={16} className="text-brand-600 dark:text-brand-400" />
                View & Print Resume
              </a>

              <a
                href="https://www.codingal.com/@aishwaryagsr219/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 font-bold text-xs border border-orange-200 dark:border-orange-800 transition-all duration-200 shadow-2xs hover:shadow-sm transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
              >
                <Award size={15} className="text-orange-600 dark:text-orange-400" />
                <span>Codingal Profile (4.9★)</span>
                <ExternalLink size={12} />
              </a>

              <a
                href="#curriculum"
                onClick={(e) => scrollToSection(e, 'curriculum')}
                className="px-5 py-3.5 rounded-xl text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-white font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles size={15} />
                Explore Curriculum
              </a>
            </div>

            {/* Direct Contact Bar */}
            <div className="flex items-center gap-6 pt-5 border-t border-gray-200/80 dark:border-gray-800 w-full flex-wrap">
              <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-300">
                <a 
                  href={`mailto:${PERSONAL_INFO.email}`} 
                  className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <Mail size={14} className="text-brand-600" />
                  <span>{PERSONAL_INFO.email}</span>
                </a>
                <span className="hidden sm:inline" aria-hidden="true">·</span>
                <a 
                  href={`tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`} 
                  className="hidden sm:flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <Phone size={14} className="text-brand-600" />
                  <span>{PERSONAL_INFO.phone}</span>
                </a>
              </div>

              <div className="flex items-center gap-2 ml-auto">
                <a
                  href={PERSONAL_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-gray-700 transition-all"
                  title="LinkedIn Profile"
                >
                  <Linkedin size={16} />
                </a>
                <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                  <MapPin size={13} className="text-brand-600" />
                  <span>Mysuru, KA</span>
                </span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Column - Portrait & Credential Highlights */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Outer decorative card */}
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-brand-100 via-white to-gray-50 dark:from-brand-950/40 dark:via-gray-900 dark:to-gray-900 border border-brand-200/60 dark:border-gray-800 shadow-xl overflow-hidden">
                
                {/* Educator Portrait Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-square border border-gray-200/80 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 shadow-inner">
                  <img
                    src={PERSONAL_INFO.avatar}
                    alt="Aishwarya Gowda S R - Senior Coding Instructor"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top hover:scale-102 transition-transform duration-500"
                  />
                  
                  {/* Subtle Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-gray-950/20 to-transparent flex flex-col justify-end p-5 text-white">
                    <span className="text-[11px] uppercase tracking-widest font-bold text-brand-300">
                      STEM Certified Instructor
                    </span>
                    <h2 className="text-lg font-bold">
                      Aishwarya Gowda S R
                    </h2>
                    <a
                      href="https://www.codingal.com/@aishwaryagsr219/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-amber-200 hover:text-white font-medium flex items-center gap-1.5 transition-colors mt-0.5"
                    >
                      <span>Codingal (4.9★ · 1,934+ Classes)</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                {/* Floating Classroom Cards */}
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="bg-white dark:bg-gray-800/90 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-2xs">
                    <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-1">
                      <GraduationCap size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Experience</span>
                    </div>
                    <div className="text-lg font-extrabold text-gray-900 dark:text-white">8+ Years</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">Online Teaching</div>
                  </div>

                  <div className="bg-white dark:bg-gray-800/90 p-3 rounded-xl border border-gray-100 dark:border-gray-700 shadow-2xs">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                      <CheckCircle2 size={16} />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Retention</span>
                    </div>
                    <div className="text-lg font-extrabold text-gray-900 dark:text-white">98%</div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400">Parent Satisfaction</div>
                  </div>
                </div>

              </div>

              {/* Badges around avatar */}
              <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2.5 shadow-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Blocks size={18} />
                </div>
                <div className="text-left pr-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Foundation</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Scratch & Code.org</div>
                </div>
              </div>

              <div className="absolute -top-3 -right-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-2.5 shadow-lg flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                  <Terminal size={18} />
                </div>
                <div className="text-left pr-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Advanced Syntax</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white">Python, Java & Web</div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Scroll Indicator */}
        <div className="mt-14 flex justify-center">
          <a
            href="#about"
            onClick={(e) => scrollToSection(e, 'about')}
            className="flex flex-col items-center gap-2 text-xs font-semibold text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors cursor-pointer group"
          >
            <span className="tracking-widest uppercase text-[10px]">Explore Teaching Profile</span>
            <span className="p-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 group-hover:border-brand-600 group-hover:shadow-sm transition-all duration-300 animate-bounce">
              <ArrowDown size={14} />
            </span>
          </a>
        </div>

      </div>
    </section>
  );
};
