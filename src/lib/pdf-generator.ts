import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Define font and styling constants
const COMPANY_NAME = "AL AQSA";
const COMPANY_SUBTITLE = "UMRAH TRANSPORT";
const COMPANY_BADGE = "GOLD TRANSFER";
const COMPANY_ARABIC = "أهلاً وسهلاً – ولكم أطيب الترحيب";
const COMPANY_ADDRESS = "Makkah Al Mukarramah, Saudi Arabia";
const COMPANY_WEBSITE = "www.alaqsa-transport.com";
const COMPANY_PHONE = "+966 50 123 4567";

// Colors based on the uploaded template
const PRIMARY_GOLD = "#D4AF37"; // Close to the gold in the image
const PRIMARY_GOLD_RGB: [number, number, number] = [212, 175, 55];
const LIGHT_YELLOW_RGB: [number, number, number] = [253, 246, 227]; // For the table footer and details box
const TEXT_DARK = "#333333";
const TEXT_GRAY = "#666666";

export const generateBookingInvoice = (booking: any, returnType: 'save' | 'base64' | 'buffer' = 'save') => {
    const doc = new jsPDF();

    // Helper function for drawing right-aligned text
    const textRight = (text: string, y: number, size: number, color: string, style: 'normal' | 'bold' | 'italic' = 'normal') => {
        doc.setFontSize(size);
        doc.setTextColor(color);
        doc.setFont("helvetica", style);
        doc.text(text, 195, y, { align: "right" });
    };

    // --- Page 1: Invoice ---

    // Header Left
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(PRIMARY_GOLD);
    doc.text(COMPANY_NAME, 15, 20);

    doc.setFontSize(11);
    doc.setTextColor(TEXT_GRAY);
    doc.text(COMPANY_SUBTITLE, 15, 26);

    // Gold Badge
    doc.setFillColor(...PRIMARY_GOLD_RGB);
    doc.rect(15, 29, 35, 5, 'F');
    doc.setFontSize(8);
    doc.setTextColor("#FFFFFF");
    doc.text(COMPANY_BADGE, 17, 33);

    // Arabic welcome text (Removed due to jsPDF rendering issues without custom VFS font)
    // doc.setTextColor(TEXT_GRAY);
    // doc.setFont("helvetica", "normal");
    // doc.text(COMPANY_ARABIC, 15, 40);

    // Header Right
    textRight("INVOICE", 22, 24, PRIMARY_GOLD, "bold");
    textRight(COMPANY_ADDRESS, 28, 10, TEXT_GRAY, "normal");
    textRight(COMPANY_WEBSITE, 33, 10, TEXT_GRAY, "normal");

    // Divider Line
    doc.setDrawColor(...PRIMARY_GOLD_RGB);
    doc.setLineWidth(0.5);
    doc.line(15, 45, 195, 45);

    // --- From & Invoice Details ---
    const topY = 55;

    // From
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("From", 15, topY);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "normal");
    doc.text("Al Aqsa Transport", 15, topY + 6);
    doc.text(COMPANY_ADDRESS, 15, topY + 11);
    doc.text(COMPANY_PHONE, 15, topY + 16);

    // Invoice Details Box (Light Yellow Background)
    doc.setFillColor(...LIGHT_YELLOW_RGB);
    doc.rect(120, 48, 75, 30, 'F');

    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    
    const detailsX = 125;
    let currY = topY;
    
    doc.setFont("helvetica", "bold");
    doc.text("Invoice No:", detailsX, currY);
    doc.setFont("helvetica", "normal");
    doc.text(`INV-${booking._id?.slice(-6).toUpperCase() || '1000'}`, detailsX + 25, currY);

    currY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Date:", detailsX, currY);
    doc.setFont("helvetica", "normal");
    doc.text(new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), detailsX + 25, currY);

    currY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Status:", detailsX, currY);
    doc.setFont("helvetica", "normal");
    doc.text(booking.status === 'confirmed' ? 'CONFIRMED' : (booking.status?.toUpperCase() || 'CONFIRMED'), detailsX + 25, currY);

    currY += 6;
    doc.setFont("helvetica", "bold");
    doc.text("Payment:", detailsX, currY);
    doc.setFont("helvetica", "normal");
    // Depending on logic, it can be AWAITING PAYMENT or PAID
    doc.setTextColor(PRIMARY_GOLD);
    doc.text(booking.paymentStatus === 'paid' ? 'PAID' : 'AWAITING PAYMENT', detailsX + 25, currY);

    // --- Bill To ---
    const billToY = 85;
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To", 15, billToY);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "normal");
    doc.text(booking.name || "Customer Name", 15, billToY + 6);
    if (booking.email) doc.text(booking.email, 15, billToY + 11);
    if (booking.phone) doc.text(booking.phone, 15, billToY + 16);

    // --- Service Details Title ---
    const serviceDetailsY = 115;
    doc.setFontSize(13);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Service Details", 15, serviceDetailsY);

    // --- Table ---
    const tableStartY = serviceDetailsY + 5;

    const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        try {
            const [hours, minutes] = timeStr.split(':');
            let h = parseInt(hours, 10);
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12;
            h = h ? h : 12;
            return `${h}:${minutes} ${ampm}`;
        } catch(e) {
            return timeStr;
        }
    };

    const formatDate = (dateInput: string | Date) => {
        if (!dateInput) return '';
        try {
            const d = new Date(dateInput);
            if (isNaN(d.getTime())) return String(dateInput);
            return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        } catch(e) {
            return String(dateInput);
        }
    };

    let tableData = [];
    
    if (booking.legs && booking.legs.length > 0) {
        tableData = booking.legs.map((leg: any, index: number) => {
            const dateStr = formatDate(leg.date);
            const timeStr = formatTime(leg.time);
            const pickup = leg.pickup?.split(',')[0] || '';
            const dropoff = leg.dropoff?.split(',')[0] || '';
            return [
                (index + 1).toString(),
                `${pickup} -> ${dropoff}`,
                dateStr,
                timeStr,
                leg.vehicleName || booking.vehicle || 'Hiace',
                (booking.vehicleCount || 1).toString(),
                leg.price ? Number(leg.price).toFixed(2) : '-'
            ];
        });
    } else {
        const pickup = booking.pickup?.split(',')[0] || '';
        const dropoff = booking.dropoff?.split(',')[0] || '';
        tableData = [
            [
                "1",
                `${pickup} -> ${dropoff}`,
                formatDate(booking.date || booking.pickupDate || Date.now()),
                formatTime(booking.time),
                booking.vehicle || 'Hiace',
                (booking.vehicleCount || 1).toString(),
                booking.finalPrice ? Number(booking.finalPrice).toFixed(2) : '0.00'
            ]
        ];
    }

    autoTable(doc, {
        startY: tableStartY,
        head: [['#', 'Service Description', 'Date', 'Time', 'Vehicle', 'Qty', 'Amount\n(SAR)']],
        body: tableData,
        theme: 'plain',
        headStyles: { fillColor: PRIMARY_GOLD_RGB, textColor: 255, fontStyle: 'bold', halign: 'center', valign: 'middle' },
        bodyStyles: { textColor: TEXT_DARK, fontSize: 10 },
        alternateRowStyles: { fillColor: [249, 249, 249] },
        styles: { cellPadding: 4, lineColor: [220, 220, 220], lineWidth: 0.1 },
        columnStyles: {
            0: { cellWidth: 8, halign: 'center' }, // #
            1: { cellWidth: 'auto' }, // Description
            2: { cellWidth: 25, halign: 'center' }, // Date
            3: { cellWidth: 20, halign: 'center' }, // Time
            4: { cellWidth: 25, halign: 'center' }, // Vehicle
            5: { cellWidth: 10, halign: 'center' }, // Qty
            6: { cellWidth: 25, halign: 'right' } // Amount
        },
    });

    // --- Subtotal / Total Block ---
    // @ts-ignore
    const finalTableY = doc.lastAutoTable.finalY;
    
    doc.setFillColor(...LIGHT_YELLOW_RGB);
    // x: 140 (approx under last 2 columns), y: finalTableY, w: 55, h: 20
    doc.rect(130, finalTableY, 65, 20, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "bold");
    
    const subtotalY = finalTableY + 7;
    doc.text("Subtotal", 165, subtotalY, { align: "right" });
    doc.text(`SAR\n${Number(booking.finalPrice || 0).toFixed(2)}`, 190, subtotalY - 2, { align: "right" });

    const totalY = finalTableY + 16;
    doc.text("Total", 165, totalY, { align: "right" });
    doc.text(`SAR\n${Number(booking.finalPrice || 0).toFixed(2)}`, 190, totalY - 2, { align: "right" });

    // --- Terms & Conditions ---
    const termsY = finalTableY + 35;
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Terms & Conditions", 15, termsY);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "normal");
    
    const terms = [
        "1. All amounts are quoted and payable in Saudi Riyal (SAR).",
        "2. Prices are inclusive of all applicable taxes and fees, unless stated otherwise.",
        "3. Cancellations must be notified at least 24 hours in advance to avoid additional charges.",
        "4. If you wish to pay by card, please inform us in advance to arrange this. If you do not have Saudi",
        "   Riyal (SAR), you may pay in your own currency or in US Dollars at the prevailing exchange rate."
    ];
    
    let currentTermY = termsY + 6;
    terms.forEach(term => {
        doc.text(term, 15, currentTermY);
        currentTermY += 5;
    });


    // --- Page 2: Guest Information & Guidelines ---
    doc.addPage();

    // Header
    doc.setFontSize(16);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("WELCOME TO AL AQSA TRANSFER", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(TEXT_GRAY);
    doc.setFont("helvetica", "italic");
    doc.text("Guest Information & Guidelines", 105, 26, { align: "center" });

    // Rules
    const rulesY = 40;
    doc.setFontSize(11);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "bold");
    doc.text("Rules & Regulations", 15, rulesY);

    doc.setFontSize(10);
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "normal");

    const rules = [
        "1. If the assigned driver does not respond, is late without notice, or behaves in an unprofessional",
        "manner, please report it immediately via our WhatsApp Community group — do not handle",
        "disputes directly with the driver.",
        "",
        "2. In case of flight delays, the driver will wait for you at the airport free of charge. Please share your",
        "flight number and updated arrival time with us in advance.",
        "",
        "3. All pickup and drop-off timings should be confirmed with our team at least 24 hours before the",
        "scheduled service.",
        "",
        "4. Vehicles are well-maintained, air-conditioned, and driven by licensed, experienced drivers.",
        "5. Passengers are requested to be ready at the pickup point at least 10 minutes before the",
        "scheduled time.",
        "",
        "6. All passengers must share their visa number(s) prior to airport pickup, as company documents are",
        "required by authorities to receive pilgrims at the airport or for any intercity transfer. We kindly request",
        "your cooperation in providing this information in advance.",
        "",
        "7. If a ride is booked as part of a package and a B2B (business-to-business) rate has been provided,",
        "individual legs of that package must not be cancelled separately. Cancelling a single ride from a",
        "package affects our agreement with the company and may impact future trust and cooperation.",
        "",
        "8. For any assistance, complaints, or emergencies during your journey, our support team is",
        "available 24/7 via the WhatsApp Community."
    ];

    let currRuleY = rulesY + 7;
    rules.forEach(line => {
        if (line.includes("please report it immediately") || line.includes("flight delays") || line.includes("confirmed with our team") || line.includes("support team is")) {
            // It's a bit complex to mix bold and normal text in jsPDF easily without splitting strings.
            // We'll just render it normally to keep it simple, or split manually if needed.
            // For simplicity, printing the whole line normal.
            doc.text(line, 15, currRuleY);
        } else {
            doc.text(line, 15, currRuleY);
        }
        currRuleY += 5;
    });

    // Important Box
    const importantBoxY = currRuleY + 5;
    doc.setDrawColor(...PRIMARY_GOLD_RGB);
    doc.setFillColor(...LIGHT_YELLOW_RGB);
    doc.setLineWidth(0.5);
    doc.rect(15, importantBoxY, 180, 45, 'FD');

    let boxTextY = importantBoxY + 8;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(PRIMARY_GOLD);
    doc.text("⚠ IMPORTANT — PLEASE READ CAREFULLY", 18, boxTextY);

    boxTextY += 8;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(TEXT_DARK);
    doc.text("Visa Requirement:", 18, boxTextY);
    doc.setFont("helvetica", "normal");
    doc.text("All passengers MUST share their visa number(s) before airport pickup.", 52, boxTextY);
    boxTextY += 5;
    doc.text("Company documents are legally required by authorities to receive pilgrims at the airport or for", 18, boxTextY);
    boxTextY += 5;
    doc.text("any intercity transfer. Cooperation is mandatory.", 18, boxTextY);

    boxTextY += 8;
    doc.setFont("helvetica", "bold");
    doc.text("B2B Package Bookings:", 18, boxTextY);
    doc.setFont("helvetica", "normal");
    doc.text("If your ride is part of a package booked at a B2B rate, you MUST NOT", 60, boxTextY);
    boxTextY += 5;
    doc.text("cancel a single ride separately. Doing so affects our agreement with the partner company and", 18, boxTextY);
    boxTextY += 5;
    doc.text("may result in loss of trust for future bookings.", 18, boxTextY);

    // Arabic Prayers at the bottom (Removed due to jsPDF rendering issues)
    let prayerY = importantBoxY + 60;
    doc.setFontSize(12);
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "normal");
    // doc.text("تقبّل الله عمرتكم وأحسن الله إليكم الخلف", 105, prayerY, { align: "center" });
    
    prayerY += 6;
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "italic");
    doc.text("May Allah accept your Umrah and grant you a safe, blessed and spiritually fulfilling journey.", 105, prayerY, { align: "center" });

    prayerY += 8;
    doc.setTextColor(PRIMARY_GOLD);
    doc.setFont("helvetica", "normal");
    // doc.text("لبّيك اللهم لبّيك", 105, prayerY, { align: "center" });

    prayerY += 6;
    doc.setTextColor(TEXT_DARK);
    doc.setFont("helvetica", "italic");
    doc.text("Wishing you ease in every step, acceptance of your prayers, and a heart filled with peace throughout", 105, prayerY, { align: "center" });
    prayerY += 5;
    doc.text("your sacred journey.", 105, prayerY, { align: "center" });

    prayerY += 12;
    doc.setTextColor(PRIMARY_GOLD);
    doc.text("We wish you a peaceful, blessed and memorable journey with Al Aqsa Transport", 105, prayerY, { align: "center" });

    // Output based on returnType
    if (returnType === 'base64') {
        return doc.output('datauristring');
    } else if (returnType === 'buffer') {
        return doc.output('arraybuffer');
    } else {
        doc.save(`Invoice-${booking._id || 'booking'}.pdf`);
    }
};
