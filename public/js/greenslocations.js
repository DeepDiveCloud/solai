async function fetchGreensLocations() {
  try {
    const res = await fetch('/api/greens-locations');
    const data = await res.json();

    if (!Array.isArray(data)) {
      throw new Error(data.error || 'Unexpected response');
    }

    const table = document.getElementById('greensLocationTableBody');
    table.innerHTML = '';
    data.forEach(loc => {
      const row = `
        <tr>
          <td>${loc.name}</td>
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteGreensLocation(${loc.id})">Delete</button>
          </td>
        </tr>`;
      table.innerHTML += row;
    });

    document.getElementById('greensLocationCount').textContent = data.length;

  } catch (err) {
    console.error('Failed to fetch greens locations:', err);
    alert('Error loading greens locations. Check console.');
  }
}

async function deleteGreensLocation(id) {
  try {
    await fetch(`/api/greens-locations/${id}`, { method: 'DELETE' });
    fetchGreensLocations();
  } catch (err) {
    console.error('Delete error:', err);
    alert('Failed to delete greens location.');
  }
}

document.getElementById('greensLocationForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = document.getElementById('greensLocationName').value.trim();
  if (name) {
    try {
      await fetch('/api/greens-locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      document.getElementById('greensLocationName').value = '';
      fetchGreensLocations();
    } catch (err) {
      console.error('Add greens location failed:', err);
      alert('Failed to add greens location.');
    }
  }
});

window.onload = fetchGreensLocations;
