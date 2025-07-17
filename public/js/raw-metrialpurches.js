
function addRow() {
  const row = document.querySelector('#productTable tbody tr');
  const clone = row.cloneNode(true);
  clone.querySelectorAll('input, select').forEach(el => el.value = '');
  document.querySelector('#productTable tbody').appendChild(clone);
  updateTotal();
}

function removeRow(button) {
  const rows = document.querySelectorAll('#productTable tbody tr');
  if (rows.length > 1) {
    button.closest('tr').remove();
    updateTotal();
  } else {
    alert("At least one row is required.");
  }
}

function updateTotal() {
  const rows = document.querySelectorAll('#productTable tbody tr');
  let grandTotal = 0;

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector('input[name="quantity[]"]').value) || 0;
    const rate = parseFloat(row.querySelector('input[name="rate[]"]').value) || 0;
    const rowTotal = qty * rate;
    row.querySelector('input[name="row_total[]"]').value = rowTotal.toFixed(2);
    grandTotal += rowTotal;
  });

  document.getElementById('totalAmount').value = grandTotal.toFixed(2);
}

// Recalculate total on input change
document.addEventListener('input', (e) => {
  if (e.target.name === 'rate[]' || e.target.name === 'quantity[]') updateTotal();
});

document.getElementById('purchaseForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const products = [];
  const productInputs = document.querySelectorAll('select[name="product[]"]');
  const quantityInputs = document.querySelectorAll('input[name="quantity[]"]');
  const rateInputs = document.querySelectorAll('input[name="rate[]"]');

  for (let i = 0; i < productInputs.length; i++) {
    const product = productInputs[i].value;
    const qty = quantityInputs[i].value;
    const rate = rateInputs[i].value;

    if (!product || !qty || !rate) {
      alert(`Please fill all fields for row ${i + 1}`);
      return;
    }

    products.push({
      product,
      quantity: qty,
      rate: rate
    });
  }

  const payload = {
    invoice_date: formData.get("invoice_date"),
    invoice_no: formData.get("invoice_no"),
    supplier_name: formData.get("supplier_name"),
    items: products
  };

  const submitBtn = this.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Saving...';

  try {
    const res = await fetch('http://localhost:5000/api/purchase-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || 'Server error');

    alert(result.message || 'Purchase entry saved!');
    this.reset();

    const tbody = document.querySelector('#productTable tbody');
    tbody.innerHTML = `
      <tr>
        <td>
          <select name="product[]" required class="form-control">
            <option value="">-- Select Material --</option>
            <option value="Natural Vinegar">Natural Vinegar</option>
            <option value="Crystal Salt">Crystal Salt</option>
            <option value="240L Barrels">240L Barrels</option>
            <option value="260L Barrels">260L Barrels</option>
            <option value="Pallet">Pallet</option>
            <option value="Plywood">Plywood</option>
            <option value="Acetic Acid">Acetic Acid</option>
            <option value="Calcium Chloride">Calcium Chloride</option>
            <option value="KMS">KMS</option>
            <option value="Lactic Acid">Lactic Acid</option>
          </select>
        </td>
        <td><input type="number" name="quantity[]" required class="form-control"></td>
        <td><input type="number" name="rate[]" required class="form-control"></td>
        <td><input type="text" name="row_total[]" readonly class="form-control bg-light"></td>
        <td><button type="button" onclick="removeRow(this)" class="btn btn-danger btn-sm">-</button></td>
      </tr>
    `;
    updateTotal();

  } catch (err) {
    alert('Failed to submit: ' + err.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});
