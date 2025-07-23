// public/js/production.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productionForm');
  form.addEventListener('submit', handleFormSubmit);

  document.getElementById('logoutBtnTop')
    .addEventListener('click', handleLogout);
    
  loadSummary(); // 🚀



  // Initial load
  loadProductions();
  updateLoggedInUserUI();
   // 1️⃣ Populate any existing static select in the HTML
  ['acidFields','vinegarFields','brineFields'].forEach(containerId => {
    document
      .querySelectorAll(`#${containerId} select`)
      .forEach(select => {
        const type = containerId.replace('Fields','');
        // clear out any placeholder options except the first
        while (select.options.length > 1) select.remove(1);
        // fill in our master list
        getOptionsForType(type).forEach(o => {
          const opt = new Option(o,o);
          select.add(opt);
        });
      });
  });
       // Seed one row each
  ['acidFields','vinegarFields','brineFields'].forEach(id=>{
    document.getElementById(id).innerHTML = '';
    addField(id, id.replace('Fields',''));
  });

  // Recalculate whenever any of these high‑level fields change
  ['factoryWeight','FF','soft','fungus'].forEach(id=>
    document.getElementById(id).addEventListener('input', recalcAll)
  );
});

function recalcAll(){
  calculateShortage();
  calculateProductionWeight();
}

function calculateShortage() {
  const FF     = +document.getElementById('FF').value    || 0;
  const soft   = +document.getElementById('soft').value  || 0;
  const fungus = +document.getElementById('fungus').value|| 0;

  const shortage = FF + soft + fungus;

  document.getElementById('shortage').value = shortage.toFixed(2);
}


function calculateProductionWeight(){
  const sumFields = id => Array.from(document.querySelectorAll(`#${id} input`))
    .reduce((s,i)=> s + (+i.value||0), 0);

  const total = sumFields('acidFields')
              + sumFields('vinegarFields')
              + sumFields('brineFields');

  document.getElementById('productionWeight').value = total.toFixed(2);
}

async function loadProductions(){
  try {
    const res = await fetch('/api/production');
    const rows = await res.json();
    const tbody = document.querySelector('#productionTable tbody');

    tbody.innerHTML = rows.map(r=>`
      <tr>
        <td>${r.id}</td>
        <td>${r.production_date.split('T')[0]}</td>
        <td>${r.factory_weight}</td>
        <td>${r.production_weight}</td>
        <td>${r.FF}</td>
        <td>${r.soft}</td>
        <td>${r.fungus_rotten}</td>
        <td>${r.shortage_weight_loss}</td>
        <td>${r.remark}</td>
        <td>${fmtJSON(r.aceticAcid)}</td>
        <td>${fmtJSON(r.vinegar)}</td>
        <td>${fmtJSON(r.brine)}</td>
        <td>
          <button class="btn btn-sm btn-primary" onclick="editRow(${r.id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRow(${r.id})">Delete</button>
        </td>
      </tr>
    `).join('');
  } catch(e) {
    console.error('Load error', e);
  }
}

function fmtJSON(arr){
  if(!Array.isArray(arr) || !arr.length) return '-';
  return arr.map(o=>`${o.name}: ${o.value}`).join('<br>');
}

function handleLogout(){
  localStorage.removeItem('loggedInUser');
  window.location.href = 'login.html';
}

function updateLoggedInUserUI(){
  const u = localStorage.getItem('loggedInUser');
  if(u) document.getElementById('loggedInUser').textContent = u;
}

function addField(containerId, type){
  const container = document.getElementById(containerId);
  const row = document.createElement('div');
  row.className = 'row g-2 mt-2 align-items-end';

  // dropdown
  const sel = document.createElement('select');
  sel.name = `${type}Name[]`;
  sel.className = 'form-select';
  sel.required = true;
  sel.innerHTML = `<option value="">Select ${type}</option>`;
  getOptionsForType(type).forEach(o=>{
    const opt = document.createElement('option');
    opt.value = o; opt.textContent = o;
    sel.appendChild(opt);
  });

  // numeric input
  const inp = document.createElement('input');
  inp.type = 'number';
  inp.name = 'value[]';
  inp.className = 'form-control';
  inp.placeholder = 'Value';
  inp.required = true;
  inp.min = 0;
  inp.addEventListener('input', recalcAll);

  // remove button
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-danger btn-sm';
  btn.textContent = 'Remove';
  btn.addEventListener('click', ()=>{
    row.remove();
    recalcAll();
  });

  row.appendChild(wrap('col-md-6', sel));
  row.appendChild(wrap('col-md-4', inp));
  row.appendChild(wrap('col-md-2', btn));
  container.appendChild(row);
}

function wrap(cls, el){
  const d = document.createElement('div');
  d.className = cls;
  d.appendChild(el);
  return d;
}

// central option lists
function getOptionsForType(type) {
  const options = {
    acid: [
      "A.Acid 500+",
      "A.Acid 300+",
      "A.Acid 160+",
      "A.Acid 100+",
      "A.Acid 30+",
      "A.Acid 30-",
      "A.Acid 300/450",
      "A.Acid 150/300",
      "A.Acid 120/150",
      "A.Acid 90/150",
      "A.ACID 60/160",
      "A.Acid 80/120",
      "A.ACID 60/100",
      "A.Acid 60/80",
      "A.Acid 40/60",
      "A.Acid 30/60",
      "A.Acid 20/30",
      "A.Acid 10/20",
      "A.Acid 5/10",
      "A.Acid Mixed",
      "A.Acid CN 9-12",
      "A.Acid CN 6-9",
      "A.Acid CN 3-6",
      "A.Acid CN 1-4",
      "A.Acid CN"
    ],
    vinegar: [
      "Vinegar 600+",
      "Vinegar 150+",
      "Vinegar 120+",
      "Vinegar 100+",
      "Vinegar 80+",
      "Vinegar 30+",
      "Vinegar 300/450",
      "Vinegar 150/300",
      "Vinegar 120/150",
      "Vinegar 80/150",
      "Vinegar 80/120",
      "Vinegar 60/160",
      "Vinegar 60/80",
      "Vinegar 40/60",
      "Vinegar 30/60",
      "Vinegar Mixed"
    ],
    brine: [
      "brine 300+",
      "brine 160+",
      "brine 100+",
      "brine 30+",
      "brine 30-",
      "brine 20-",
      "brine 5-",
      "brine 150/300",
      "brine 100/160",
      "brine 60/100",
      "brine 30/60",
      "brine 40/60",
      "brine 30/40",
      "brine 20/30",
      "brine 10/30",
      "brine 10/20",
      "brine 5/20",
      "brine 5/10",
      "brine 32-40in mm",
      "brine Viral",
      "brine Viral 60-",
      "brine Viral 60/160",
      "brine Mixed",
      "brine Mixing",
      "brine CN",
      "brine Blotash"
    ]
  };
  return options[type] || [];
}


async function handleFormSubmit(e){
  e.preventDefault();
  recalcAll();

  const form = e.target;
  const data = {
    productionDate: form.productionDate.value,
    factoryWeight:  +form.factoryWeight.value||0,
    productionWeight:+form.productionWeight.value||0,
    FF:  +form.FF.value||0,
    soft: +form.soft.value || 0,
    fungus: +form.fungus.value || 0,
    shortage: +form.shortage.value || 0,
    remark: form.remark.value||'',
    aceticAcid: collect('acidFields'),
    vinegar:    collect('vinegarFields'),
    brine:      collect('brineFields'),
  };

  try {
    const res = await fetch('/api/production',{
      method:'POST',
      headers:{ 'Content-Type':'application/json' },
      body:JSON.stringify(data)
    });
    const json = await res.json();
    if(!res.ok) throw new Error(json.message || 'Save failed');
    alert('Saved successfully');
    form.reset();
    ['acidFields','vinegarFields','brineFields'].forEach(id=>{
      document.getElementById(id).innerHTML='';
      addField(id,id.replace('Fields',''));
    });
    loadProductions();
  } catch(err){
    console.error('Submit error', err);
    alert(err.message);
  }
}

function collect(containerId){
  return Array.from(document.querySelectorAll(`#${containerId} .row`))
    .map(r=>{
      const name  = r.querySelector('select').value;
      const value = +r.querySelector('input').value||0;
      return name && value>0 ? { name, value } : null;
    })
    .filter(x=>x);
}

async function deleteRow(id){
  if(!confirm('Delete this entry?')) return;
  await fetch(`/api/production/${id}`,{method:'DELETE'});
  loadProductions();
}

function editRow(id){
  alert('Edit not implemented yet');
}

async function loadSummary() {
  try {
    const res = await fetch('/api/production-summary');
    const data = await res.json();

    document.getElementById('acidTotal').textContent = data.acidTotal;
    document.getElementById('vinegarTotal').textContent = data.vinegarTotal;
    document.getElementById('brineTotal').textContent = data.brineTotal;
    document.getElementById('grandTotal').textContent = data.grandTotal;

  } catch (e) {
    console.error("Summary fetch failed", e);
  }
}
