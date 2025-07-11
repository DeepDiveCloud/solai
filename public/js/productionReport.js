// productionReport.js

// 1️⃣ When the form is submitted, fetch both the detailed rows and the filtered totals
document.getElementById('filterForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fromDate = document.getElementById('fromDate').value;
  const toDate   = document.getElementById('toDate').value;
  const acid     = document.getElementById('acidFilter').value;
  const vinegar  = document.getElementById('vinegarFilter').value;
  const brine    = document.getElementById('brineFilter').value;

 // if (!fromDate || !toDate) {
 //   return alert("Please select both From and To dates.");
  //}//

  // build one query‑string for both calls
  const params = new URLSearchParams({ from: fromDate, to: toDate, acid, vinegar, brine });

  try {
    // Fetch the **table** data
    let res = await fetch(`/api/production?${params}`);
    if (!res.ok) throw new Error("Failed to load production rows");
    const rows = await res.json();
    console.log("Production rows:", rows);
    populateTable(rows);

    // Fetch the **totals**
    res = await fetch(`/api/production/acid-vinegar-summary?${params}`);
    if (!res.ok) throw new Error("Failed to load summary");
    const summary = await res.json();
    console.log("Summary:", summary);
    renderSummary(summary);

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
});


// 2️⃣ Draw the table
function populateTable(rows) {
  const tbody = document.querySelector('#reportTable tbody');
  const tableContainer = document.getElementById('tableContainer');

  if (!rows || rows.length === 0) {
    tableContainer.style.display = "none"; // 🔒 HIDE table
    return;
  }

  tbody.innerHTML = rows.map(r => `
    <tr>
      <td>${r.id}</td>
      <td>${r.production_date.split('T')[0]}</td>
      <td>${r.factory_weight}</td>
      <td>${r.production_weight}</td>
      <td>${formatJSON(r.acetic_acid)}</td>
      <td>${formatJSON(r.vinegar)}</td>
      <td>${formatJSON(r.brine)}</td>
    </tr>
  `).join('');

  tableContainer.style.display = "none"; // ✅ SHOW table
}


function formatJSON(j) {
  try {
    const arr = typeof j === 'string' ? JSON.parse(j) : j;
    if (!Array.isArray(arr) || arr.length === 0) return '-';
    return arr.map(i => `${i.name}: ${i.value}`).join('<br>');
  } catch {
    return '-';
  }
}


// 3️⃣ Draw the totals
function renderSummary({ acidTotal=0, vinegarTotal=0, brineTotal=0 }) {
  document.getElementById("acidTotal").innerText    = acidTotal.toLocaleString();
  document.getElementById("vinegarTotal").innerText = vinegarTotal.toLocaleString();
  document.getElementById("brineTotal").innerText   = brineTotal.toLocaleString();
  document.getElementById("totalStock").innerText   = 
    (acidTotal + vinegarTotal + brineTotal).toLocaleString();
}


// 4️⃣ Automatically refilter when any input changes
["fromDate","toDate","acidFilter","vinegarFilter","brineFilter"]
  .forEach(id => document.getElementById(id)
    .addEventListener("change", () => document.getElementById('filterForm').dispatchEvent(new Event('submit')))
  );
document.getElementById("downloadExcel").addEventListener("click", () => {
  const params = new URLSearchParams({
    from: document.getElementById("fromDate").value,
    to: document.getElementById("toDate").value,
    acid: document.getElementById("acidFilter").value,
    vinegar: document.getElementById("vinegarFilter").value,
    brine: document.getElementById("brineFilter").value,
  });

  window.location.href = `/api/production/export?${params}`;
});
