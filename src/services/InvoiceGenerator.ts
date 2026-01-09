import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
interface jsPDFWithAutoTable extends jsPDF {
    lastAutoTable: { finalY: number };
    autoTable: (options: any) => void;
}

export const generateInvoice = async (booking: any) => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // --- HELPER FUNCTIONS ---
    const drawLine = (y: number) => {
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.line(15, y, pageWidth - 15, y);
    };

    // --- HEADER ---
    // Logo (Simulated with text for now, can replace with base64 img)
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Al Aqsa Transport", 15, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text("Luxury Umrah Transport Services", 15, 26);

    // Invoice Label
    doc.setFontSize(30);
    doc.setTextColor(203, 213, 225); // Slate-300
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth - 15, 25, { align: 'right' });

    drawLine(35);

    // --- INFO SECTION ---
    let yPos = 45;

    // From (Company)
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("BILLED FROM", 15, yPos);

    doc.setTextColor(51, 65, 85); // Slate-700
    doc.setFont("helvetica", "bold");
    doc.text("Al Aqsa Umrah Transport", 15, yPos + 6);
    doc.setFont("helvetica", "normal");
    doc.text("Jeddah, Saudi Arabia", 15, yPos + 11);
    doc.text("support@alaqsa.com", 15, yPos + 16);

    // To (Customer)
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text("BILLED TO", pageWidth / 2, yPos);

    doc.setTextColor(51, 65, 85); // Slate-700
    doc.setFont("helvetica", "bold");
    doc.text(booking.name || "Customer", pageWidth / 2, yPos + 6);
    doc.setFont("helvetica", "normal");
    doc.text(booking.email || "", pageWidth / 2, yPos + 11);
    doc.text(booking.phone || "", pageWidth / 2, yPos + 16);


    // Meta Data (Date, Invoice #)
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate-400
    const metaX = pageWidth - 50;

    doc.text("Invoice No:", metaX, yPos);
    doc.setTextColor(51, 65, 85);
    doc.text(`#${booking._id?.slice(-6).toUpperCase() || '---'}`, pageWidth - 15, yPos, { align: 'right' });

    doc.setTextColor(148, 163, 184);
    doc.text("Date:", metaX, yPos + 6);
    doc.setTextColor(51, 65, 85);
    doc.text(new Date(booking.date || Date.now()).toLocaleDateString(), pageWidth - 15, yPos + 6, { align: 'right' });

    doc.setTextColor(148, 163, 184);
    doc.text("Status:", metaX, yPos + 12);
    doc.setTextColor(booking.paymentStatus === 'paid' ? 22 : 245, booking.paymentStatus === 'paid' ? 163 : 158, booking.paymentStatus === 'paid' ? 74 : 11); // Green or Amber
    doc.setFont("helvetica", "bold");
    doc.text(booking.paymentStatus === 'paid' ? 'PAID' : 'UNPAID', pageWidth - 15, yPos + 12, { align: 'right' });

    // --- TABLE ---
    const tableY = yPos + 30;

    const tableData = [
        [
            booking.vehicle || 'Umrah Transport',
            `${booking.pickup} -> ${booking.dropoff}`,
            `Date: ${new Date(booking.date).toLocaleDateString()} ${booking.time || ''}\nRef: ${booking._id?.slice(-6)}`, // Details
            `SAR ${booking.finalPrice}` // Amount
        ]
    ];

    doc.autoTable({
        startY: tableY,
        head: [['Item', 'Description', 'Details', 'Amount']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [241, 245, 249], textColor: [71, 85, 105], fontStyle: 'bold' }, // Slate-100, Slate-600
        styles: { textColor: [51, 65, 85], fontSize: 10, cellPadding: 4 },
        columnStyles: {
            0: { fontStyle: 'bold' },
            3: { halign: 'right', fontStyle: 'bold' }
        }
    });

    // --- TOTALS ---
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const totalsX = pageWidth - 60;

    doc.setFontSize(10);
    // Subtotal
    doc.setTextColor(100, 116, 139);
    doc.text("Subtotal:", totalsX, finalY);
    doc.setTextColor(51, 65, 85);
    doc.text(`SAR ${booking.finalPrice}`, pageWidth - 15, finalY, { align: 'right' });

    // VAT
    doc.setTextColor(100, 116, 139);
    doc.text("VAT (15%):", totalsX, finalY + 6);
    doc.setTextColor(51, 65, 85);
    const priceVal = parseFloat(String(booking.finalPrice).replace(/[^0-9.]/g, '')) || 0;
    const vat = (priceVal * 0.15).toFixed(2);
    doc.text(`SAR ${vat} (Included)`, pageWidth - 15, finalY + 6, { align: 'right' });

    drawLine(finalY + 12);

    // Grand Total
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // Slate-900
    doc.text("Total:", totalsX, finalY + 22);
    doc.setTextColor(37, 99, 235); // Blue-600
    doc.text(`SAR ${booking.finalPrice}`, pageWidth - 15, finalY + 22, { align: 'right' });

    // --- FOOTER ---
    const footerY = pageHeight - 30;
    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text("Thank you for your business.", 15, footerY);
    doc.text("Terms & Conditions apply. For any queries, contact support.", 15, footerY + 5);

    // Save
    doc.save(`Invoice_${booking._id || 'draft'}.pdf`);
};
