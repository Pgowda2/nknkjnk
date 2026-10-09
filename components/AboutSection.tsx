import React from 'react';
import { 
  GraduationCap, 
  CheckCircle, 
  HeartHandshake, 
  Lightbulb, 
  Target, 
  Users, 
  Cpu, 
  MessageSquare, 
  Sparkles,
  ExternalLink,
  Award,
  Star
} from 'lucide-react';
import { PERSONAL_INFO, CORE_COMPETENCIES } from '../data/portfolioData.js';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white/70 dark:bg-[#0d1117]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
            <GraduationCap size={14} /> Professional Summary
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Nurturing Future Innovators Through Student-Centred Coding
          </h2>
          <div className="w-16 h-1 bg-brand-600 dark:bg-brand-500 rounded-full mt-4" />
        </div>

        {/* Narrative & Pillars Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Narrative Column */}
          <div className="lg:col-span-7 space-y-6 text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            
            <p className="text-gray-900 dark:text-white font-semibold text-lg sm:text-xl leading-snug">
              With over <span className="text-brand-600 dark:text-brand-400">8 years of online teaching experience</span>, I empower students from Grades 1 to 12 to become logical thinkers, creative storytellers, and fluent builders of technology.
            </p>

            <p>
              My instruction bridges early intuitive block coding on <strong>Scratch, Code.org, and EduBlocks</strong>, mobile application engineering with <strong>MIT App Inventor and Thunkable</strong>, cutting-edge <strong>AI/ML for Kids</strong>, and industry-standard text languages including <strong>Python, Java, HTML5, CSS3, and JavaScript</strong>.
            </p>

            <p>
              Rather than passive lectures, every session is built on an inclusive, <strong>project-based methodology</strong>. When children see their code animate a rocket, train an AI image recognizer, or deploy a live smartphone app, abstract concepts instantly transform into tangible pride and computational confidence.
            </p>

            {/* Teaching Pillars */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                Core Teaching Methodology
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5 text-brand-600 dark:text-brand-400 font-bold text-sm mb-1.5">
                    <Target size={16} />
                    <span>Project-Based Mastery</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Learning by building games, apps, and animations rather than memorizing dry syntactic rules.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5 text-indigo-600 dark:text-indigo-400 font-bold text-sm mb-1.5">
                    <Lightbulb size={16} />
                    <span>Computational Thinking</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Decomposing complex problems, spotting patterns, and cultivating stubborn debugging resilience.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5 text-emerald-600 dark:text-emerald-400 font-bold text-sm mb-1.5">
                    <MessageSquare size={16} />
                    <span>Parent Partnership & PTMs</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Transparent feedback, milestone reports, and actionable learning pathways shared directly with families.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-sm mb-1.5">
                    <HeartHandshake size={16} />
                    <span>Adaptive & Inclusive Pace</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    Customized guidance matching each child's learning speed, grade level, and unique personal interests.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Core Competencies Checklist */}
          <div className="lg:col-span-5 bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-800/50 dark:via-gray-900 dark:to-gray-900 p-6 sm:p-8 rounded-3xl border border-gray-200/80 dark:border-gray-800 shadow-sm">
            
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200/80 dark:border-gray-800">
              <div>
                <span className="text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-widest block">
                  Skill Inventory
                </span>
                <h3 className="text-lg font-extrabold text-gray-900 dark:text-white">
                  Core Competencies
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center font-bold">
                <Sparkles size={18} />
              </div>
            </div>

            <div className="space-y-3">
              {CORE_COMPETENCIES.map((comp) => (
                <div 
                  key={comp}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/60 hover:border-brand-300 dark:hover:border-brand-700 transition-colors shadow-2xs"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <CheckCircle size={13} />
                  </div>
                  <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    {comp}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats Callout Box */}
            <div className="mt-6 pt-6 border-t border-gray-200/80 dark:border-gray-800 grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-black text-brand-600 dark:text-brand-400">8+</div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Years Teaching</div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900 dark:text-white">Grades 1–12</div>
                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">K-12 Spectrum</div>
              </div>
            </div>

            {/* Verified Codingal Profile Showcase */}
            <div className="mt-6 p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400 shrink-0 shadow-xs">
                    <img
                      src={PERSONAL_INFO.avatar}
                      alt="Aishwarya Gowda S R"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Aishwarya Gowda S R
                    </span>
                    <span className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold flex items-center gap-1">
                      <span>Codingal Verified Instructor</span>
                      <span>•</span>
                      <span className="text-amber-600 dark:text-amber-400">4.9★</span>
                    </span>
                  </div>
                </div>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full">
                  99.8% On-Time
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 my-3 text-center bg-white/70 dark:bg-gray-900/60 p-2 rounded-xl border border-amber-100 dark:border-amber-900/40">
                <div>
                  <div className="text-xs font-black text-gray-900 dark:text-white">1,934+</div>
                  <div className="text-[9px] font-semibold text-gray-500">Classes</div>
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 dark:text-white">253+</div>
                  <div className="text-[9px] font-semibold text-gray-500">Students</div>
                </div>
                <div>
                  <div className="text-xs font-black text-gray-900 dark:text-white">20+</div>
                  <div className="text-[9px] font-semibold text-gray-500">Countries</div>
                </div>
              </div>

              <a
                href="https://www.codingal.com/@aishwaryagsr219/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>View Full Profile on Codingal</span>
                <ExternalLink size={12} />
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
