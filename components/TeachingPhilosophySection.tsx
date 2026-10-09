import React from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  Cpu, 
  Target, 
  Award, 
  HeartHandshake, 
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import { TEACHING_PHILOSOPHY } from '../data/portfolioData.js';

export const TeachingPhilosophySection: React.FC = () => {
  return (
    <section id="philosophy" className="py-24 bg-surfaceLight/70 dark:bg-[#111620]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <Lightbulb size={14} /> Teaching Philosophy
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            The 5-Pillar Student-Centred Methodology
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
            Engineered to keep virtual learners engaged, self-directed, and confident through interactive milestones and continuous parent alignment.
          </p>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* 5 Pillars Timeline Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {TEACHING_PHILOSOPHY.map((pillar) => (
            <div
              key={pillar.step}
              className="p-6 rounded-3xl bg-white dark:bg-gray-900 border border-gray-200/80 dark:border-gray-800 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <span className="text-2xl font-black text-brand-600 dark:text-brand-400 block mb-3 font-mono">
                  {pillar.step}
                </span>
                <h3 className="text-base font-extrabold text-gray-900 dark:text-white mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 dark:border-gray-800 text-[11px] font-semibold text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-500" />
                <span>Classroom Proven</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
