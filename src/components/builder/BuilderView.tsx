import React, { useState, useRef, useEffect } from 'react';
import {
  ResumeDocument,
  ResumeData,
  ResumeStyle,
  TemplateId,
  UserAccount
} from '../../types';
import { sampleProfiles, emptyResumeData } from '../../data/defaultResume';
import { ResumeTemplateRenderer } from '../templates/ResumeTemplateRenderer';
import { PersonalInfoForm } from './PersonalInfoForm';
import { WorkExperienceForm } from './WorkExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { LanguagesForm } from './LanguagesForm';
import { AdditionalSectionsForm } from './AdditionalSectionsForm';
import { exportResumeToPDF } from '../../utils/pdfExport';
import { exportResumeToDocx } from '../../utils/docxExport';
import { DonationModal } from '../DonationModal';
import { FeedbackModal } from '../FeedbackModal';
import { allTemplates } from '../../data/templatesData';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  FolderGit2,
  Award,
  Languages as LangIcon,
  Bookmark,
  Download,
  FileDown,
  Eye,
  Layers,
  Palette,
  Type,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
  Heart,
  Search,
  CheckCircle2
} from 'lucide-react';

interface Props {
  document: ResumeDocument;
  onChangeDocument: (doc: ResumeDocument) => void;
  user: UserAccount | null;
  onOpenAuth: (mode?: 'login' | 'signup', reason?: string) => void;
  saveStatus: 'saved' | 'saving';
  onOpenFeedback?: () => void;
}

type FormSectionId =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'additional';

export const BuilderView: React.FC<Props> = ({
  document: resumeDoc,
  onChangeDocument,
  user,
  onOpenAuth,
  saveStatus,
  onOpenFeedback
}) => {
  const [activeSection, setActiveSection] = useState<FormSectionId>('personal');
  const [zoomScale, setZoomScale] = useState<number>(0.78);
  const [isAutoFit, setIsAutoFit] = useState<boolean>(true);
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isExportingDocx, setIsExportingDocx] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [showDonationModal, setShowDonationModal] = useState<boolean>(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState<boolean>(false);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [docxSuccess, setDocxSuccess] = useState<boolean>(false);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview' | 'templates' | 'style'>('form');

  const { data, style } = resumeDoc;

  // Auto-fit A4 preview sheet into available viewport width without cutoff
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const calculateFit = () => {
      if (previewContainerRef.current && isAutoFit) {
        const availableWidth = previewContainerRef.current.clientWidth - 28;
        if (availableWidth > 80) {
          const fit = Math.min(1.0, Math.max(0.40, availableWidth / 794));
          setZoomScale(Number(fit.toFixed(2)));
        }
      }
    };

    calculateFit();
    const observer = new ResizeObserver(calculateFit);
    observer.observe(previewContainerRef.current);
    return () => observer.disconnect();
  }, [isAutoFit, mobileTab]);

  const handleUpdateData = (patch: Partial<ResumeData>) => {
    // If photo is uploaded, make sure showPhoto is true
    let updatedStyle = style;
    if (patch.personalInfo?.photoUrl && !style.showPhoto) {
      updatedStyle = { ...style, showPhoto: true };
    }

    onChangeDocument({
      ...resumeDoc,
      data: {
        ...data,
        ...patch
      },
      style: updatedStyle,
      updatedAt: new Date().toISOString()
    });
  };

  const handleUpdateStyle = (patch: Partial<ResumeStyle>) => {
    onChangeDocument({
      ...resumeDoc,
      style: {
        ...style,
        ...patch
      },
      updatedAt: new Date().toISOString()
    });
  };

  const handleLoadSample = (profileKey: keyof typeof sampleProfiles) => {
    const profile = sampleProfiles[profileKey];
    if (profile) {
      onChangeDocument({
        ...resumeDoc,
        title: `${profile.data.personalInfo.fullName} - ${profile.data.personalInfo.title}`,
        data: profile.data,
        style: profile.style,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all entered resume data?')) {
      onChangeDocument({
        ...resumeDoc,
        title: 'Untitled Resume',
        data: emptyResumeData,
        updatedAt: new Date().toISOString()
      });
    }
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    setDownloadSuccess(false);
    const fileName = `${data.personalInfo.fullName || 'Resume'}_CV.pdf`.replace(/\s+/g, '_');

    try {
      const success = await exportResumeToPDF({
        fileName,
        elementId: 'resume-printable-area',
        onProgress: (stage) => setExportProgress(stage)
      });

      if (success) {
        setDownloadSuccess(true);
        // Prompt for genuine feedback after download
        setTimeout(() => {
          setShowFeedbackModal(true);
        }, 1500);
      }
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
  };

  const handleDownloadDocx = async () => {
    setIsExportingDocx(true);
    setDocxSuccess(false);
    const fileName = `${data.personalInfo.fullName || 'Resume'}_CV.docx`.replace(/\s+/g, '_');

    try {
      const success = await exportResumeToDocx({
        fileName,
        data,
        style
      });

      if (success) {
        setDocxSuccess(true);
        setTimeout(() => {
          setDocxSuccess(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Word Docx export error:', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  const colors = [
    { name: 'Google Blue', hex: '#2563eb' },
    { name: 'Indigo Deep', hex: '#4f46e5' },
    { name: 'Sky Cyan', hex: '#0284c7' },
    { name: 'Teal Matrix', hex: '#0d9488' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Luxury Gold', hex: '#ca8a04' },
    { name: 'Royal Violet', hex: '#7c3aed' },
    { name: 'Rose Quartz', hex: '#e11d48' },
    { name: 'Crimson Ruby', hex: '#dc2626' },
    { name: 'Corporate Slate', hex: '#1e293b' },
    { name: 'Deep Tech Navy', hex: '#0f172a' },
    { name: 'High-Contrast Noir', hex: '#172033' }
  ];

  const [templateFilter, setTemplateFilter] = useState<string>('All');
  const [templateSearchQuery, setTemplateSearchQuery] = useState<string>('');

  const filteredBuilderTemplates = allTemplates.filter((tpl) => {
    const matchesCat =
      templateFilter === 'All' ||
      (templateFilter === 'Professional' && tpl.styleType === 'professional') ||
      (templateFilter === 'Creative' && tpl.styleType === 'creative') ||
      (templateFilter === 'ATS' && tpl.category === 'ats') ||
      (templateFilter === 'Tech' && tpl.category === 'tech') ||
      (templateFilter === 'Finance' && tpl.category === 'finance') ||
      (templateFilter === 'Executive' && tpl.category === 'executive') ||
      (templateFilter === 'Healthcare' && tpl.category === 'healthcare') ||
      (templateFilter === 'Marketing' && tpl.category === 'marketing') ||
      (templateFilter === 'Modern' && tpl.category === 'modern');

    if (!matchesCat) return false;
    if (!templateSearchQuery.trim()) return true;

    const q = templateSearchQuery.toLowerCase();
    return (
      tpl.name.toLowerCase().includes(q) ||
      tpl.industry.toLowerCase().includes(q) ||
      tpl.recommendedFor.toLowerCase().includes(q)
    );
  });

  const handleRandomDesign = () => {
    const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const allFontOptions: ResumeStyle['fontFamily'][] = [
      'jakarta', 'poppins', 'outfit', 'dmsans', 'montserrat', 'raleway', 'space',
      'sans', 'roboto', 'oswald', 'playfair', 'merriweather', 'lora', 'cinzel',
      'crimson', 'editorial', 'serif', 'jetbrains', 'fira', 'mono'
    ];
    const randomFont = allFontOptions[Math.floor(Math.random() * allFontOptions.length)];

    handleUpdateStyle({
      templateId: randomTemplate.id,
      primaryColor: randomTemplate.color || randomColor.hex,
      fontFamily: randomTemplate.fontFamily || randomFont
    });
  };

  const sectionsList: { id: FormSectionId; label: string; icon: any; count?: number }[] = [
    { id: 'personal', label: 'Personal Information', icon: User },
    { id: 'summary', label: 'Professional Summary', icon: FileText },
    { id: 'experience', label: 'Work Experience', icon: Briefcase, count: data.workExperience.length },
    { id: 'education', label: 'Education', icon: GraduationCap, count: data.education.length },
    { id: 'skills', label: 'Skills', icon: Sparkles, count: data.skills.length },
    { id: 'projects', label: 'Key Projects', icon: FolderGit2, count: data.projects.length },
    { id: 'certifications', label: 'Certifications', icon: Award, count: data.certifications.length },
    { id: 'languages', label: 'Languages', icon: LangIcon, count: data.languages.length },
    { id: 'additional', label: 'Additional Sections', icon: Bookmark, count: data.additionalSections.length }
  ];

  return (
    <div className="three-d-view w-full bg-[#f8fafd] dark:bg-[#070b14] min-h-[calc(100vh-60px)] pb-16 md:pb-6 transition-colors">
      {/* Top Builder Control Subheader */}
      <div className="bg-white dark:bg-[#090d16] border-b border-[#dadce0] dark:border-slate-800 px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Sample Loader & Clearer */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#5f6368] dark:text-slate-400 hidden sm:inline">
              Sample Data:
            </span>
            <button
              onClick={() => handleLoadSample('software')}
              className="px-2.5 py-1 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-[#dadce0] dark:border-slate-700 transition-colors"
            >
              Software Dev
            </button>
            <button
              onClick={() => handleLoadSample('marketing')}
              className="px-2.5 py-1 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-[#dadce0] dark:border-slate-700 transition-colors"
            >
              Marketing
            </button>
            <button
              onClick={() => handleLoadSample('executive')}
              className="px-2.5 py-1 bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-700 dark:text-slate-200 rounded-lg text-xs font-medium border border-[#dadce0] dark:border-slate-700 transition-colors"
            >
              Executive
            </button>
            <button
              onClick={handleClearAll}
              className="px-2 py-1 text-gray-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg text-xs transition-colors cursor-pointer"
              title="Clear all fields"
            >
              Clear
            </button>
          </div>

          {/* Quick Actions (Right) */}
          <div className="flex items-center gap-2">
            {/* Support / Tip Creator Button */}
            <button
              id="builder-support-btn"
              type="button"
              onClick={() => setShowDonationModal(true)}
              className="px-3 py-2 bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              title="Support Akash Vishwakarma (Creator) via UPI"
            >
              <Heart className="w-3.5 h-3.5 fill-white animate-pulse" />
              <span className="hidden sm:inline">Support Creator</span>
            </button>

            {/* Word Document (.docx) Export Button (100% Free) */}
            <button
              id="builder-download-docx-btn"
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
              title="Export editable Microsoft Word document (.docx)"
            >
              {isExportingDocx ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Exporting Docx...</span>
                </>
              ) : docxSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Word Ready!</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4" />
                  <span>Word (.docx)</span>
                  <span className="bg-white/25 text-white text-[10px] font-black px-1 py-0.2 rounded uppercase">
                    Free
                  </span>
                </>
              )}
            </button>

            {/* Primary Download PDF Button (100% Free) */}
            <button
              id="builder-download-pdf-btn"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-75"
              title="Download high-resolution A4 printable PDF"
            >
              {isExporting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{exportProgress || 'Exporting PDF...'}</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                  <span className="bg-white/25 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
                    Free
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Column Work Area */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ============================================================ */}
          {/* LEFT COLUMN: RESUME FORM ACCORDION & INPUTS */}
          {/* ============================================================ */}
          <div className={`lg:col-span-6 space-y-3.5 ${mobileTab !== 'form' ? 'hidden lg:block' : 'block'}`}>
            {/* Section Accordion Cards */}
            {sectionsList.map((sec) => {
              const Icon = sec.icon;
              const isOpen = activeSection === sec.id;

              return (
                <div
                  key={sec.id}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'border-[#1a73e8] dark:border-blue-500 shadow-sm'
                      : 'border-[#dadce0] dark:border-slate-800 hover:border-gray-400 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    id={`section-btn-${sec.id}`}
                    type="button"
                    onClick={() => setActiveSection(isOpen ? ('' as any) : sec.id)}
                    className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left focus:outline-none cursor-pointer bg-white dark:bg-slate-900"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                          isOpen
                            ? 'bg-[#e8f0fe] dark:bg-blue-950/60 text-[#1a73e8] dark:text-blue-400'
                            : 'bg-gray-100 dark:bg-slate-800 text-[#5f6368] dark:text-slate-400'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm text-[#202124] dark:text-white">{sec.label}</span>
                        {sec.count !== undefined && (
                          <span className="ml-2 text-[11px] font-semibold text-[#5f6368] dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
                            {sec.count}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-gray-400 dark:text-slate-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-gray-100 dark:border-slate-800/80 animate-in fade-in duration-100">
                      {sec.id === 'personal' && (
                        <PersonalInfoForm
                          data={data.personalInfo}
                          onChange={(personalInfo) => handleUpdateData({ personalInfo })}
                        />
                      )}

                      {sec.id === 'summary' && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="block text-xs font-semibold text-[#202124] dark:text-slate-200">
                              Professional Summary / Objective
                            </label>
                            <span className="text-[11px] text-[#5f6368] dark:text-slate-400">
                              {data.summary.length} characters
                            </span>
                          </div>

                          <textarea
                            rows={4}
                            value={data.summary}
                            onChange={(e) => handleUpdateData({ summary: e.target.value })}
                            placeholder="Motivated and detail-oriented professional with experience in..."
                            className="w-full p-3 text-xs bg-white dark:bg-slate-950 border border-[#dadce0] dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-blue-100 leading-relaxed"
                          />

                          {/* Pre-written Summary Suggestions */}
                          <div className="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50">
                            <p className="text-[11px] font-bold text-[#1a73e8] dark:text-blue-400 flex items-center gap-1 mb-1.5">
                              <Sparkles className="w-3 h-3" /> Quick Summary Starters:
                            </p>
                            <div className="space-y-1.5 text-[11px] text-gray-700 dark:text-slate-300">
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateData({
                                    summary:
                                      'Motivated and detail-oriented professional with 5+ years of experience leading cross-functional teams, driving operational efficiencies, and delivering high-impact business outcomes.'
                                  })
                                }
                                className="block text-left hover:text-[#1a73e8] dark:hover:text-blue-400 hover:underline cursor-pointer"
                              >
                                • "Motivated and detail-oriented professional with 5+ years of experience..."
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateData({
                                    summary:
                                      'Results-driven software engineer experienced in full-stack architecture, microservices, and modern cloud technologies. Proven track record of improving system throughput and mentoring agile teams.'
                                  })
                                }
                                className="block text-left hover:text-[#1a73e8] dark:hover:text-blue-400 hover:underline cursor-pointer"
                              >
                                • "Results-driven software engineer experienced in full-stack architecture..."
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {sec.id === 'experience' && (
                        <WorkExperienceForm
                          experiences={data.workExperience}
                          onChange={(workExperience) => handleUpdateData({ workExperience })}
                        />
                      )}

                      {sec.id === 'education' && (
                        <EducationForm
                          educationList={data.education}
                          onChange={(education) => handleUpdateData({ education })}
                        />
                      )}

                      {sec.id === 'skills' && (
                        <SkillsForm
                          skills={data.skills}
                          onChange={(skills) => handleUpdateData({ skills })}
                        />
                      )}

                      {sec.id === 'projects' && (
                        <ProjectsForm
                          projects={data.projects}
                          onChange={(projects) => handleUpdateData({ projects })}
                        />
                      )}

                      {sec.id === 'certifications' && (
                        <CertificationsForm
                          certifications={data.certifications}
                          onChange={(certifications) => handleUpdateData({ certifications })}
                        />
                      )}

                      {sec.id === 'languages' && (
                        <LanguagesForm
                          languages={data.languages}
                          onChange={(languages) => handleUpdateData({ languages })}
                        />
                      )}

                      {sec.id === 'additional' && (
                        <AdditionalSectionsForm
                          sections={data.additionalSections}
                          onChange={(additionalSections) => handleUpdateData({ additionalSections })}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Creator Credit & Contact Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-4 border border-slate-700 shadow-md">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-sm shadow-sm">
                    AV
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] uppercase tracking-wider text-blue-400 font-bold">Created by</span>
                      <Heart className="w-3 h-3 text-red-400 fill-red-400 inline" />
                    </div>
                    <p className="font-bold text-sm text-white">Akash Vishwakarma</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => setShowDonationModal(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                    title="Support via UPI"
                  >
                    <Heart className="w-3.5 h-3.5 fill-white" />
                    <span>Support / UPI</span>
                  </button>

                  <a
                    href="mailto:sonuakash11121@gmail.com"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-400/30 text-xs font-semibold transition-all shadow-xs"
                    title="Contact creator via email"
                  >
                    <span>sonuakash11121@gmail.com</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* RIGHT COLUMN: LIVE RESUME PREVIEW & CUSTOMIZER */}
          {/* ============================================================ */}
          <div
            className={`lg:col-span-6 space-y-4 ${
              mobileTab === 'form' ? 'hidden lg:block' : 'block'
            }`}
          >
            {/* Top Toolbar: Template Selector, Color, Typography, Zoom */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-[#dadce0] dark:border-slate-800 p-4 shadow-xs space-y-3.5">
              {/* Template Switcher with Categories & Random Button */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#202124] dark:text-white flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#1a73e8] dark:text-blue-400" />
                      <span>Resume Templates ({allTemplates.length}+)</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full font-bold">
                      100% Free
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRandomDesign}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#1a73e8] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                    title="Generate a random color & design pairing"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Random Pair</span>
                  </button>
                </div>

                {/* Quick Search & Category Bar */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-2">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={templateSearchQuery}
                      onChange={(e) => setTemplateSearchQuery(e.target.value)}
                      placeholder="Search 500+ designs (e.g., Tech, Doctor, CA)..."
                      className="w-full pl-8 pr-2.5 py-1 text-xs bg-gray-50 dark:bg-slate-950 border border-[#dadce0] dark:border-slate-800 rounded-lg text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Category & Style Filter Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                    {['All', 'Professional', 'Creative', 'ATS', 'Tech', 'Finance', 'Executive', 'Healthcare', 'Marketing', 'Modern'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTemplateFilter(cat)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors shrink-0 cursor-pointer ${
                          templateFilter === cat
                            ? 'bg-[#1a73e8] text-white shadow-xs'
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat === 'Professional' ? '👔 Pro' : cat === 'Creative' ? '🎨 Creative' : cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Template Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5 max-h-[150px] overflow-y-auto pr-0.5">
                  {filteredBuilderTemplates.slice(0, 40).map((tpl) => {
                    const isSelected = style.templateId === tpl.id;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          handleUpdateStyle({
                            templateId: tpl.id,
                            primaryColor: tpl.color || style.primaryColor,
                            fontFamily: tpl.fontFamily || style.fontFamily
                          });
                        }}
                        className={`p-2 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-blue-50 dark:bg-blue-950/60 border-[#1a73e8] dark:border-blue-500 text-[#1a73e8] dark:text-blue-400 font-bold shadow-xs ring-1 ring-blue-300'
                            : 'bg-white dark:bg-slate-950 border-[#dadce0] dark:border-slate-800 text-[#5f6368] dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 w-full">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: tpl.color }}
                          />
                          <span className="text-[8.5px] opacity-75 font-semibold uppercase truncate">
                            {tpl.tag}
                          </span>
                        </div>
                        <p className="text-[11px] font-bold truncate mt-1 text-slate-800 dark:text-white">{tpl.name}</p>
                      </button>
                    );
                  })}
                </div>
                {filteredBuilderTemplates.length > 40 && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 text-right mt-1">
                    Showing top 40 of {filteredBuilderTemplates.length} matching templates
                  </p>
                )}
              </div>

              {/* Color & Typography Customizer Row */}
              <div className="pt-2 border-t border-gray-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                {/* Accent Color Palette */}
                <div className="flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                  <div className="flex items-center gap-1">
                    {colors.map((c) => (
                      <button
                        key={c.hex}
                        onClick={() => handleUpdateStyle({ primaryColor: c.hex })}
                        title={c.name}
                        className={`w-5 h-5 rounded-full transition-transform ${
                          style.primaryColor === c.hex
                            ? 'scale-125 ring-2 ring-blue-400 ring-offset-1'
                            : 'hover:scale-110 opacity-90'
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Selector */}
                <div className="flex items-center gap-1.5 text-xs">
                  <Type className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500 shrink-0" />
                  <select
                    id="builder-font-family-select"
                    value={style.fontFamily}
                    onChange={(e) => handleUpdateStyle({ fontFamily: e.target.value as any })}
                    className="px-2 py-1 bg-white dark:bg-slate-800 border border-[#dadce0] dark:border-slate-700 rounded-lg text-xs font-medium text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                  >
                    <optgroup label="Modern Sans (Top ATS)">
                      <option value="jakarta">Plus Jakarta Sans</option>
                      <option value="poppins">Poppins</option>
                      <option value="outfit">Outfit Geometric</option>
                      <option value="dmsans">DM Sans</option>
                      <option value="montserrat">Montserrat</option>
                      <option value="raleway">Raleway</option>
                      <option value="space">Space Grotesk</option>
                      <option value="sans">Inter Sans</option>
                      <option value="roboto">Roboto Clean</option>
                      <option value="oswald">Oswald Impact</option>
                    </optgroup>
                    <optgroup label="Executive & Editorial Serif">
                      <option value="playfair">Playfair Display</option>
                      <option value="merriweather">Merriweather</option>
                      <option value="lora">Lora Literary</option>
                      <option value="cinzel">Cinzel Prestige</option>
                      <option value="crimson">Crimson Pro</option>
                      <option value="editorial">Source Editorial</option>
                      <option value="serif">Classic Serif</option>
                    </optgroup>
                    <optgroup label="Developer & Monospace">
                      <option value="jetbrains">JetBrains Mono</option>
                      <option value="fira">Fira Code</option>
                      <option value="mono">Roboto Mono</option>
                    </optgroup>
                  </select>
                </div>

                {/* Photo toggle & Zoom controls */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <label className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={style.showPhoto}
                      onChange={(e) => handleUpdateStyle({ showPhoto: e.target.checked })}
                      className="rounded text-[#1a73e8] w-3.5 h-3.5"
                    />
                    <span className="text-[11px] font-medium">Photo</span>
                  </label>

                  <div className="flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-0.5 text-xs">
                    <button
                      onClick={() => {
                        setIsAutoFit(false);
                        setZoomScale(Math.max(0.40, Number((zoomScale - 0.08).toFixed(2))));
                      }}
                      className="p-1 text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                      title="Zoom Out"
                    >
                      <ZoomOut className="w-3 h-3" />
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsAutoFit(true);
                        if (previewContainerRef.current) {
                          const availableWidth = previewContainerRef.current.clientWidth - 28;
                          const fit = Math.min(1.0, Math.max(0.40, availableWidth / 794));
                          setZoomScale(Number(fit.toFixed(2)));
                        }
                      }}
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        isAutoFit ? 'bg-white dark:bg-slate-700 text-[#1a73e8] shadow-xs' : 'text-gray-600 dark:text-slate-300 hover:text-black'
                      }`}
                      title="Fit to Window"
                    >
                      {Math.round(zoomScale * 100)}%
                    </button>

                    <button
                      onClick={() => {
                        setIsAutoFit(false);
                        setZoomScale(Math.min(1.2, Number((zoomScale + 0.08).toFixed(2))));
                      }}
                      className="p-1 text-gray-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 rounded transition-colors"
                      title="Zoom In"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live A4 Sheet Preview Container */}
            <div
              ref={previewContainerRef}
              className="bg-[#525659] dark:bg-slate-950 rounded-2xl p-2 sm:p-4 overflow-x-auto min-h-[520px] flex justify-center items-start shadow-inner border dark:border-slate-800"
            >
              <div
                style={{
                  width: `${Math.round(794 * zoomScale)}px`,
                  minHeight: `${Math.round(1123 * zoomScale)}px`,
                  transition: 'width 0.15s ease-out, min-height 0.15s ease-out'
                }}
                className="relative shrink-0 flex justify-center"
              >
                <div
                  style={{
                    transform: `scale(${zoomScale})`,
                    transformOrigin: 'top center',
                    width: '794px',
                    minHeight: '1123px'
                  }}
                  className="transition-transform duration-150 absolute top-0"
                >
                  {/* Printable A4 Resume Sheet */}
                  <div
                    id="resume-printable-area"
                    className="resume-a4-page bg-white shadow-2xl rounded-xs border border-gray-300"
                  >
                    <ResumeTemplateRenderer data={data} style={style} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MOBILE STICKY BOTTOM BAR */}
      {/* ============================================================ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-[#dadce0] dark:border-slate-800 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold py-1 px-3 rounded-lg ${
            mobileTab === 'form' ? 'text-[#1a73e8] dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setMobileTab('preview')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold py-1 px-3 rounded-lg ${
            mobileTab === 'preview' ? 'text-[#1a73e8] dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Preview</span>
        </button>

        <button
          onClick={() => setMobileTab('templates')}
          className={`flex flex-col items-center gap-0.5 text-[11px] font-semibold py-1 px-3 rounded-lg ${
            mobileTab === 'templates' ? 'text-[#1a73e8] dark:text-blue-400' : 'text-gray-500 dark:text-slate-400'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Templates</span>
        </button>

        <button
          onClick={() => setShowDonationModal(true)}
          className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 py-1 px-2.5 rounded-lg"
          title="Support Creator"
        >
          <Heart className="w-4 h-4 fill-rose-600" />
          <span>Support</span>
        </button>

        <button
          onClick={handleDownloadDocx}
          disabled={isExportingDocx}
          className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-white bg-emerald-600 py-1.5 px-3 rounded-xl shadow-xs disabled:opacity-70"
          title="Download Word (.docx)"
        >
          <FileDown className="w-4 h-4" />
          <span>{isExportingDocx ? 'Docx...' : 'Word'}</span>
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={isExporting}
          className="flex flex-col items-center gap-0.5 text-[11px] font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 py-1.5 px-3.5 rounded-xl shadow-xs disabled:opacity-70"
          title="Download PDF"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'PDF...' : 'PDF'}</span>
        </button>
      </div>

      {/* Real User Feedback Modal (triggered after download or on demand) */}
      <FeedbackModal
        isOpen={showFeedbackModal}
        onClose={() => setShowFeedbackModal(false)}
        defaultName={data.personalInfo.fullName}
        defaultResumeTitle={resumeDoc.title}
      />

      {/* Support UPI Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        isDownloadTriggered={false}
        title="Support Akash Vishwakarma"
      />
    </div>
  );
};
