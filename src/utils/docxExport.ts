import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Header,
  Footer,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  convertInchesToTwip
} from 'docx';
import { saveAs } from 'file-saver';
import { ResumeData, ResumeStyle } from '../types';
import { getTemplateById } from '../data/templatesData';

export interface DocxExportOptions {
  fileName?: string;
  data: ResumeData;
  style: ResumeStyle;
}

/**
 * Clean hex color string for Word DOCX (without leading #)
 */
const sanitizeHexColor = (colorStr?: string, defaultHex = '1A73E8'): string => {
  if (!colorStr) return defaultHex;
  const hex = colorStr.replace('#', '').trim();
  return hex.length === 6 ? hex : defaultHex;
};

/**
 * Maps font family name to standard Microsoft Word fonts
 */
const mapToWordFont = (fontFamily?: string): string => {
  switch (fontFamily) {
    case 'poppins':
    case 'outfit':
    case 'montserrat':
    case 'raleway':
    case 'space':
      return 'Segoe UI';
    case 'playfair':
    case 'merriweather':
    case 'lora':
    case 'cinzel':
    case 'crimson':
    case 'editorial':
    case 'serif':
      return 'Georgia';
    case 'mono':
    case 'jetbrains':
    case 'fira':
      return 'Consolas';
    case 'jakarta':
    case 'roboto':
    case 'dmsans':
    case 'oswald':
    case 'sans':
    default:
      return 'Calibri';
  }
};

/**
 * Template Archetype classification for Word Document Export
 */
type TemplateArchetype = 'modern' | 'creative' | 'ats' | 'executive' | 'professional';

const getTemplateArchetype = (templateId?: string): TemplateArchetype => {
  if (!templateId) return 'professional';
  const tplInfo = getTemplateById(templateId);
  const layout = tplInfo ? tplInfo.layoutVariant : templateId;

  if (['minimal', 'compact', 'nordic', 'swiss'].includes(layout) || templateId.includes('ats') || templateId.includes('minimal')) {
    return 'ats';
  }
  if (['creative', 'sidebar', 'bold', 'tech', 'metro', 'infographic'].includes(layout) || templateId.includes('creative') || templateId.includes('tech')) {
    return 'creative';
  }
  if (['executive', 'elegant', 'academic'].includes(layout) || templateId.includes('executive') || templateId.includes('finance') || templateId.includes('academic')) {
    return 'executive';
  }
  if (['modern', 'split', 'cascade', 'timeline', 'grid'].includes(layout) || templateId.includes('modern')) {
    return 'modern';
  }
  return 'professional';
};

/**
 * High-fidelity, Template-Adaptive Microsoft Word (.docx) generator
 */
export const exportResumeToDocx = async ({
  fileName = 'Resume.docx',
  data,
  style
}: DocxExportOptions): Promise<boolean> => {
  try {
    const {
      personalInfo,
      summary,
      workExperience,
      education,
      skills,
      projects,
      certifications,
      languages,
      additionalSections
    } = data;

    const archetype = getTemplateArchetype(style.templateId);
    const primaryHex = sanitizeHexColor(style.primaryColor, archetype === 'ats' ? '111827' : '1A73E8');
    const wordFont = mapToWordFont(style.fontFamily);
    const textHex = '1F2937';
    const mutedHex = '4B5563';
    const lightBgHex = `${primaryHex}15`;

    const docChildren: (Paragraph | Table)[] = [];

    // =========================================================================
    // 1. CANDIDATE HEADER (Template Adaptive)
    // =========================================================================
    const contactParts: string[] = [];
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.location) contactParts.push(personalInfo.location);
    if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin.replace(/^https?:\/\//, ''));
    if (personalInfo.github) contactParts.push(personalInfo.github.replace(/^https?:\/\//, ''));
    if (personalInfo.website) contactParts.push(personalInfo.website.replace(/^https?:\/\//, ''));

    if (archetype === 'creative') {
      // Creative: High-impact shaded header banner table
      const headerCell = new TableCell({
        shading: { fill: primaryHex, type: ShadingType.CLEAR, color: 'auto' },
        margins: { top: 200, bottom: 200, left: 240, right: 240 },
        children: [
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({
                text: (personalInfo.fullName || 'YOUR NAME').toUpperCase(),
                bold: true,
                size: 38, // 19pt
                color: 'FFFFFF',
                font: wordFont
              })
            ]
          }),
          ...(personalInfo.title
            ? [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { before: 0, after: 60 },
                  children: [
                    new TextRun({
                      text: personalInfo.title.toUpperCase(),
                      bold: true,
                      size: 22,
                      color: 'E0E7FF',
                      font: wordFont
                    })
                  ]
                })
              ]
            : []),
          ...(contactParts.length > 0
            ? [
                new Paragraph({
                  alignment: AlignmentType.LEFT,
                  spacing: { before: 40, after: 40 },
                  children: [
                    new TextRun({
                      text: contactParts.join('  •  '),
                      size: 18,
                      color: 'F1F5F9',
                      font: wordFont
                    })
                  ]
                })
              ]
            : [])
        ]
      });

      docChildren.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [new TableRow({ children: [headerCell] })]
        })
      );
      docChildren.push(new Paragraph({ spacing: { before: 140, after: 0 }, children: [] }));
    } else if (archetype === 'modern') {
      // Modern: Left aligned with thick accent bottom border
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: (personalInfo.fullName || 'YOUR NAME').toUpperCase(),
              bold: true,
              size: 36,
              color: primaryHex,
              font: wordFont
            })
          ]
        })
      );

      if (personalInfo.title) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: personalInfo.title,
                bold: true,
                size: 22,
                color: textHex,
                font: wordFont
              })
            ]
          })
        );
      }

      if (contactParts.length > 0) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 180 },
            border: {
              bottom: {
                color: primaryHex,
                space: 6,
                style: BorderStyle.SINGLE,
                size: 16
              }
            },
            children: [
              new TextRun({
                text: contactParts.join('   |   '),
                size: 19,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );
      }
    } else if (archetype === 'executive') {
      // Executive: Centered classic serif with double rule
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: (personalInfo.fullName || 'YOUR NAME').toUpperCase(),
              bold: true,
              size: 36,
              color: primaryHex,
              font: wordFont
            })
          ]
        })
      );

      if (personalInfo.title) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: personalInfo.title.toUpperCase(),
                bold: true,
                size: 20,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );
      }

      if (contactParts.length > 0) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 180 },
            border: {
              bottom: {
                color: primaryHex,
                space: 5,
                style: BorderStyle.DOUBLE,
                size: 12
              }
            },
            children: [
              new TextRun({
                text: contactParts.join('  •  '),
                size: 19,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );
      }
    } else if (archetype === 'ats') {
      // ATS Minimalist: Clean monochrome, 100% scanner safe
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.LEFT,
          spacing: { before: 0, after: 30 },
          children: [
            new TextRun({
              text: (personalInfo.fullName || 'YOUR NAME').toUpperCase(),
              bold: true,
              size: 34,
              color: '000000',
              font: wordFont
            })
          ]
        })
      );

      if (personalInfo.title) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: personalInfo.title,
                bold: true,
                size: 21,
                color: '374151',
                font: wordFont
              })
            ]
          })
        );
      }

      if (contactParts.length > 0) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 0, after: 140 },
            border: {
              bottom: {
                color: '000000',
                space: 4,
                style: BorderStyle.SINGLE,
                size: 12
              }
            },
            children: [
              new TextRun({
                text: contactParts.join('  |  '),
                size: 19,
                color: '4B5563',
                font: wordFont
              })
            ]
          })
        );
      }
    } else {
      // Professional Standard: Balanced Centered
      docChildren.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 40 },
          children: [
            new TextRun({
              text: (personalInfo.fullName || 'YOUR NAME').toUpperCase(),
              bold: true,
              size: 36,
              color: primaryHex,
              font: wordFont
            })
          ]
        })
      );

      if (personalInfo.title) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: personalInfo.title.toUpperCase(),
                bold: true,
                size: 21,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );
      }

      if (contactParts.length > 0) {
        docChildren.push(
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 180 },
            border: {
              bottom: {
                color: primaryHex,
                space: 4,
                style: BorderStyle.SINGLE,
                size: 12
              }
            },
            children: [
              new TextRun({
                text: contactParts.join('  |  '),
                size: 19,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );
      }
    }

    // =========================================================================
    // Helper: Add Section Header (Template Adaptive)
    // =========================================================================
    const addSectionHeader = (title: string) => {
      if (archetype === 'ats') {
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 180, after: 80 },
            border: {
              bottom: {
                color: '111827',
                space: 2,
                style: BorderStyle.SINGLE,
                size: 8
              }
            },
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 22,
                color: '000000',
                font: wordFont
              })
            ]
          })
        );
      } else if (archetype === 'executive') {
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 90 },
            border: {
              bottom: {
                color: primaryHex,
                space: 3,
                style: BorderStyle.SINGLE,
                size: 10
              }
            },
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 22,
                color: primaryHex,
                font: wordFont
              })
            ]
          })
        );
      } else {
        docChildren.push(
          new Paragraph({
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 190, after: 90 },
            border: {
              bottom: {
                color: primaryHex,
                space: 3,
                style: BorderStyle.SINGLE,
                size: 10
              }
            },
            children: [
              new TextRun({
                text: title.toUpperCase(),
                bold: true,
                size: 22,
                color: primaryHex,
                font: wordFont
              })
            ]
          })
        );
      }
    };

    // =========================================================================
    // 2. PROFESSIONAL SUMMARY
    // =========================================================================
    if (summary && summary.trim()) {
      addSectionHeader('Professional Summary');
      docChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 120 },
          children: [
            new TextRun({
              text: summary,
              size: 20,
              color: textHex,
              font: wordFont
            })
          ]
        })
      );
    }

    // =========================================================================
    // 3. WORK EXPERIENCE
    // =========================================================================
    if (workExperience && workExperience.length > 0) {
      addSectionHeader('Work Experience');

      workExperience.forEach((exp) => {
        const dateStr = `${exp.startDate || ''} – ${exp.current ? 'Present' : exp.endDate || 'Present'}`;

        docChildren.push(
          new Paragraph({
            spacing: { before: 110, after: 20 },
            children: [
              new TextRun({
                text: exp.jobTitle || 'Job Title',
                bold: true,
                size: 22,
                color: textHex,
                font: wordFont
              }),
              new TextRun({
                text: `\t${dateStr}`,
                bold: true,
                size: 19,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );

        docChildren.push(
          new Paragraph({
            spacing: { before: 0, after: 50 },
            children: [
              new TextRun({
                text: `${exp.company || 'Company'}${exp.location ? ` | ${exp.location}` : ''}`,
                bold: true,
                italics: true,
                size: 20,
                color: primaryHex,
                font: wordFont
              })
            ]
          })
        );

        if (exp.description) {
          const lines = exp.description.split('\n').filter(Boolean);
          lines.forEach((line) => {
            const cleanLine = line.replace(/^[•\-\*]\s*/, '');
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 15, after: 25 },
                children: [
                  new TextRun({
                    text: cleanLine,
                    size: 19,
                    color: textHex,
                    font: wordFont
                  })
                ]
              })
            );
          });
        }
      });
    }

    // =========================================================================
    // 4. EDUCATION
    // =========================================================================
    if (education && education.length > 0) {
      addSectionHeader('Education');

      education.forEach((edu) => {
        const dateStr = `${edu.startYear || ''} – ${edu.endYear || 'Present'}`;

        docChildren.push(
          new Paragraph({
            spacing: { before: 90, after: 20 },
            children: [
              new TextRun({
                text: edu.degree || 'Degree / Diploma',
                bold: true,
                size: 21,
                color: textHex,
                font: wordFont
              }),
              new TextRun({
                text: `\t${dateStr}`,
                bold: true,
                size: 19,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );

        docChildren.push(
          new Paragraph({
            spacing: { before: 0, after: 50 },
            children: [
              new TextRun({
                text: `${edu.school || 'University / Institution'}${edu.location ? ` | ${edu.location}` : ''}`,
                italics: true,
                size: 19,
                color: primaryHex,
                font: wordFont
              })
            ]
          })
        );

        if (edu.description) {
          docChildren.push(
            new Paragraph({
              spacing: { before: 0, after: 40 },
              children: [
                new TextRun({
                  text: edu.description,
                  italics: true,
                  size: 18,
                  color: mutedHex,
                  font: wordFont
                })
              ]
            })
          );
        }
      });
    }

    // =========================================================================
    // 5. KEY SKILLS
    // =========================================================================
    if (skills && skills.length > 0) {
      addSectionHeader('Skills & Competencies');

      const skillItems = skills.map((s) => (s.level ? `${s.name} (${s.level})` : s.name));
      docChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 100 },
          children: [
            new TextRun({
              text: skillItems.join('  •  '),
              size: 20,
              color: textHex,
              font: wordFont
            })
          ]
        })
      );
    }

    // =========================================================================
    // 6. PROJECTS
    // =========================================================================
    if (projects && projects.length > 0) {
      addSectionHeader('Key Projects');

      projects.forEach((proj) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 90, after: 20 },
            children: [
              new TextRun({
                text: proj.name || 'Project Name',
                bold: true,
                size: 21,
                color: textHex,
                font: wordFont
              }),
              proj.role
                ? new TextRun({
                    text: ` (${proj.role})`,
                    italics: true,
                    size: 19,
                    color: mutedHex,
                    font: wordFont
                  })
                : new TextRun({ text: '' }),
              proj.link
                ? new TextRun({
                    text: `\t${proj.link}`,
                    size: 18,
                    color: primaryHex,
                    font: wordFont
                  })
                : new TextRun({ text: '' })
            ]
          })
        );

        if (proj.technologies) {
          docChildren.push(
            new Paragraph({
              spacing: { before: 0, after: 35 },
              children: [
                new TextRun({
                  text: `Technologies: ${proj.technologies}`,
                  italics: true,
                  size: 18,
                  color: mutedHex,
                  font: wordFont
                })
              ]
            })
          );
        }

        if (proj.description) {
          const lines = proj.description.split('\n').filter(Boolean);
          lines.forEach((line) => {
            const cleanLine = line.replace(/^[•\-\*]\s*/, '');
            docChildren.push(
              new Paragraph({
                bullet: { level: 0 },
                spacing: { before: 15, after: 25 },
                children: [
                  new TextRun({
                    text: cleanLine,
                    size: 19,
                    color: textHex,
                    font: wordFont
                  })
                ]
              })
            );
          });
        }
      });
    }

    // =========================================================================
    // 7. CERTIFICATIONS
    // =========================================================================
    if (certifications && certifications.length > 0) {
      addSectionHeader('Certifications & Licenses');

      certifications.forEach((cert) => {
        docChildren.push(
          new Paragraph({
            spacing: { before: 40, after: 30 },
            children: [
              new TextRun({
                text: `• ${cert.name || 'Certification'}`,
                bold: true,
                size: 20,
                color: textHex,
                font: wordFont
              }),
              new TextRun({
                text: ` – ${cert.issuer || ''} ${cert.date ? `(${cert.date})` : ''}`,
                size: 19,
                color: mutedHex,
                font: wordFont
              })
            ]
          })
        );
      });
    }

    // =========================================================================
    // 8. LANGUAGES
    // =========================================================================
    if (languages && languages.length > 0) {
      addSectionHeader('Languages');

      const langItems = languages.map((l) => `${l.language} (${l.proficiency})`);
      docChildren.push(
        new Paragraph({
          spacing: { before: 40, after: 100 },
          children: [
            new TextRun({
              text: langItems.join('  |  '),
              size: 20,
              color: textHex,
              font: wordFont
            })
          ]
        })
      );
    }

    // =========================================================================
    // 9. ADDITIONAL SECTIONS
    // =========================================================================
    if (additionalSections && additionalSections.length > 0) {
      additionalSections.forEach((sec) => {
        addSectionHeader(sec.title || 'Additional Section');
        if (sec.subtitle || sec.date) {
          docChildren.push(
            new Paragraph({
              spacing: { before: 20, after: 25 },
              children: [
                new TextRun({
                  text: `${sec.subtitle || ''} ${sec.date ? `(${sec.date})` : ''}`.trim(),
                  bold: true,
                  size: 19,
                  color: primaryHex,
                  font: wordFont
                })
              ]
            })
          );
        }
        if (sec.description) {
          docChildren.push(
            new Paragraph({
              spacing: { before: 15, after: 35 },
              children: [
                new TextRun({
                  text: sec.description,
                  size: 19,
                  color: textHex,
                  font: wordFont
                })
              ]
            })
          );
        }
      });
    }

    // =========================================================================
    // ASSEMBLE DOCX WITH HEADER & FOOTER
    // =========================================================================
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.5), // 0.5 inch margins
                right: convertInchesToTwip(0.5),
                bottom: convertInchesToTwip(0.5),
                left: convertInchesToTwip(0.5)
              }
            }
          },
          headers: {
            default: new Header({
              children: [
                new Paragraph({
                  alignment: AlignmentType.RIGHT,
                  spacing: { before: 0, after: 80 },
                  children: [
                    new TextRun({
                      text: `${personalInfo.fullName || 'Curriculum Vitae'}`,
                      size: 16, // 8pt
                      color: '9CA3AF',
                      font: wordFont
                    })
                  ]
                })
              ]
            })
          },
          footers: {
            default: new Footer({
              children: [
                new Paragraph({
                  alignment: AlignmentType.CENTER,
                  spacing: { before: 80, after: 0 },
                  border: {
                    top: {
                      color: 'E5E7EB',
                      space: 2,
                      style: BorderStyle.SINGLE,
                      size: 6
                    }
                  },
                  children: [
                    new TextRun({
                      text: 'Generated with FreeResumeMaker • freeresumemakerc.in',
                      size: 16, // 8pt
                      color: '6B7280',
                      font: wordFont,
                      bold: true
                    })
                  ]
                })
              ]
            })
          },
          children: docChildren
        }
      ]
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, fileName.endsWith('.docx') ? fileName : `${fileName}.docx`);
    return true;
  } catch (error) {
    console.error('Failed to export DOCX:', error);
    return false;
  }
};
