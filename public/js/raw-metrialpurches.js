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
    button.parentElement.parentElement.remove();
    updateTotal();
  } else {
    alert("At least one row is required.");
  }
}

function updateTotal() {
  const amounts = document.querySelectorAll('input[name="amount[]"]');
  let total = 0;
  amounts.forEach(input => {
    total += parseFloat(input.value) || 0;
  });
  document.getElementById('totalAmount').value = total.toFixed(2);
}

document.addEventListener('input', (e) => {
  if (e.target.name === 'amount[]') updateTotal();
});

document.getElementById('purchaseForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const formData = new FormData(this);

  const products = [];
  const productInputs = document.querySelectorAll('select[name="product[]"]');
  const quantityInputs = document.querySelectorAll('input[name="quantity[]"]');
  const amountInputs = document.querySelectorAll('input[name="amount[]"]');

  for (let i = 0; i < productInputs.length; i++) {
    products.push({
      product: productInputs[i].value,
      quantity: quantityInputs[i].value,
      amount: amountInputs[i].value,
    });
  }

  const payload = {
    invoice_date: formData.get("invoice_date"),
    invoice_no: formData.get("invoice_no"),
    supplier_name: formData.get("supplier_name"),
    items: products
  };

  try {
    const res = await fetch('http://localhost:3000/api/purchase-entry', {
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
          <select name="product[]" required>
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
        <td><input type="number" name="quantity[]" required></td>
        <td><input type="number" name="amount[]" required></td>
        <td><button type="button" onclick="removeRow(this)">-</button></td>
      </tr>
    `;
    updateTotal();
  } catch (err) {
    alert('Failed to submit: ' + err.message);
  }
});