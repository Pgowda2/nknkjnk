import React from 'react';
import { 
  Briefcase, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  ChevronRight, 
  Award, 
  Sparkles,
  Users,
  Code2,
  ExternalLink
} from 'lucide-react';
import { PROFESSIONAL_EXPERIENCE } from '../data/portfolioData.js';

export const ExperienceSection: React.FC = () => {
  return (
    <section id="experience" className="py-24 bg-surfaceLight/70 dark:bg-[#111620]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-start mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <Briefcase size={14} /> Professional Experience
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Over 8 Years of Online Coding Instruction & EdTech Leadership
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
            Demonstrated track record of delivering high-engagement virtual classrooms for elementary, middle, and high school students across India and global markets.
          </p>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* Experience Timeline */}
        <div className="relative pl-6 sm:pl-10 border-l-2 border-brand-500/30 dark:border-brand-500/20 space-y-12">
          {PROFESSIONAL_EXPERIENCE.map((exp, index) => (
            <div key={exp.id} className="relative group">
              
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1.5 w-6 h-6 rounded-full bg-brand-600 text-white flex items-center justify-center ring-4 ring-white dark:ring-[#111620] shadow-md">
                <Briefcase size={12} />
              </div>

              {/* Card Container */}
              <div className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300">
                
                {/* Header Information */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-800">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
                        {exp.role}
                      </h3>
                      <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-1">
                        <Award size={12} />
                        {exp.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-base font-bold text-brand-600 dark:text-brand-400">
                        {exp.company}
                      </span>
                      <span className="text-gray-400 dark:text-gray-600" aria-hidden="true">·</span>
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                        {exp.type}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400 flex-wrap">
                    <span className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                      <Calendar size={13} className="text-brand-600 dark:text-brand-400" />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} className="text-gray-400" />
                      {exp.location}
                    </span>
                  </div>
                </div>

                {/* Highlight callout */}
                <div className="mb-6 p-3.5 rounded-xl bg-brand-50/60 dark:bg-brand-950/30 border border-brand-100 dark:border-brand-900/40 flex items-center gap-2.5 text-xs font-semibold text-brand-900 dark:text-brand-300">
                  <Sparkles size={15} className="text-brand-600 dark:text-brand-400 shrink-0" />
                  <span>{exp.highlight}</span>
                </div>

                {/* If Codingal, display verified profile stats & direct link */}
                {exp.id === 'codingal' && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                        <Award size={15} className="text-amber-600" />
                        <span>Verified Codingal Instructor Platform Record</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-300 flex-wrap">
                        <span><strong>1,934+</strong> Classes Taught</span>
                        <span>•</span>
                        <span><strong>253+</strong> Unique Learners</span>
                        <span>•</span>
                        <span><strong>4.9★</strong> (1,632+ Ratings)</span>
                        <span>•</span>
                        <span><strong>99.8%</strong> Punctuality</span>
                      </div>
                    </div>
                    <a
                      href="https://www.codingal.com/@aishwaryagsr219/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-2xs transition-all"
                    >
                      <span>View Codingal Profile</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}

                {/* Key Responsibilities */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Key Impact & Responsibilities
                  </h4>
                  <ul className="space-y-2.5">
                    {exp.responsibilities.map((resp, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        <ChevronRight size={16} className="text-brand-600 dark:text-brand-400 shrink-0 mt-0.5" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech Stack & Platforms Taught */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-2 flex items-center gap-1">
                    <Code2 size={13} /> Platforms & Tools:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap text-xs text-gray-600 dark:text-gray-400">
                    {exp.techStack.map((tech, techIdx) => (
                      <span key={tech} className="inline-flex items-center">
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 font-medium text-gray-800 dark:text-gray-200 text-[11px] border border-gray-200 dark:border-gray-700">
                          {tech}
                        </span>
                        {techIdx < exp.techStack.length - 1 && <span className="ml-1 text-gray-300 dark:text-gray-700" aria-hidden="true"> </span>}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
