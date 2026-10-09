import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Blocks, 
  Terminal, 
  Smartphone, 
  ArrowRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { GRADE_CURRICULA } from '../data/portfolioData.js';

export const CurriculumSection: React.FC = () => {
  const [activeBandIndex, setActiveBandIndex] = useState(0);
  const activeCurriculum = GRADE_CURRICULA[activeBandIndex];

  return (
    <section id="curriculum" className="py-24 bg-surfaceLight/70 dark:bg-[#111620]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <BookOpen size={14} /> K–12 Curriculum Pathways
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Tailored Coding Milestones From Grade 1 Through 12
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
            Every child is developmentally unique. Discover how curriculum progresses naturally from intuitive visual blocks to full-fledged programming syntax.
          </p>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* Grade Band Filter Buttons */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {GRADE_CURRICULA.map((curr, idx) => (
            <button
              key={curr.band}
              onClick={() => setActiveBandIndex(idx)}
              className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap border ${
                activeBandIndex === idx
                  ? 'bg-brand-600 border-brand-600 text-white shadow-md'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{curr.grades}</span>
                <span className={`text-[11px] font-normal ${activeBandIndex === idx ? 'text-brand-100' : 'text-gray-400'}`}>
                  ({curr.ages})
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Curriculum Spotlight Container */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200/80 dark:border-gray-800 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Narrative & Tools */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest mb-1">
                  <span>Target: {activeCurriculum.ages}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activeCurriculum.focus}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  {activeCurriculum.grades}: {activeCurriculum.focus}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-3 leading-relaxed">
                  {activeCurriculum.description}
                </p>
              </div>

              {/* Tools & Platforms Taught */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">
                  Platforms & Technologies Used:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeCurriculum.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold border border-gray-200 dark:border-gray-700"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Sample Capstone Callout */}
              <div className="p-4 rounded-2xl bg-brand-50/70 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/80">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400 block mb-1">
                  Representative Student Capstone
                </span>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {activeCurriculum.sampleProject}
                </p>
              </div>

              {/* Book Trial Link */}
              <div className="pt-2">
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-bold hover:bg-brand-600 dark:hover:bg-brand-400 dark:hover:text-white transition-all shadow-sm"
                >
                  <Calendar size={14} />
                  <span>Inquire for {activeCurriculum.grades} Classes</span>
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Right Milestones Checklist */}
            <div className="lg:col-span-5 bg-gray-50 dark:bg-gray-800/50 p-6 sm:p-8 rounded-2xl border border-gray-200/80 dark:border-gray-700/60">
              <h4 className="text-sm font-extrabold text-gray-900 dark:text-white uppercase tracking-wider mb-5 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-brand-600 dark:text-brand-400" />
                Key Learning Outcomes
              </h4>

              <div className="space-y-4">
                {activeCurriculum.keyMilestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {milestone}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
