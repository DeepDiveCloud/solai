// Auto calculate totalAmount on input
document.addEventListener("input", function (e) {
    if (e.target.name === "quantity[]" || e.target.name === "amount[]") {
        const row = e.target.closest("tr");
        const qty = parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
        const rate = parseFloat(row.querySelector('input[name="amount[]"]').value) || 0;
        row.querySelector('input[name="totalAmount[]"]').value = (qty * rate).toFixed(2);
    }
});

function addRow() {
    const tableBody = document.querySelector("#productTable tbody");
    const newRow = tableBody.rows[0].cloneNode(true);

    newRow.querySelectorAll("input, select").forEach(input => {
        input.value = "";
    });

    tableBody.appendChild(newRow);
}

function removeRow(button) {
    const tableBody = document.querySelector("#productTable tbody");
    if (tableBody.rows.length > 1) {
        button.closest("tr").remove();
    }
}

document.getElementById("purchaseForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const invoice_date = form.invoice_date.value;
    const invoice_no = form.invoice_no.value;
    const supplier_name = form.supplier_name.value;

    const product = Array.from(form.querySelectorAll('select[name="product[]"]')).map(el => el.value);
    const quantity = Array.from(form.querySelectorAll('input[name="quantity[]"]')).map(el => el.value);
    const amount = Array.from(form.querySelectorAll('input[name="amount[]"]')).map(el => el.value);
    const totalAmount = Array.from(form.querySelectorAll('input[name="totalAmount[]"]')).map(el => el.value);

    const payload = {
        invoice_date,
        invoice_no,
        supplier_name,
        product,
        quantity,
        amount,
        totalAmount
    };

    fetch("/api/raw-material", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert("Data saved successfully!");
            form.reset();
            const tableBody = document.querySelector("#productTable tbody");
            while (tableBody.rows.length > 1) tableBody.deleteRow(1);
        } else {
            alert("Error: " + (data.error || "Unknown error"));
        }
    })
    .catch(err => {
        console.error("Submit Error:", err);
        alert("Submission failed. Check console for details.");
    });
});
async function fetchRawMaterialData() {
  try {
    const response = await fetch("/api/raw-material");
    const data = await response.json();

    const tableBody = document.querySelector("#rawMaterialTable tbody");
    if (!tableBody) {
      console.error("Table body not found!");
      return;
    }

    tableBody.innerHTML = ""; // Clear existing rows

    data.forEach(item => {
      const row = document.createElement("tr");

      // ✅ Format date to show only YYYY-MM-DD
      const formattedDate = new Date(item.invoice_date).toISOString().split("T")[0];

      row.innerHTML = `
        <td>${formattedDate}</td>
        <td>${item.invoice_no}</td>
        <td>${item.supplier_name}</td>
        <td>${item.product}</td>
        <td>${parseFloat(item.quantity).toFixed(2)}</td>
        <td>${parseFloat(item.rate).toFixed(2)}</td>
        <td>${parseFloat(item.total_amount).toFixed(2)}</td>
      `;

      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error("Data Fetch Error:", err);
  }
}


document.addEventListener("DOMContentLoaded", fetchRawMaterialData);
