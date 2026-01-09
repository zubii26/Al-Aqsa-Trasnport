import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define font and styling constants
const COMPANY_NAME = "Al Aqsa Transport";
const COMPANY_ISLAMIC_NAME = "الأقصى لنقل المعتمرين";
const COMPANY_ADDRESS = "Makkah Al Mukarramah, Saudi Arabia";
const COMPANY_PHONE = "+966 50 123 4567";
const COMPANY_EMAIL = "bookings@alaqsa-transport.com";
const PRIMARY_COLOR = "#0f172a"; // slate-900

interface InvoiceData {
    invoiceAllowed: boolean;
    booking: any;
}

export const generateBookingInvoice = (booking: any) => {
    const doc = new jsPDF();

    // --- Header ---
    // Logo Placeholder (Left) - Ideally we addImage here if we have a base64 logo
    // For now, we use text as logo
    doc.setFontSize(22);
    doc.setTextColor(PRIMARY_COLOR);
    doc.setFont("helvetica", "bold");
    doc.text("Al Aqsa", 20, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Transport", 20, 26);

    // Company Info (Right)
    doc.setFontSize(10);
    doc.text(COMPANY_ADDRESS, 190, 20, { align: "right" });
    doc.text(COMPANY_PHONE, 190, 25, { align: "right" });
    doc.text(COMPANY_EMAIL, 190, 30, { align: "right" });

    // Title
    doc.setFontSize(18);
    doc.setTextColor(PRIMARY_COLOR);
    doc.text("INVOICE", 190, 50, { align: "right" });

    // Line Divider
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, 190, 55);

    // --- Bill To ---
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("BILL TO:", 20, 65);

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text(booking.name || "Customer Name", 20, 71);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (booking.email) doc.text(booking.email, 20, 76);
    if (booking.phone) doc.text(booking.phone, 20, 81);

    // --- Invoice Details ---
    const startY = 65;
    const rightColX = 140;
    const lineHeight = 6;

    doc.setTextColor(100, 100, 100);
    doc.text("Invoice Number:", rightColX, startY);
    doc.text("Date:", rightColX, startY + lineHeight);
    doc.text("Booking Ref:", rightColX, startY + lineHeight * 2);

    doc.setTextColor(0, 0, 0);
    doc.text(`INV-${booking._id?.slice(-6).toUpperCase()}`, 190, startY, { align: "right" });
    doc.text(new Date().toLocaleDateString(), 190, startY + lineHeight, { align: "right" });
    doc.text(booking._id?.slice(-6).toUpperCase(), 190, startY + lineHeight * 2, { align: "right" });

    // --- Table ---
    const tableStartY = 95;

    const tableData = [
        [
            `${booking.vehicle} Transfer\n${booking.pickup?.split(',')[0]} -> ${booking.dropoff?.split(',')[0]}`,
            "1",
            `SAR ${booking.finalPrice}`,
            `SAR ${booking.finalPrice}`
        ]
    ];

    autoTable(doc, {
        startY: tableStartY,
        head: [['Description', 'Qty', 'Unit Price', 'Total']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: PRIMARY_COLOR, textColor: 255 },
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
            0: { cellWidth: 'auto' }, // Description
            1: { cellWidth: 20, halign: 'center' }, // Qty
            2: { cellWidth: 30, halign: 'right' }, // Price
            3: { cellWidth: 30, halign: 'right' } // Total
        },
    });

    // --- Totals ---
    // @ts-ignore
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(10);
    doc.text("Subtotal:", 140, finalY);
    doc.text(`SAR ${booking.finalPrice}`, 190, finalY, { align: "right" });

    doc.text("Tax (15%):", 140, finalY + 6);
    doc.text("SAR 0.00", 190, finalY + 6, { align: "right" }); // Assuming tax included or 0 for now as per logic

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, finalY + 14);
    doc.text(`SAR ${booking.finalPrice}`, 190, finalY + 14, { align: "right" });

    // --- Footer ---
    doc.setFontSize(9);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business.", 105, 280, { align: "center" });
    doc.text("Al Aqsa Transport - CR: 1234567890", 105, 285, { align: "center" });

    // Save
    doc.save(`Invoice-${booking._id}.pdf`);
};
