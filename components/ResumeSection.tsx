import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ExternalLink, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  CheckCircle2, 
  Briefcase, 
  GraduationCap, 
  Sparkles,
  Layers
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData.js';

export const ResumeSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="resume" className="py-24 bg-white/70 dark:bg-[#0d1117]/70 backdrop-blur-xs border-b border-gray-100/80 dark:border-gray-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100 dark:border-brand-900/40">
              <FileText size={14} /> Curriculum Vitae
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Official Resume Document
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">
              Complete, verified credentials for EdTech leadership, school consulting, and K-12 instruction.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Printer size={15} />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={copyEmail}
              className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-xs font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            >
              {copiedEmail ? 'Copied!' : 'Copy Email'}
            </button>
          </div>
        </div>

        {/* Paper Document Container */}
        <div className="bg-white text-gray-900 p-8 sm:p-12 md:p-16 rounded-3xl border border-gray-300 shadow-xl print:shadow-none print:border-none print:p-0 print:m-0 font-sans">
          
          {/* Header Block with Photo */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-gray-900 pb-8 mb-8">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-950 tracking-tight">
                Aishwarya Gowda S R
              </h1>
              
              <div className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-2 flex-wrap pt-1">
                <span>Mysuru, Karnataka, India 570023</span>
                <span aria-hidden="true">|</span>
                <a href="tel:+918310589119" className="hover:text-brand-600 font-semibold">
                  +91 83105 89119
                </a>
              </div>

              <div className="text-xs sm:text-sm text-gray-600 font-medium flex items-center gap-2 flex-wrap">
                <a href="mailto:aishwaryagowda227@gmail.com" className="hover:text-brand-600 font-semibold">
                  aishwaryagowda227@gmail.com
                </a>
                <span aria-hidden="true">|</span>
                <a 
                  href="https://linkedin.com/in/aishwarya-s-r-2806aa17b" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand-600 font-semibold"
                >
                  linkedin.com/in/aishwarya-s-r-2806aa17b
                </a>
              </div>
            </div>

            {/* Resume Photo */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm shrink-0">
              <img
                src={PERSONAL_INFO.avatar}
                alt="Aishwarya Gowda S R"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Professional Summary */}
          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed text-justify">
              Coding Instructor with over 8 years of online teaching experience, specializing in Scratch, Python, HTML, CSS, JavaScript, and Java for students in Grades 1–12. Skilled in delivering engaging, project-based lessons through virtual classrooms using platforms such as Code.org, MIT App Inventor, Thunkable, EduBlocks, and AI/ML for Kids. Passionate about building computational thinking, creativity, and problem-solving skills through an inclusive, student-centred approach. Strong communicator experienced in parent-teacher engagement, progress tracking, and adapting instruction to diverse learners.
            </p>
          </section>

          {/* Core Competencies */}
          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              CORE COMPETENCIES
            </h2>
            <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
              Online Coding Instruction • STEM Education • Curriculum & Lesson Planning • Student Engagement • Computational Thinking • Project-Based Learning • Classroom Management • Parent Communication • Student Progress Assessment • Educational Technology • Cross-Cultural Communication
            </p>
          </section>

          {/* Technical Skills */}
          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              TECHNICAL SKILLS
            </h2>
            <div className="text-xs sm:text-sm text-gray-800 space-y-1.5 leading-relaxed">
              <div>
                <strong>Programming Languages:</strong> Python, Java, JavaScript, HTML5, CSS3
              </div>
              <div>
                <strong>Coding Platforms & EdTech:</strong> Scratch, Code.org, MIT App Inventor, Thunkable, EduBlocks, AI/ML for Kids, Python Turtle
              </div>
              <div>
                <strong>Development Tools:</strong> Visual Studio Code, Replit
              </div>
              <div>
                <strong>Virtual Teaching Platforms:</strong> Google Classroom, Google Meet, Zoom, Microsoft Teams
              </div>
              <div>
                <strong>Productivity Tools:</strong> Microsoft Office Suite, Google Workspace
              </div>
            </div>
          </section>

          {/* Professional Experience */}
          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-4">
              PROFESSIONAL EXPERIENCE
            </h2>

            {/* Experience Item 1: Codingal */}
            <div className="mb-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div className="text-sm font-bold text-gray-950">
                  Coding Instructor — Codingal
                </div>
                <div className="text-xs font-semibold text-gray-600">
                  Mar 2025 – Present
                </div>
              </div>
              <ul className="list-disc list-outside pl-5 space-y-1.5 text-xs sm:text-sm text-gray-800 leading-relaxed">
                <li>Deliver live online coding classes to students from Grades 1–12, adapting lessons to diverse learning styles and abilities.</li>
                <li>Teach Scratch, Python, HTML, CSS, JavaScript, Java, Code.org, MIT App Inventor, Thunkable, AI/ML for Kids, EduBlocks, and Python Turtle through engaging, project-based learning.</li>
                <li>Design interactive coding projects that strengthen computational thinking, logical reasoning, creativity, and problem-solving skills.</li>
                <li>Develop personalized lesson plans based on individual learning goals and academic progress.</li>
                <li>Conduct Parent-Teacher Meetings (PTMs), providing constructive feedback and actionable learning plans.</li>
                <li>Foster an engaging and inclusive virtual classroom environment, contributing to high student retention and satisfaction.</li>
              </ul>
            </div>

            {/* Experience Item 2: BYJU'S FutureSchool */}
            <div>
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2">
                <div className="text-sm font-bold text-gray-950">
                  Coding Instructor — BYJU'S FutureSchool (WhiteHat Jr)
                </div>
                <div className="text-xs font-semibold text-gray-600">
                  Jul 2021 – Feb 2025
                </div>
              </div>
              <ul className="list-disc list-outside pl-5 space-y-1.5 text-xs sm:text-sm text-gray-800 leading-relaxed">
                <li>Delivered live online coding classes to students across India and international markets.</li>
                <li>Taught Scratch, Python, HTML, CSS, JavaScript, and foundational programming concepts using project-based learning.</li>
                <li>Customized lessons to accommodate different learning styles and skill levels.</li>
                <li>Guided students from beginner to advanced programming through hands-on projects.</li>
                <li>Maintained high student engagement through interactive teaching strategies and continuous progress monitoring.</li>
                <li>Collaborated with parents to discuss student development and recommend learning pathways.</li>
              </ul>
            </div>
          </section>

          {/* Education */}
          <section className="mb-8">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              EDUCATION
            </h2>
            <div className="space-y-3 text-xs sm:text-sm text-gray-800">
              <div>
                <div className="font-bold text-gray-950">
                  Master of Business Administration (MBA) — Supply Chain Management
                </div>
                <div className="text-gray-600">
                  B.N. Bahadur Institute of Management Sciences, Mysuru
                </div>
              </div>

              <div>
                <div className="font-bold text-gray-950">
                  Bachelor of Engineering (B.E.) — Electrical & Electronics Engineering
                </div>
                <div className="text-gray-600">
                  GSSS Institute of Engineering & Technology for Women, Mysuru
                </div>
              </div>
            </div>
          </section>

          {/* Languages */}
          <section>
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1 mb-3">
              LANGUAGES
            </h2>
            <p className="text-xs sm:text-sm text-gray-800">
              English – Professional Working Proficiency &nbsp;•&nbsp; Kannada – Native &nbsp;•&nbsp; Hindi – Conversational
            </p>
          </section>

        </div>

      </div>
    </section>
  );
};
