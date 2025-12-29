import PDFDocument from "pdfkit";

/**
 * Generates a professional PDF receipt for a donation
 * @param {Object} donation - The donation document (populated with user or passing user separately)
 * @param {Object} user - The user document
 * @param {Object} res - Express response object to stream the PDF
 */
const generateReceipt = (donation, user, res) => {
  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    info: {
      Title: `Donation Receipt - ${donation._id}`,
      Author: "Zakat Management System",
    },
  });

  // Stream directly to response
  doc.pipe(res);

  // --- Header Section ---
  doc
    .fillColor("#006633")
    .fontSize(24)
    .text("Zakat Management System", { align: "center", bold: true })
    .moveDown(0.5);

  doc
    .fillColor("#444444")
    .fontSize(10)
    .text("Empowering the Community through Generosity", { align: "center" })
    .moveDown(2);

  doc
    .strokeColor("#eeeeee")
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(545, doc.y)
    .stroke()
    .moveDown(2);

  // --- Receipt Title & ID ---
  doc
    .fillColor("#333333")
    .fontSize(18)
    .text("DONATION RECEIPT", { align: "left" })
    .fontSize(10)
    .text(`Receipt ID: ${donation._id}`, { align: "right" })
    .text(
      `Date: ${new Date(donation.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      { align: "right" }
    )
    .moveDown(2);

  // --- Donor Details ---
  doc
    .fontSize(12)
    .fillColor("#006633")
    .text("DONOR INFORMATION", { underline: true })
    .moveDown(0.5);

  doc
    .fillColor("#333333")
    .fontSize(11)
    .text(`Name: ${user.name}`)
    .text(`Email: ${user.email}`)
    .moveDown(2);

  // --- Donation Details Table-like Layout ---
  doc
    .fontSize(12)
    .fillColor("#006633")
    .text("DONATION DETAILS", { underline: true })
    .moveDown(1);

  const drawRow = (label, value) => {
    const currentY = doc.y;
    doc.fillColor("#666666").text(label, 60, currentY);
    doc.fillColor("#333333").text(value, 200, currentY);
    doc.moveDown(0.8);
  };

  drawRow("Donation Type:", donation.donationType || "N/A");
  // Category is optional/commented in model, handle gracefully
  if (donation.category) {
    drawRow("Category:", donation.category);
  }
  drawRow("Payment Method:", donation.paymentMethod || "N/A");
  drawRow("Status:", (donation.status || "Approved").toUpperCase());

  doc.moveDown(1);

  // Amount Highlight
  const amountY = doc.y;
  doc.rect(50, amountY, 495, 40).fill("#f9f9f9");

  doc
    .fillColor("#006633")
    .fontSize(14)
    .text(`TOTAL DONATION AMOUNT: `, 70, amountY + 13, { continued: true })
    .fontSize(16)
    .text(`$ ${donation.amount.toLocaleString()}`, { bold: true });

  doc.moveDown(4);

  // --- Footer ---
  doc
    .fontSize(10)
    .fillColor("#777777")
    .text(
      "This is a computer-generated receipt and does not require a physical signature.",
      { align: "center", font: "Helvetica-Oblique" }
    )
    .moveDown(0.5);

  doc
    .fillColor("#006633")
    .fontSize(12)
    .text("Thank you for your generous contribution!", { align: "center" });

  // Finalize the PDF and end the stream
  doc.end();
};

export default generateReceipt;
