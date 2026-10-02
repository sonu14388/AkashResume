import jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import * as htmlToImage from 'html-to-image';
import confetti from 'canvas-confetti';

export interface PDFExportOptions {
  fileName?: string;
  elementId?: string;
  onProgress?: (stage: string) => void;
}

/**
 * High-resolution A4 Multi-Page PDF Exporter
 * - Exact 210mm x 297mm A4 geometry
 * - Dedicated header gap / breathing room on subsequent pages (Page 2+)
 * - Website branding ONLY in footer (no website in header)
 * - Anti-cutoff canvas slicing with page numbering
 */
export const exportResumeToPDF = async ({
  fileName = 'Resume.pdf',
  elementId = 'resume-printable-area',
  onProgress
}: PDFExportOptions = {}): Promise<boolean> => {
  let sandboxContainer: HTMLDivElement | null = null;

  try {
    const originalElement = document.getElementById(elementId);
    if (!originalElement) {
      throw new Error(`Printable element #${elementId} not found`);
    }

    onProgress?.('Preparing high-resolution document...');

    // Wait for web fonts to complete loading
    if (document.fonts) {
      try {
        await document.fonts.ready;
      } catch {
        // Continue even if font ready check fails
      }
    }

    // Create an isolated off-screen sandbox container attached directly to body.
    sandboxContainer = document.createElement('div');
    sandboxContainer.id = 'pdf-export-sandbox-container';
    sandboxContainer.style.position = 'fixed';
    sandboxContainer.style.left = '-9999px';
    sandboxContainer.style.top = '0';
    sandboxContainer.style.width = '794px'; // 210mm standard at 96 DPI
    sandboxContainer.style.minHeight = '1123px'; // 297mm standard
    sandboxContainer.style.margin = '0';
    sandboxContainer.style.padding = '0';
    sandboxContainer.style.zIndex = '-9999';
    sandboxContainer.style.background = '#ffffff';
    sandboxContainer.style.color = '#172033';
    sandboxContainer.style.colorScheme = 'light';
    sandboxContainer.style.boxSizing = 'border-box';
    sandboxContainer.style.transform = 'none';

    // Clone the resume printable node
    const clone = originalElement.cloneNode(true) as HTMLElement;
    clone.style.width = '794px';
    clone.style.minHeight = '1123px';
    clone.style.margin = '0';
    clone.style.boxSizing = 'border-box';
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.border = 'none';
    clone.style.background = '#ffffff';
    clone.style.color = '#172033';
    clone.style.colorScheme = 'light';
    clone.style.display = 'block';
    clone.style.visibility = 'visible';

    // Ensure all cloned children are in light color scheme without dark mode interference
    clone.classList.remove('dark');
    clone.querySelectorAll('*').forEach((el) => {
      el.classList.remove('dark');
      (el as HTMLElement).style.colorScheme = 'light';
    });

    sandboxContainer.appendChild(clone);
    document.body.appendChild(sandboxContainer);

    // Wait brief tick for browser layout engine to paint clone
    await new Promise((resolve) => setTimeout(resolve, 200));

    onProgress?.('Generating high-resolution snapshot...');

    let sourceCanvas: HTMLCanvasElement | null = null;

    try {
      // Primary high-fidelity renderer with html2canvas-pro
      sourceCanvas = await html2canvas(clone, {
        scale: 2.2, // Crisp 300 DPI equivalent
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        windowWidth: 1200,
        imageTimeout: 15000
      });
    } catch (primaryErr) {
      console.warn('html2canvas-pro encountered an issue, trying html-to-image fallback:', primaryErr);
      
      // Secondary fallback using html-to-image
      try {
        sourceCanvas = await htmlToImage.toCanvas(clone, {
          backgroundColor: '#ffffff',
          pixelRatio: 2.2,
          width: 794,
          canvasWidth: 794 * 2.2,
          canvasHeight: Math.max(1123, clone.scrollHeight) * 2.2
        });
      } catch (fallbackErr) {
        console.error('All PDF rendering engines failed:', fallbackErr);
        throw fallbackErr;
      }
    }

    if (!sourceCanvas) {
      throw new Error('Failed to generate canvas for PDF export');
    }

    onProgress?.('Formatting A4 PDF pages...');

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pdfWidth = 210; // A4 width in mm
    const pdfPageHeight = 297; // A4 height in mm
    const footerMargin = 14; // Reserve bottom 14mm for footer
    const topHeaderGap = 16; // Dedicated top gap for continuing pages (Page 2, 3, etc.)

    const canvasWidth = sourceCanvas.width;
    const canvasHeight = sourceCanvas.height;
    const totalHeightMm = (canvasHeight * pdfWidth) / canvasWidth;

    // Helper: Add clean footer with website branding ONLY (Header has no website name)
    const addPageFooter = (pageNum: number, totalPagesCount: number) => {
      // Subtle divider line
      pdf.setDrawColor(229, 231, 235); // #E5E7EB
      pdf.setLineWidth(0.3);
      pdf.line(10, 290, 200, 290);

      // Website Branding ONLY on bottom left
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(107, 114, 128); // #6B7280
      pdf.text('Created with FreeResumeMaker • freeresumemakerc.in', 10, 294);

      // Page Numbering on bottom right
      pdf.text(`Page ${pageNum} of ${totalPagesCount}`, 200, 294, { align: 'right' });
    };

    // Calculate pagination slices
    const usableMmPage1 = pdfPageHeight - footerMargin; // 283 mm
    const usableMmOther = pdfPageHeight - topHeaderGap - footerMargin; // 267 mm

    const page1HeightPx = (usableMmPage1 / 210) * canvasWidth;
    const subsequentPageHeightPx = (usableMmOther / 210) * canvasWidth;

    let totalPages = 1;
    if (totalHeightMm > usableMmPage1 + 5) {
      const remainingHeightMm = totalHeightMm - usableMmPage1;
      totalPages = 1 + Math.ceil(remainingHeightMm / usableMmOther);
    }

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      if (pageIndex > 0) {
        pdf.addPage();
      }

      let sourceY = 0;
      let sourceH = 0;
      let destY = 0;
      let destH = 0;

      if (pageIndex === 0) {
        // Page 1 starts at top of canvas
        sourceY = 0;
        sourceH = Math.min(canvasHeight, page1HeightPx);
        destY = 0;
        destH = (sourceH * pdfWidth) / canvasWidth;
      } else {
        // Page 2+ starts after previous slices, with topHeaderGap
        sourceY = page1HeightPx + (pageIndex - 1) * subsequentPageHeightPx;
        sourceH = Math.min(canvasHeight - sourceY, subsequentPageHeightPx);
        destY = topHeaderGap;
        destH = (sourceH * pdfWidth) / canvasWidth;
      }

      if (sourceH > 0) {
        // Slice the canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = Math.max(1, Math.round(sourceH));
        const pageCtx = pageCanvas.getContext('2d');

        if (pageCtx) {
          pageCtx.fillStyle = '#ffffff';
          pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
          pageCtx.drawImage(
            sourceCanvas,
            0, sourceY, canvasWidth, sourceH,
            0, 0, canvasWidth, sourceH
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.96);
          pdf.addImage(pageImgData, 'JPEG', 0, destY, pdfWidth, destH, undefined, 'FAST');
        }
      }

      // Add clean footer to this page
      addPageFooter(pageIndex + 1, totalPages);
    }

    onProgress?.('Finalizing PDF download...');
    const sanitizedFileName = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
    pdf.save(sanitizedFileName);

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    return true;
  } catch (error) {
    console.error('Failed to export PDF:', error);
    return false;
  } finally {
    if (sandboxContainer && document.body.contains(sandboxContainer)) {
      document.body.removeChild(sandboxContainer);
    }
  }
};
