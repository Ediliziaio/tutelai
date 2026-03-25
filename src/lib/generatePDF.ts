import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function generatePDF(elementId: string, filename: string): Promise<void> {
  const el = document.getElementById(elementId);
  if (!el) throw new Error(`Element #${elementId} not found`);

  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
  const scaledWidth = imgWidth * ratio;
  const scaledHeight = imgHeight * ratio;

  // Handle multi-page if content is taller than one page
  const pageHeight = pdfHeight;
  const totalPages = Math.ceil(scaledHeight / pageHeight);

  if (totalPages <= 1) {
    pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
  } else {
    // Scale to fit width, then paginate
    const fitWidth = pdfWidth;
    const fitHeight = (imgHeight * fitWidth) / imgWidth;
    let yOffset = 0;

    for (let i = 0; i < totalPages; i++) {
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, -yOffset, fitWidth, fitHeight);
      yOffset += pageHeight;
    }
  }

  pdf.save(filename);
}
