import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Smartphone, 
  Video, 
  Cpu, 
  Sparkles, 
  Layers, 
  BookOpen, 
  CheckCircle2, 
  Laptop, 
  FileText 
} from 'lucide-react';
import { TECHNICAL_SKILLS_CATEGORIES } from '../data/portfolioData.js';

export const SkillsSection: React.FC = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  const categoryIcons = [Code2, Smartphone, Video];

  return (
    <section id="skills" className="py-24 bg-white/70 dark:bg-[#0d1117]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <Cpu size={14} /> Technical Skills & EdTech Stack
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Curated Toolkit for Visual to Syntax Programming
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
            Spanning drag-and-drop block logic, machine learning interfaces, mobile app builders, and production-grade text languages.
          </p>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* Interactive Category Selector Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-gray-100 dark:bg-gray-800 rounded-2xl max-w-2xl mb-10 overflow-x-auto">
          {TECHNICAL_SKILLS_CATEGORIES.map((cat, idx) => {
            const Icon = categoryIcons[idx] || Code2;
            const isSelected = selectedCategoryIndex === idx;
            return (
              <button
                key={cat.title}
                onClick={() => setSelectedCategoryIndex(idx)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isSelected
                    ? 'bg-white dark:bg-gray-900 text-brand-600 dark:text-brand-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon size={15} />
                <span>{cat.title}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Category Skill Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {TECHNICAL_SKILLS_CATEGORIES[selectedCategoryIndex].skills.map((skill) => (
            <div
              key={skill.name}
              className="p-6 rounded-3xl bg-gray-50/70 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 shadow-2xs group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {skill.name}
                  </h3>
                  <span className="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">
                    {skill.level}%
                  </span>
                </div>

                {/* Proficiency progress bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>

                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  {skill.note}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200/60 dark:border-gray-800 flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                <span>Classroom Verified</span>
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 size={12} /> Mastered
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Global Competencies Grid Matrix */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-brand-900 via-brand-800 to-indigo-950 text-white shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-brand-700/60">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-brand-300 block mb-1">
                Pedagogical Expertise
              </span>
              <h3 className="text-2xl font-black">
                Classroom Management & Teaching Competencies
              </h3>
            </div>
            <div className="text-xs font-semibold text-brand-200 max-w-xs">
              Structured to optimize online attention spans and foster independent problem-solving.
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { title: 'Online Coding Instruction', desc: 'Virtual live teaching via Zoom, Meet & Teams' },
              { title: 'STEM Education', desc: 'Integrating Math, Science & Engineering logic' },
              { title: 'Curriculum & Lesson Planning', desc: 'Personalized pacing for Grades 1–12' },
              { title: 'Student Engagement', desc: 'Interactive gamified coding challenges' },
              { title: 'Computational Thinking', desc: 'Decomposition, pattern recognition, abstraction' },
              { title: 'Project-Based Learning', desc: 'End-to-end games, animations and apps' },
              { title: 'Parent Communication', desc: 'Actionable PTMs and progress reports' },
              { title: 'Cross-Cultural Comm.', desc: 'Global learners across India, US, UK, UAE' },
            ].map((item) => (
              <div 
                key={item.title} 
                className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors"
              >
                <div className="text-xs font-bold text-white mb-1">{item.title}</div>
                <div className="text-[11px] text-brand-200 leading-snug">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
