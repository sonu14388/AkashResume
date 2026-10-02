import React, { useState, useEffect } from 'react';
import { ActiveView, TemplateId, UserFeedback } from '../types';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  Eye,
  Download,
  Smartphone,
  ShieldCheck,
  Zap,
  Layers,
  ArrowRight,
  ChevronDown,
  HelpCircle,
  Award,
  Star,
  MessageSquareHeart,
  User,
  Quote,
  ThumbsUp
} from 'lucide-react';
import { Footer } from './Footer';
import { getStoredFeedbacks, onFeedbackUpdate } from '../utils/feedbackStore';
import { ThreeDHero } from './three/ThreeDScene';

interface Props {
  setActiveView: (view: ActiveView) => void;
  onSelectTemplate: (templateId: TemplateId) => void;
  onOpenLegal: (tab: 'privacy' | 'terms') => void;
  onOpenDonation?: () => void;
  onOpenFeedback?: () => void;
}

export const HomeView: React.FC<Props> = ({
  setActiveView,
  onSelectTemplate,
  onOpenLegal,
  onOpenDonation,
  onOpenFeedback
}) => {
  const [feedbacks, setFeedbacks] = useState<UserFeedback[]>(() => getStoredFeedbacks());

  useEffect(() => {
    const unsub = onFeedbackUpdate(() => {
      setFeedbacks(getStoredFeedbacks());
    });
    return unsub;
  }, []);

  const templatesList: { id: TemplateId; name: string; tag: string; desc: string; previewColor: string; industry: string }[] = [
    {
      id: 'modern',
      name: 'Silicon Valley Modern Clean',
      tag: 'Most Popular',
      desc: 'Clean two-column layout with contemporary skill badges and sharp hierarchy.',
      previewColor: 'from-blue-600 to-blue-800',
      industry: 'Software & IT'
    },
    {
      id: 'professional',
      name: 'Wall Street Corporate Standard',
      tag: 'Banking & Finance',
      desc: 'Classic formal structure perfect for corporate, finance, and legal careers.',
      previewColor: 'from-slate-700 to-slate-900',
      industry: 'Finance & Banking'
    },
    {
      id: 'minimal',
      name: 'Minimalist (100% ATS Bot Proof)',
      tag: '100% ATS-Friendly',
      desc: 'Pure high-contrast black-and-white layout designed for automated HR bots.',
      previewColor: 'from-zinc-800 to-black',
      industry: 'ATS Guaranteed'
    },
    {
      id: 'tech',
      name: 'Cyber Slate & Cyan Dev',
      tag: 'DevOps & Cloud',
      desc: 'Deep slate banner with vivid sky cyan accents and structured bullet achievements.',
      previewColor: 'from-slate-900 to-cyan-950',
      industry: 'Engineering'
    },
    {
      id: 'creative',
      name: 'Contemporary Design Studio',
      tag: 'UI/UX & Product',
      desc: 'Dynamic colored accent sidebar with contemporary typography and badge chips.',
      previewColor: 'from-purple-600 to-indigo-800',
      industry: 'Design & Media'
    },
    {
      id: 'executive',
      name: 'C-Suite Leadership Boardroom',
      tag: 'Senior Leadership',
      desc: 'Sophisticated typography, leadership summary framing, and strategic matrices.',
      previewColor: 'from-gray-900 to-blue-950',
      industry: 'Executive & CXO'
    }
  ];

  const faqs = [
    {
      q: 'How much does it cost to download a resume?',
      a: 'Building, customizing, choosing from 500+ templates, and exporting high-resolution A4 PDFs are 100% completely FREE. There are no paywalls or hidden charges.'
    },
    {
      q: 'Do I need to create an account or sign in to download?',
      a: 'No! Sign-in is 100% optional. You can build your resume as a guest or sign in with your Google or Facebook account to save multiple resumes and access them from any device.'
    },
    {
      q: 'Are the templates ATS-friendly for corporate job applications?',
      a: 'Absolutely. All our templates follow standard semantic section headers, readable font hierarchy, and structured tables that applicant tracking systems like Workday, Greenhouse, and Lever parse effortlessly.'
    },
    {
      q: 'Can I use this on my mobile phone as well as laptop?',
      a: 'Yes! The application features a dedicated mobile responsive interface with a quick form editor, a sticky action bar, and a zoomable live A4 preview designed specifically for phones and tablets.'
    },
    {
      q: 'Will my progress be saved if I accidentally close the tab?',
      a: 'Yes. The system automatically saves your ongoing draft to local browser storage in real-time. Once logged in with Google or Facebook, your resumes sync seamlessly to your personal dashboard.'
    }
  ];

  return (
    <div className="three-d-view home-3d-view w-full bg-[#f8fafd] dark:bg-[#070b14] transition-colors">
      {/* Hero Section — editorial 3D orange/charcoal direction */}
      <section className="hero-3d-section">
        <div className="hero-3d-frame">
          <div className="hero-3d-pattern hero-3d-pattern--top" />
          <div className="hero-3d-pattern hero-3d-pattern--bottom" />

          <div className="hero-3d-nav">
            <button type="button" onClick={() => setActiveView('home')} className="hero-3d-brand cursor-pointer">
              <span className="hero-3d-brand-mark">CV</span>
              <span>
                <strong>RESUME</strong>
                <em>LAB</em>
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-7 hero-3d-links">
              <button type="button" onClick={() => setActiveView('templates')}>Templates</button>
              <button type="button" onClick={() => setActiveView('builder')}>Builder</button>
              <button type="button" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>How it works</button>
              <span className="hero-3d-search-pill"><span>⌕</span> Search templates</span>
            </div>

            <div className="hero-3d-nav-status">
              <span className="hero-3d-live-dot" />
              <span>Free forever</span>
            </div>
          </div>

          <div className="hero-3d-layout">
            <div className="hero-3d-scene-shell">
              <ThreeDHero />
              <div className="hero-3d-scene-label">
                <span>01</span>
                <span>Creative mode / A4 ready</span>
              </div>
            </div>

            <div className="hero-3d-copy">
              <div className="hero-3d-kicker">
                <Sparkles className="w-4 h-4" />
                <span>WebGL resume studio</span>
              </div>
              <h1>
                BUILD A CV
                <span>THAT STANDS</span>
                <span>OUT.</span>
              </h1>
              <p>
                Turn your experience into a sharp, recruiter-ready story with a live 3D workspace, expressive templates and a clean ATS-safe export.
              </p>

              <div className="hero-3d-actions">
                <button id="hero-create-btn" type="button" onClick={() => setActiveView('builder')} className="hero-3d-primary">
                  <span>Start building</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button id="hero-templates-btn" type="button" onClick={() => setActiveView('templates')} className="hero-3d-secondary">
                  <Layers className="w-4 h-4" />
                  <span>Explore templates</span>
                </button>
              </div>

              <div className="hero-3d-proof-row">
                <span><CheckCircle2 className="w-4 h-4" /> Live preview</span>
                <span><CheckCircle2 className="w-4 h-4" /> PDF + DOCX</span>
                <span><CheckCircle2 className="w-4 h-4" /> No watermark</span>
              </div>
            </div>
          </div>

          <div className="hero-3d-footerline">
            <span>Resume builder / 2026</span>
            <span className="hidden sm:inline">Your next opportunity starts with a strong first page.</span>
            <span className="hero-3d-scroll-hint">Scroll to explore <ChevronDown className="w-4 h-4" /></span>
          </div>
        </div>
      </section>

      {/* Live Builder Mockup Preview Banner */}
      <section id="how-it-works" className="py-12 bg-white dark:bg-slate-900 border-b border-[#dadce0] dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-white">
              Build, Customize & Download in 3 Steps
            </h2>
            <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-2">
              Everything happens right inside your browser with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800 rounded-2xl p-6 relative hover:border-[#1a73e8]/40 dark:hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1a73e8] dark:text-blue-400 font-bold flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-[#202124] dark:text-white">Fill Your Details</h3>
              <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Add your personal contact info, work experiences, skills, education, projects, certifications, and languages with helpful guided fields.
              </p>
            </div>

            <div className="bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800 rounded-2xl p-6 relative hover:border-[#1a73e8]/40 dark:hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1a73e8] dark:text-blue-400 font-bold flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-[#202124] dark:text-white">Pick a Template & Style</h3>
              <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Switch instantly between Modern, Professional, Minimal ATS, Creative, and Executive styles with custom accent colors and typography.
              </p>
            </div>

            <div className="bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800 rounded-2xl p-6 relative hover:border-[#1a73e8]/40 dark:hover:border-blue-500/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-[#1a73e8] dark:text-blue-400 font-bold flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-[#202124] dark:text-white">Instant Free PDF Download</h3>
              <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Download a pixel-perfect standard A4 resume formatted with high resolution (300 DPI), correct margins, and ATS-ready selectable text.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Showcase Grid */}
      <section className="py-16 bg-[#f8fafd] dark:bg-[#070b14] border-b border-[#dadce0] dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a73e8] dark:text-blue-400 uppercase tracking-wider mb-1">
                <Layers className="w-3.5 h-3.5" />
                <span>500+ Designer & ATS Templates</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-white">
                Choose from 500+ Professional Resume Templates
              </h2>
              <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-1">
                Tailored for every industry: Tech, Finance, Healthcare, Creative, Legal, and Freshers.
              </p>
            </div>

            <button
              onClick={() => setActiveView('templates')}
              className="text-sm font-bold text-[#1a73e8] dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer"
            >
              <span>Explore All 500+ Templates</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templatesList.map((tpl) => (
              <div
                key={tpl.id}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dadce0] dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
              >
                {/* Visual Thumbnail Card */}
                <div className={`h-44 bg-gradient-to-br ${tpl.previewColor} p-4 flex flex-col justify-between text-white relative overflow-hidden`}>
                  <div className="flex items-center justify-between z-10">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white">
                      {tpl.tag}
                    </span>
                    <span className="text-xs font-semibold opacity-80 uppercase tracking-widest font-mono">
                      A4 Standard
                    </span>
                  </div>

                  <div className="z-10 bg-white/10 backdrop-blur-sm p-2.5 rounded-lg border border-white/20">
                    <div className="w-1/2 h-2.5 bg-white rounded-sm mb-1.5" />
                    <div className="w-3/4 h-1.5 bg-white/70 rounded-xs mb-1" />
                    <div className="w-2/3 h-1.5 bg-white/60 rounded-xs" />
                  </div>

                  <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-[#202124] dark:text-white">{tpl.name}</h3>
                    <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1 leading-relaxed">{tpl.desc}</p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-slate-400 font-medium">ATS Score: 98%</span>
                    <button
                      onClick={() => onSelectTemplate(tpl.id)}
                      className="px-3.5 py-1.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Use Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-[#dadce0] dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-white">
              Everything You Need in a Modern Resume Tool
            </h2>
            <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-2">
              Designed with simplicity, speed, and real-world hiring standards in mind.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8] dark:text-blue-400 flex items-center justify-center mb-3.5">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#202124] dark:text-white text-base">Instant Live Preview</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Type in the form and watch the resume update in real-time on your screen. No page refresh or waiting required.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-emerald-950/60 text-[#188038] dark:text-emerald-400 flex items-center justify-center mb-3.5">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#202124] dark:text-white text-base">True A4 PDF Downloads</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Download crisp, high-resolution 300 DPI A4 resumes with perfect margins, no blank pages, and clean typography.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3.5">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#202124] dark:text-white text-base">Mobile & Laptop Optimized</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Use a clean 2-column layout on laptop/desktop, and a seamless stacked editor with sticky quick-bar on mobile phones.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3.5">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#202124] dark:text-white text-base">Real-Time Auto-Save</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Never lose your progress. Your edits save automatically while you type in local storage and sync to your account.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-rose-950/60 text-[#ea4335] dark:text-rose-400 flex items-center justify-center mb-3.5">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#202124] dark:text-white text-base">100% Free Forever</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Start creating and exporting resumes without paying any fee. Built for students, professionals, and job seekers everywhere.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-[#202124] dark:text-white text-base">Privacy First</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1.5 leading-relaxed">
                Your data stays strictly yours. We never sell your resume information to third-party recruiters or data brokers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* User Reviews & Feedback Wall Section */}
      <section id="reviews-section" className="py-16 bg-white dark:bg-slate-900 border-b border-[#dadce0] dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>Genuine User Reviews</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-white">
                Feedback from Real Resume Creators
              </h2>
              <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-1">
                Real feedback directly submitted by users who created and downloaded their resume.
              </p>
            </div>

            {onOpenFeedback && (
              <button
                type="button"
                onClick={onOpenFeedback}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-sm transition-all cursor-pointer shrink-0"
              >
                <MessageSquareHeart className="w-4 h-4" />
                <span>Leave a Review</span>
              </button>
            )}
          </div>

          {/* Feedback Cards Grid */}
          {feedbacks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {feedbacks.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-[#f8fafd] dark:bg-slate-950 border border-[#e8eaed] dark:border-slate-800 rounded-2xl p-5 hover:border-amber-400/60 hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Top rating & date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[...Array(fb.rating || 5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#5f6368] dark:text-slate-500 font-medium">{fb.createdAt}</span>
                    </div>

                    {/* Comment */}
                    <p className="text-xs text-[#3c4043] dark:text-slate-300 leading-relaxed italic">
                      "{fb.comment}"
                    </p>

                    {/* Tags */}
                    {fb.tags && fb.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {fb.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-semibold px-2 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Candidate Info */}
                  <div className="mt-4 pt-3 border-t border-gray-200/80 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center">
                        {fb.name ? fb.name[0] : 'U'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#202124] dark:text-white">{fb.name}</h4>
                        <p className="text-[10px] text-[#5f6368] dark:text-slate-400">{fb.role || 'Job Seeker'}</p>
                      </div>
                    </div>
                    {fb.resumeTitle && (
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded font-medium max-w-[110px] truncate">
                        {fb.resumeTitle}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-[#f8fafd] dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 max-w-lg mx-auto">
              <MessageSquareHeart className="w-10 h-10 text-amber-500 mx-auto mb-3 opacity-80" />
              <h3 className="font-bold text-sm text-[#202124] dark:text-white">Be the First to Review!</h3>
              <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Download your free resume in the builder and share your genuine review with our community.
              </p>
              {onOpenFeedback && (
                <button
                  type="button"
                  onClick={onOpenFeedback}
                  className="mt-4 px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Write a Review
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-[#f8fafd] dark:bg-[#070b14] border-b border-[#dadce0] dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] dark:text-white">Frequently Asked Questions</h2>
            <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-1">Everything you need to know about Resume Builder Free.</p>
          </div>

          <div className="space-y-3.5">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-white dark:bg-slate-900 rounded-xl border border-[#dadce0] dark:border-slate-800 p-4.5 open:shadow-xs transition-all"
              >
                <summary className="font-bold text-sm text-[#202124] dark:text-white cursor-pointer flex items-center justify-between list-none">
                  <span>{faq.q}</span>
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-xs text-[#5f6368] dark:text-slate-400 mt-3 leading-relaxed border-t border-gray-100 dark:border-slate-800 pt-2.5">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-white dark:bg-slate-900 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-[#202124] dark:text-white tracking-tight">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-sm text-[#5f6368] dark:text-slate-400 mt-2 max-w-xl mx-auto">
            Join thousands of professionals creating clean, recruiter-approved resumes in minutes.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setActiveView('builder')}
              className="px-8 py-3.5 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-xl font-bold text-base shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Create My Free Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Bottom Footer with Creator Akash Vishwakarma and Contact Info */}
      <Footer
        setActiveView={setActiveView}
        onOpenLegal={onOpenLegal}
        onOpenDonation={onOpenDonation}
        onOpenFeedback={onOpenFeedback}
      />
    </div>
  );
};
