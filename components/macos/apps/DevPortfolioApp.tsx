'use client';

import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Code2,
  FolderGit2,
  Mail,
  ExternalLink,
  Github,
  Award,
  Terminal,
  Send,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react';
import { playSound } from '../useSound';

export function DevPortfolioApp() {
  const [activeTab, setActiveTab] = useState<'about' | 'projects' | 'skills' | 'resume' | 'contact'>('about');
  const [contactSent, setContactSent] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const projects = [
    {
      title: 'StorageHub Command Center',
      desc: 'Enterprise-grade digital resource launcher with Raycast command palette, SQLite storage, and macOS aesthetic.',
      tech: ['Next.js 16', 'TypeScript', 'Tailwind CSS', 'SQLite', 'DndKit'],
      github: 'https://github.com/StorageHub',
      live: 'https://storagehub.local',
      stars: 428,
    },
    {
      title: 'macOS Web Simulator 1:1',
      desc: 'Hyper-realistic macOS operating system running in the browser with authentic Dock fisheye physics, top menubar, and window management.',
      tech: ['React 18', 'TypeScript', 'CSS Glassmorphism', 'Web Audio API'],
      github: 'https://github.com/puruvj/macos-web',
      live: 'https://macos-web.app',
      stars: 1250,
    },
    {
      title: 'CleanShot X macOS Web Edition',
      desc: 'Complete screenshot and annotation suite with area capture, arrow drawing, highlighter, blur tool, and instant export.',
      tech: ['HTML5 Canvas', 'TypeScript', 'Web API', 'Canvas Filter'],
      github: 'https://github.com/peepingood/cleanshot-x-macos',
      live: '#',
      stars: 310,
    },
    {
      title: 'ClipMind AI macOS',
      desc: 'Smart clipboard history manager and AI copilot providing instant text summarization, grammar refinement, and code explanation.',
      tech: ['AI Copilot', 'Web Speech', 'IndexedDB', 'Tailwind'],
      github: 'https://github.com/peepingood/clipmind-ai-macos',
      live: '#',
      stars: 520,
    },
  ];

  const skillCategories = [
    {
      category: 'Frontend & UI Engineering',
      skills: ['React 18 / 19', 'Next.js 16 App Router', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Canvas API', 'WebGL / Three.js'],
    },
    {
      category: 'Backend & Distributed Systems',
      skills: ['Node.js', 'Go', 'Python', 'SQLite (WAL Mode)', 'PostgreSQL', 'Redis', 'REST & GraphQL', 'WebSockets'],
    },
    {
      category: 'DevOps & Tooling',
      skills: ['Docker & OCI', 'Git & CI/CD', 'Vercel Platform', 'Cloudflare Workers', 'Linux / macOS Kernel', 'Jest / Vitest'],
    },
  ];

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    playSound.tink();
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setName('');
      setEmail('');
      setMessage('');
    }, 4000);
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fb] dark:bg-[#181822] text-[#1d1d1f] dark:text-white select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-white/70 dark:bg-black/40 border-b border-black/5 dark:border-white/10 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            PP
          </div>
          <div>
            <div className="text-xs font-bold tracking-tight">Peter Parker · DevOS Portfolio</div>
            <div className="text-[10px] text-black/50 dark:text-white/50">Full-Stack Architect &amp; macOS Web Engineer</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center bg-black/5 dark:bg-white/10 p-0.5 rounded-xl border border-black/5 dark:border-white/10 text-xs">
          {[
            { id: 'about', label: 'About', icon: User },
            { id: 'projects', label: 'Projects', icon: FolderGit2 },
            { id: 'skills', label: 'Skills', icon: Code2 },
            { id: 'resume', label: 'Resume', icon: FileText },
            { id: 'contact', label: 'Contact', icon: Mail },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  playSound.tink();
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
                  isActive
                    ? 'bg-white dark:bg-white/20 text-blue-600 dark:text-white shadow-xs'
                    : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
        {activeTab === 'about' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Bio Hero */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent border border-black/5 dark:border-white/10 shadow-xs">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg shrink-0">
                🚀
              </div>
              <div>
                <h1 className="text-xl font-bold text-black dark:text-white">Hello, I'm Peter Parker</h1>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mt-0.5">
                  Senior Full-Stack Engineer &amp; Systems Architect
                </p>
                <p className="text-xs text-black/60 dark:text-white/70 mt-2 leading-relaxed">
                  Passionate about crafting ultra-high-fidelity interactive web systems, macOS operating system simulators,
                  distributed data platforms, and elegant developer tools. Specialist in Next.js, React, TypeScript, and high-performance frontend graphics.
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 transition"
                  >
                    <Github className="w-3.5 h-3.5" />
                    <span>GitHub</span>
                  </a>
                  <button
                    onClick={() => setActiveTab('contact')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Get in Touch</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Experience Timeline */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white/50 mb-3">
                Experience Timeline
              </h2>
              <div className="space-y-3">
                {[
                  {
                    role: 'Lead Full-Stack Architect',
                    company: 'StorageHub Labs',
                    period: '2024 — Present',
                    desc: 'Architected enterprise command center, unified macOS web desktop runtime, and resilient SQLite backend storage.',
                  },
                  {
                    role: 'Senior Frontend Engineer',
                    company: 'Acme Digital Systems',
                    period: '2021 — 2024',
                    desc: 'Engineered high-performance web applications, interactive canvas design tooling, and real-time collaboration engines.',
                  },
                ].map((exp, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold text-black dark:text-white">{exp.role}</div>
                      <div className="text-[11px] text-black/40 dark:text-white/40">{exp.period}</div>
                    </div>
                    <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">{exp.company}</div>
                    <p className="text-xs text-black/60 dark:text-white/60 mt-1 leading-relaxed">{exp.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
              Featured Open-Source Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 shadow-xs flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold">{proj.title}</h3>
                      <span className="text-[10px] text-amber-500 font-semibold">★ {proj.stars}</span>
                    </div>
                    <p className="text-xs text-black/60 dark:text-white/70 leading-relaxed mb-4">{proj.desc}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {proj.tech.map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10 text-[10px] font-mono font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-black/5 dark:border-white/10">
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-black/70 dark:text-white/70 hover:text-black dark:hover:text-white transition"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h2 className="text-sm font-bold uppercase tracking-wider text-black/50 dark:text-white/50">
              Technical Competencies
            </h2>
            <div className="space-y-4">
              {skillCategories.map((cat, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                    {cat.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-xl bg-black/5 dark:bg-white/10 text-xs font-medium text-black/80 dark:text-white/90 border border-black/5 dark:border-white/10 hover:border-blue-500/50 transition cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="p-8 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-base font-bold">Curriculum Vitae</h2>
                <p className="text-xs text-black/50 dark:text-white/50">Updated November 2026</p>
              </div>
              <button
                onClick={() => playSound.tink()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="prose dark:prose-invert text-xs space-y-3 leading-relaxed">
              <h3 className="text-sm font-bold">Education</h3>
              <p>M.S. in Computer Science — Stanford University (2019 — 2021)</p>
              <p>B.S. in Software Engineering — University of California, Berkeley (2015 — 2019)</p>

              <h3 className="text-sm font-bold pt-2">Specializations</h3>
              <p>• Native-grade web operating systems &amp; desktop window management physics.</p>
              <p>• Low-latency client-side screenshot and annotation rasterizers.</p>
              <p>• Distributed application architectures with Next.js, Vercel, and embedded SQLite.</p>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-md mx-auto p-6 rounded-2xl bg-white dark:bg-white/[0.03] border border-black/5 dark:border-white/10 space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-base font-bold">Send a Message</h2>
              <p className="text-xs text-black/50 dark:text-white/50">Direct message dispatcher into the DevOS console</p>
            </div>

            {contactSent ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Message Delivered!</div>
                <div className="text-xs text-black/60 dark:text-white/60">
                  Thank you! I will get back to you shortly.
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="Ada Lovelace"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-hidden focus:ring-2 focus:ring-blue-500"
                    placeholder="ada@example.com"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Message</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 outline-hidden focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Hey Peter, would love to collaborate on..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
