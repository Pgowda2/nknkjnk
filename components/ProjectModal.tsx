import React from 'react';
import { ProjectItem } from '../types';
import { X, ExternalLink, Github, CheckCircle2, ShieldAlert, Cpu, Sparkles, Layers } from 'lucide-react';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-y-auto bg-gray-900/70 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Click backdrop to close */}
      <div className="fixed inset-0 -z-10" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-surfaceLight shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-brand-50 text-brand-600 rounded-full text-xs font-bold uppercase tracking-wider">
              {project.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">ID: {project.id}</span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-200/70 rounded-full transition-colors cursor-pointer"
            aria-label="Close Project Details"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body Scroll Container */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-gray-700">
          
          {/* Hero Banner Image & Title */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-3">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
                {project.title}
              </h2>
              <p className="text-sm sm:text-base font-semibold text-brand-600">
                {project.subtitle}
              </p>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed italic">
                "{project.tagline}"
              </p>

              {/* Quick Action Links */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all shadow-sm"
                >
                  <Github size={16} />
                  View Source Code
                </a>
                {project.liveDemoUrl && (
                  <a
                    href={project.liveDemoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-full transition-all shadow-sm"
                  >
                    <ExternalLink size={16} />
                    Live Preview
                  </a>
                )}
              </div>
            </div>

            <div className="md:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-md">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 sm:h-56 object-cover hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

          {/* Key Metrics Badges */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-subtleBg p-4 rounded-2xl border border-gray-200/80">
                  <span className="text-xs text-gray-500 font-medium block">{metric.label}</span>
                  <span className="text-xl font-extrabold text-brand-600 font-mono">{metric.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Detailed Overview */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Layers size={18} className="text-brand-600" /> System Overview
            </h3>
            <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
              {project.fullOverview}
            </p>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-600" /> Key Engineering Features
            </h3>
            <ul className="grid grid-cols-1 gap-2.5">
              {project.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Challenges & Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="bg-rose-50/60 p-5 rounded-2xl border border-rose-100 space-y-2">
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert size={16} /> Engineering Challenge
              </h4>
              <p className="text-xs text-rose-900 leading-relaxed">
                {project.challenges}
              </p>
            </div>

            <div className="bg-emerald-50/60 p-5 rounded-2xl border border-emerald-100 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={16} /> Solution Implemented
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {project.solution}
              </p>
            </div>
          </div>

          {/* Architecture Notes */}
          {project.architectureNotes && (
            <div className="bg-subtleBg p-4 rounded-2xl border border-gray-200 font-mono text-xs text-gray-800 flex flex-col gap-1">
              <span className="text-[10px] text-gray-400 font-sans uppercase font-bold tracking-wider">Data Pipeline Architecture</span>
              <code>{project.architectureNotes}</code>
            </div>
          )}

          {/* Tech Stack Tags */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Technologies Used</h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-surfaceLight flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-full transition-all"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
