const fs = require('fs');
const path = require('path');
const { generateInvoicePDFPreview } = require('./pdfGenerator');

// Sample invoice data matching Excel upload format
const testData = {
  invoice_number: 'SAF-122/2024-25',
  invoice_date: '24.03.2025',
  buyers_order: 'PO-12345',
  origin_country: 'India',
  exporter_name: 'SOLAI AGRO FRESH PRIVATE LIMITED',
  gst_no: '33ABHCS1429E1ZN',
  iec_no: 'ABHCS1429E',
  exporter_address: 'Sy. No. 225/3, 225/4, Behuvalli Village, Dharmapuri, Tamil Nadu',
  consignee_name: 'MONTROSE INTERNATIONAL GROUP',
  consignee_address: '156 REYNOLDS STREET, OAKVILLE, ONTARIO L6J 3K9, CANADA',
  description: [
    '60/100 in Brine (240 Drums x 180 Kgs = 43,200 kgs.)',
    'Organic Dried Product (100 Drums x 150 Kgs = 15,000 kgs.)'
  ],
  hs_code: ['07114000', '07129000'],
  quantity_kg: [43200, 15000],
  price_per_kg: [0.83, 1.25],
  total_value_usd: [35856, 18750],
  total_qty: 58200,
  total_value: 54606,
  amount_in_words: 'DOLLAR FIFTY FOUR THOUSAND SIX HUNDRED SIX ONLY',
  net_drained_weight: '43,200',
  net_weight: '60,600',
  gross_weight: '63,300',
  declaration: 'We declare that this invoice shows the actual price of the goods',
  remarks: 'Shipment by sea',
  pre_carriage_by: 'TRUCK',
  place_of_receipt: 'CHENNAI PORT',
  vessel_no: 'MAERSK HONG KONG V.1234',
  port_of_loading: 'CHENNAI, INDIA',
  port_of_discharge: 'NEW YORK, USA',
  final_destination: 'DETROIT, MI, USA',
  vehicle_no: ['TN21 AB 1234', 'TN21 CD 5678'],
  container_no: ['MSKU 1234567', 'MSKU 7654321'],
  rfid_seal_no: ['RFID12345', 'RFID54321'],
  liner_seal_no: ['LINE12345', 'LINE54321'],
  logoPath: 'file:///C:/Users/Dark Angle/3D Objects/projest time line/max 12-15 am 4-3/public/images/solai logo.png',
  phoneNumber: '+91 9876543210',
  email: 'exports@solaiagrofresh.com',
  website: 'www.solaiagroexports.com'
};

// Generate and save test PDF
(async () => {
  try {
    console.log('Generating test PDF...');
    const pdf = await generateInvoicePDFPreview(testData);
    
    const outputPath = path.join(__dirname, 'test_invoice.pdf');
    fs.writeFileSync(outputPath, pdf);
    
    console.log(`Test PDF generated successfully at: ${outputPath}`);
  } catch (error) {
    console.error('Error generating test PDF:', error);
  }
})();
