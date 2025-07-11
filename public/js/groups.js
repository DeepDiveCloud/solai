const API_URL = '/api/groups';

// Load data on page ready
document.addEventListener('DOMContentLoaded', () => {
  loadGroups();
});

// Add Group Form Submission
document.getElementById('addGroupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('groupName').value.trim();
  const assigned_url = document.getElementById('assignedUrl').value.trim();

  // Debug: log what we're about to send
  console.log('Submitting:', { name, assigned_url });

  if (!name || !assigned_url) {
    alert('Both Group Name and Assigned URL are required.');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, assigned_url })
    });

    const data = await res.json();
    console.log('Server response:', data);

    if (res.ok) {
      alert(data.message || 'Group created successfully!');
      e.target.reset();
      loadGroups();
    } else {
      console.error('Error response:', data);
      alert(data.error || 'Failed to create group');
    }
  } catch (err) {
    console.error('Error submitting form:', err);
    alert('Error adding group: ' + err.message);
  }
});

// Fetch and Render Groups List
async function loadGroups() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Failed to load groups');
      }
  
      const groups = data;
      const tbody = document.getElementById('groupsTableBody');
      tbody.innerHTML = ''; // Clear current content
  
      groups.forEach(group => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${group.id}</td>
          <td>${group.name}</td>
          <td>${group.assigned_url || 'No URL assigned'}</td>  <!-- Ensure assigned_url is displayed -->
          <td>
            <button class="btn btn-danger btn-sm" onclick="deleteGroup(${group.id})">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error loading groups:', err);
      alert('Error loading groups: ' + err.message);
    }
  }
  

// Delete Group
async function deleteGroup(id) {
  if (!confirm('Are you sure you want to delete this group?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    console.log('Delete response:', data);

    if (!res.ok) throw new Error(data.error || 'Failed to delete group');

    alert(data.message || 'Group deleted');
    loadGroups();
  } catch (err) {
    console.error('Error deleting group:', err);
    alert('Error deleting group: ' + err.message);
  }
}
