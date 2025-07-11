
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");

async function generateInvoicePDFPreview(data) {
  try {
    // Read and compile template
    const templatePath = path.join(__dirname, "../public/invoiceTemplate.html");
    if (!fs.existsSync(templatePath)) {
      throw new Error("Invoice template not found");
    }

    const templateContent = fs.readFileSync(templatePath, "utf8");
    const template = Handlebars.compile(templateContent);

    // Prepare data for template
    const templateData = {
      companyName: "SOLAI AGRO FRESH PRIVATE LIMITED",
      invoiceNumber: data.invoice_number,
      invoiceDate: data.invoice_date,
      buyersOrder: data.buyers_order,
      originCountry: data.origin_country,
      destinationCountry: data.destination_country,
      exporterName: data.exporter_name,
      gstNo: data.gst_no,
      iecNo: data.iec_no,
      fssaiNo: data.fssai_no,
      exporterAddress: data.exporter_address,
      consigneeName: data.consignee_name,
      consigneeAddress: data.consignee_address,
      preCarriageBy: data.pre_carriage_by,
      placeOfReceipt: data.place_of_receipt,
      vesselNo: data.vessel_no,
      portOfLoading: data.port_of_loading,
      portOfDischarge: data.port_of_discharge,
      finalDestination: data.final_destination,
      lutReference: data.lut_reference,
      bankName: data.bank_name,
      bankAccount: data.bank_account,
      bankIfsc: data.bank_ifsc,
      bankSwift: data.bank_swift,
      bankAddress: data.bank_address,
      products: data.products,
      totalQty: data.total_qty,
      totalValue: data.total_value,
      amountInWords: data.amount_in_words,
      declaration: data.declaration,
      netDrainedWeight: data.net_drained_weight,
      netWeight: data.net_weight,
      grossWeight: data.gross_weight,
      remarks: data.remarks
    };

    // Generate HTML
    const html = template(templateData);

    // Generate PDF
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20mm', bottom: '20mm', left: '10mm', right: '10mm' }
    });

    await browser.close();
    return pdf;
  } catch (error) {
    console.error("PDF generation error:", error);
    throw error;
  }
}

module.exports = { generateInvoicePDFPreview };
