const fs = require('fs');
const path = require('path');
const { generateInvoicePDFPreview } = require('./pdfGenerator');

async function testInvoiceGeneration() {
  try {
    // Load sample data
    const sampleDataPath = path.join(__dirname, '../test_data/sample_invoice.json');
    const sampleData = JSON.parse(fs.readFileSync(sampleDataPath, 'utf8'));

    // Generate PDF
    const pdf = await generateInvoicePDFPreview(sampleData);
    
    // Save PDF for verification
    const outputPath = path.join(__dirname, '../test_data/generated_invoice.pdf');
    fs.writeFileSync(outputPath, pdf);
    
    console.log(`PDF generated successfully at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating test invoice:', error);
  }
}

testInvoiceGeneration();
