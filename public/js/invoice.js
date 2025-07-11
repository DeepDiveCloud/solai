// Initialize page
document.addEventListener("DOMContentLoaded", () => {
    const addProductBtn = document.getElementById('addProductBtn');
    if (addProductBtn) addProductBtn.addEventListener('click', addProduct);
  
    const addContainerBtn = document.getElementById('addContainerBtn');
    if (addContainerBtn) addContainerBtn.addEventListener('click', addContainer);
  
    const form = document.getElementById('invoiceForm');
    if (form) form.addEventListener('submit', submitForm);
  
    const previewBtn = document.getElementById("previewBtn");
    if (previewBtn) previewBtn.addEventListener("click", previewPDF);
  
    attachTotalCalculator();
    triggerInitialInputEvents?.();
  });
  
  
  
  
  
  

  
  
  // Add new container row
 function addContainer() {
  const container = document.getElementById('containers');
  const entry = container.querySelector('.container-entry').cloneNode(true);
  entry.querySelectorAll('input').forEach(el => el.value = '');
  addRemoveButton(entry); // ✅ Add remove button
  container.insertBefore(entry, container.lastElementChild);
}
function addProduct() {
    const productsContainer = document.getElementById('products');
    const entry = productsContainer.querySelector('.product-entry').cloneNode(true);
    entry.querySelectorAll('input').forEach(el => el.value = '');
    addRemoveButton(entry); // ✅ correct reference
    productsContainer.insertBefore(entry, productsContainer.lastElementChild); // ✅
    attachTotalCalculator(entry); // ✅ pass new entry to calculator
}

  
  
function attachTotalCalculator() {
    const productEntries = document.querySelectorAll('.product-entry');
  
    productEntries.forEach(entry => {
      const weightInput = entry.querySelector('[name="drum_weight[]"]');
      const drumInput = entry.querySelector('[name="drums[]"]');
      const priceInput = entry.querySelector('[name="price_per_kg[]"]');
      const quantityKg = entry.querySelector('[name="quantity_kg[]"]');
      const totalValue = entry.querySelector('[name="total_value_usd[]"]');
  
      function calculate() {
        const weight = parseFloat(weightInput.value) || 0;
        const drums = parseFloat(drumInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
  
        const qty = weight * drums;
        const value = qty * price;
  
        quantityKg.value = qty.toFixed(2);
        totalValue.value = value.toFixed(2);
      }
  
      [weightInput, drumInput, priceInput].forEach(input => {
        input.addEventListener('input', calculate);
      });
    });
  }
  
  attachTotalCalculator();
  
  
  
   

  function addRemoveButton(entry) {
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "Remove";
    removeBtn.className = "btn btn-danger btn-sm mt-2";
    removeBtn.onclick = () => entry.remove();
    entry.appendChild(removeBtn);
  }
  



  // Submit form to backend
  function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById('invoiceForm');
  
    if (!form.checkValidity()) {
      alert("Please fill all required fields.");
      return;
    }
  
    const formData = new FormData(form);
    fetch("/api/export-invoice/pdf/preview", {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        alert("Invoice saved successfully!");
        form.reset();
      })
      .catch(err => {
        console.error(err);
        alert("Error saving invoice.");
      });
  }
  //
  async function previewPDF(event) {
    if (event) event.preventDefault();
    const previewBtn = event.target;
    previewBtn.disabled = true;
    previewBtn.textContent = "Generating PDF...";
  
    const form = document.getElementById("invoiceForm");
    const formData = new FormData(form);
  
    try {
      const response = await fetch("http://localhost:5000/api/export-invoice/pdf/preview", {
        method: "POST",
        body: formData
      });
  
      if (!response.ok) throw new Error("Failed to generate PDF.");
  
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      alert("Error generating PDF.");
    } finally {
      previewBtn.disabled = false;
      previewBtn.textContent = "Preview PDF";
    }
  }
  
  
  
  
  
  // Exporter autofill
  const exporterData = {
    "M/S. SOLAI AGRO FRESH PRIVATE LIMITED": {
      gst: "33ABHCS1429E1ZN",
      iec: "ABHCS1429E",
      address: "Sy. No. 225/3, 225/4, Behuvalli Village, Palacode SRO, Palacode Taluk, Dharmapuri/ Tamil Nadu - 636 808. Regd. Off.: No.11, Valliyammai Nagar, Nerkundram, Chennai- 600 092. Tamil Nadu/ India."
    },
  };
  
  document.getElementById("exporter_name").addEventListener("change", function () {
    const selected = this.value;
    const data = exporterData[selected] || {};
    document.getElementById("gst_no").value = data.gst || "";
    document.getElementById("iec_no").value = data.iec || "";
    document.getElementById("exporter_address").value = data.address || "";
  });
  
  // Consignee autofill
  const consigneeData = {
    "Marcatus QED Inc": {
      address: "43 Hanna Avenue, Unit C-424, Toronto, ON, M6K 1X1, Canada. Tel No: +1 (905) 337 - 1105 x229",
      notify1_name: "Willson International ",
      notify1_address: "160 Wales Ave #100 Tonawanda, NY 14150 UNITED STATES OF AMERICA. E mail ID: usairocean@willsonintl.com, Toll Free: 1-800-315-1918 , Telephone: +1 716-260-158",
      pre_carriage: "ROAD/RAIL",
      place_of_receipt: "TUTICORIN,chenai,ennor",
      port_of_loading: "TUTICORIN,chenai,ennor",
      vessel_no: "BY SEA",
      port_of_discharge: "Port of Hamburg",
      final_destination: "test"
    },
    "MONTROSE INTERNATIONAL GROUP": {
      address: "(DIV OF MIG HOLDINGS INC.) 156 REYNOLDS STREET, OAKVILLE, ONTARIO L6J 3K9,CANADA. TELE : 905 339 0229 / FAX: 905 339 0576",
      notify1_name: "MONTROSE INTERNATIONAL GROUP",
      notify1_address: "C/O.SAPIDUS CORPORATION 45 LONGWOOD AVE, SUITE 506 BROOKLINE, MA 02446 U.S.A. Tel# 905-339-0229 Fax: 905-339-0576",
      pre_carriage: "ROAD/RAIL",
      place_of_receipt: "TUTICORIN,chenai,ennor",
      port_of_loading: "TUTICORIN,chenai,ennor",
      vessel_no: "BY SEA",
      port_of_discharge: "Port of Rotterdam",
      final_destination: "ranid"
    },
    "REITZEL BRIAND": {
      address: "2, Chemin du Poliveau Bourre 41400 Montrichard Val de Cher, France. Tel.: +33(0)2.54.71.66.05",
      notify1_name: "REITZEL BRIAND",
      notify1_address: "2, Chemin du Poliveau Bourre 41400 Montrichard Val de Cher, France. Tel.: +33(0)2.54.71.66.05",
      notify2_name: "COFREMAR",
      notify2_address: "74 Rue Dumontd'urville, 76600 Le Havre, France. Tel : +33(0)232720131",
      pre_carriage: "ROAD/RAIL",
      place_of_receipt: "TUTICORIN,chenai,ennor",
      port_of_loading: "TUTICORIN,chenai,ennor",
      vessel_no: "BY SEA",
      port_of_discharge: "Port of Marseille",
      final_destination: "test"
    },
  };
  
  const consigneeSelect = document.getElementById("consignee_name");
  const addressField = document.getElementById("consignee_address");
  const notify1Name = document.getElementById("notify1_name");
  const notify1Address = document.getElementById("notify1_address");
  const notify2Name = document.getElementById("notify2_name");
  const notify2Address = document.getElementById("notify2_address");
  const notify2NameField = notify2Name.closest(".col-md-6");
  const notify2AddressField = notify2Address.closest(".col-md-6");
  
  const preCarriage = document.getElementById("pre_carriage_by");
  const placeReceipt = document.getElementById("place_of_receipt");
  const portLoading = document.getElementById("port_of_loading");
  const vessel = document.getElementById("vessel_no");
  const portDischarge = document.getElementById("port_of_discharge");
  const finaldestination = document.getElementById("final_destination");
  
  consigneeSelect.addEventListener("change", function () {
    const selected = this.value;
    const data = consigneeData[selected] || {};
  
    addressField.value = data.address || "";
    notify1Name.value = data.notify1_name || "";
    notify1Address.value = data.notify1_address || "";
  
    if (data.notify2_name && data.notify2_address) {
      notify2Name.value = data.notify2_name;
      notify2Address.value = data.notify2_address;
      notify2NameField.style.display = "block";
      notify2AddressField.style.display = "block";
    } else {
      notify2Name.value = "";
      notify2Address.value = "";
      notify2NameField.style.display = "none";
      notify2AddressField.style.display = "none";
    }
  
    preCarriage.value = data.pre_carriage || "";
    placeReceipt.value = data.place_of_receipt || "";
    portLoading.value = data.port_of_loading || "";
    vessel.value = data.vessel_no || "";
    portDischarge.value = data.port_of_discharge || "";
    finaldestination.value = data.final_destination || "";
  });
  
  
  
  
  
  
  
  