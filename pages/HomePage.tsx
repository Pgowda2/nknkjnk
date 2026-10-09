import React from 'react';
import { Navbar } from '../components/Navbar.js';
import { HeroSection } from '../components/HeroSection.js';
import { AboutSection } from '../components/AboutSection.js';
import { ExperienceSection } from '../components/ExperienceSection.js';
import { SkillsSection } from '../components/SkillsSection.js';
import { CurriculumSection } from '../components/CurriculumSection.js';
import { InteractiveCodePlayground } from '../components/InteractiveCodePlayground.js';
import { EducationSection } from '../components/EducationSection.js';
import { TeachingPhilosophySection } from '../components/TeachingPhilosophySection.js';
import { ResumeSection } from '../components/ResumeSection.js';
import { ContactSection } from '../components/ContactSection.js';
import { Footer } from '../components/Footer.js';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fafcff] dark:bg-[#0a0e17] text-gray-900 dark:text-gray-100 flex flex-col font-sans transition-colors duration-200 relative overflow-x-hidden selection:bg-brand-500 selection:text-white">
      {/* Dynamic Refreshing Ambient Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        {/* Fresh micro-dot grid layer */}
        <div className="absolute inset-0 bg-dot-pattern dark:bg-dot-pattern-dark opacity-35 dark:opacity-20" />

        {/* Ambient luminous glow orbs that give depth and freshness */}
        {/* Top-Left: Cool Cyan / Sky Blue aura */}
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-gradient-to-br from-cyan-400/18 via-sky-500/12 to-transparent rounded-full blur-[130px] animate-pulse-subtle" />

        {/* Top-Right: Fresh Mint / Emerald accent aura */}
        <div className="absolute top-[8%] -right-40 w-[620px] h-[620px] bg-gradient-to-bl from-teal-400/15 via-emerald-400/10 to-transparent rounded-full blur-[140px] animate-float" />

        {/* Mid-Left: Soft Royal Indigo glow */}
        <div className="absolute top-[38%] -left-36 w-[650px] h-[650px] bg-gradient-to-tr from-brand-500/12 via-indigo-500/10 to-transparent rounded-full blur-[150px] animate-float-reverse" />

        {/* Mid-Right: Lavender / Violet glow */}
        <div className="absolute top-[62%] -right-32 w-[600px] h-[600px] bg-gradient-to-tl from-violet-500/12 via-purple-400/8 to-transparent rounded-full blur-[140px] animate-pulse-subtle" />

        {/* Bottom: Crisp Ocean Azure aura */}
        <div className="absolute bottom-10 left-[20%] w-[700px] h-[700px] bg-gradient-to-t from-sky-400/14 via-blue-600/8 to-transparent rounded-full blur-[160px] animate-aurora" />
      </div>

      {/* Global Navigation */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">
        <HeroSection />
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <CurriculumSection />
        <InteractiveCodePlayground />
        <EducationSection />
        <TeachingPhilosophySection />
        <ResumeSection />
        <ContactSection />
      </main>

      {/* Global Footer */}
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};
