import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { TravelItinerary } from '../types';

export async function downloadItineraryAsPdf(itinerary: TravelItinerary, elementId: string = 'itinerary-pdf-content') {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      // Fallback: Generate text-based PDF using jsPDF directly
      generateTextPdf(itinerary);
      return;
    }

    // Capture element with html2canvas for high quality visual PDF
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#faf8f5', // Earth Poetry off-white background
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const safeFilename = `${itinerary.title.replace(/[^a-zA-Z0-9]/g, '_')}_EarthPoetry.pdf`;
    pdf.save(safeFilename);
  } catch (err) {
    console.error('HTML2Canvas PDF Export failed, falling back to direct jsPDF text export:', err);
    generateTextPdf(itinerary);
  }
}

function generateTextPdf(itinerary: TravelItinerary) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let y = 15;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(20);
  pdf.setTextColor(40, 50, 40); // Earthy dark green
  pdf.text('EARTH POETRY - Bespoke Travel Itinerary', 15, y);
  y += 10;

  pdf.setFontSize(14);
  pdf.text(itinerary.title, 15, y);
  y += 8;

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Destination: ${itinerary.destination} | Duration: ${itinerary.durationDays} Days | Budget: ${itinerary.totalEstimatedCost}`, 15, y);
  y += 6;
  pdf.text(`Travelers: ${itinerary.travelers} | Website: earthpoetry.online`, 15, y);
  y += 12;

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(10);
  pdf.setTextColor(60, 60, 60);
  const splitOverview = pdf.splitTextToSize(itinerary.overview, 180);
  pdf.text(splitOverview, 15, y);
  y += (splitOverview.length * 5) + 10;

  // Render Days
  itinerary.days.forEach((day) => {
    if (y > 260) {
      pdf.addPage();
      y = 15;
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(12);
    pdf.setTextColor(180, 83, 9); // Amber / terracotta accent
    pdf.text(day.dateOrTitle, 15, y);
    y += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(50, 50, 50);

    // Morning
    pdf.text(`• Morning: ${day.morning.title} (${day.morning.time}) - ${day.morning.description}`, 20, y);
    y += 6;

    // Afternoon
    pdf.text(`• Afternoon: ${day.afternoon.title} (${day.afternoon.time}) - ${day.afternoon.description}`, 20, y);
    y += 6;

    // Evening
    pdf.text(`• Evening: ${day.evening.title} (${day.evening.time}) - ${day.evening.description}`, 20, y);
    y += 6;

    // Dining
    pdf.text(`• Dining: ${day.diningRecommendation.name} (${day.diningRecommendation.cuisine})`, 20, y);
    y += 6;

    // Stay
    pdf.text(`• Night Stay: ${day.stayForNight.name} (${day.stayForNight.type})`, 20, y);
    y += 10;
  });

  const safeFilename = `${itinerary.title.replace(/[^a-zA-Z0-9]/g, '_')}_EarthPoetry.pdf`;
  pdf.save(safeFilename);
}
