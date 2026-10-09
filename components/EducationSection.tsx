import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Languages, 
  MapPin, 
  Award, 
  CheckCircle2 
} from 'lucide-react';
import { EDUCATION_DATA, LANGUAGES_DATA } from '../data/portfolioData.js';

export const EducationSection: React.FC = () => {
  return (
    <section id="education" className="py-24 bg-white/70 dark:bg-[#0d1117]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <GraduationCap size={14} /> Academic Background
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Engineering & Management Foundations
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2">
            Combining rigorous electrical & electronics systems thinking with advanced management strategies.
          </p>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* Education & Language Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Education Degrees */}
          <div className="lg:col-span-8 space-y-6">
            {EDUCATION_DATA.map((edu) => (
              <div
                key={edu.id}
                className="p-6 sm:p-8 rounded-3xl bg-gray-50/70 dark:bg-gray-900/80 border border-gray-200/80 dark:border-gray-800 hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-300 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block mb-1">
                      {edu.period}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                      {edu.degree}
                    </h3>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 mt-1">
                      Specialization: <span className="text-brand-600 dark:text-brand-400">{edu.specialization}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 shrink-0">
                    <MapPin size={12} className="text-brand-600" />
                    <span>Mysuru, India</span>
                  </span>
                </div>

                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <BookOpen size={14} className="text-brand-600" />
                  <span>{edu.institution}</span>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-200/60 dark:border-gray-800/80 pt-3">
                  {edu.description}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: Multilingual Proficiency Card */}
          <div className="lg:col-span-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800/80 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 mb-2">
              <Languages size={18} />
              <h3 className="text-lg font-black text-gray-900 dark:text-white">
                Language Proficiency
              </h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
              Effective multi-lingual communication facilitates smooth connection with students and parents across diverse regions.
            </p>

            <div className="space-y-4">
              {LANGUAGES_DATA.map((lang) => (
                <div key={lang.language} className="p-3.5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-2xs">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-900 dark:text-white mb-1">
                    <span>{lang.language}</span>
                    <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                      {lang.proficiency}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full"
                      style={{ width: lang.level }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200/80 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-gray-700 dark:text-gray-300">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Comfortable conducting classes in English, Kannada, and Hindi.</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
