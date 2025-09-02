const API_URL = '/api/groups';
const token = localStorage.getItem('token');
const headers = {
  'Content-Type': 'application/json',
  ...(token && { Authorization: 'Bearer ' + token })
};

document.addEventListener('DOMContentLoaded', () => {
  loadGroups();
});

document.getElementById('addGroupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('groupName').value.trim();
  const assigned_url = document.getElementById('assignedUrl').value.trim();

  if (!name || !assigned_url) {
    alert('Both Group Name and Assigned URL are required.');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, assigned_url }),
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message || 'Group created successfully!');
      e.target.reset();
      loadGroups();
    } else {
      alert(data.error || 'Failed to create group');
    }
  } catch (err) {
    alert('Error adding group: ' + err.message);
  }
});

async function loadGroups() {
  try {
    const res = await fetch(API_URL, { headers });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to load groups');
    }
    const groups = await res.json();

    const tbody = document.getElementById('groupsTableBody');
    tbody.innerHTML = '';

    groups.forEach((group) => {
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.textContent = group.id;
      tr.appendChild(tdId);

      const tdName = document.createElement('td');
      tdName.textContent = group.name;
      tr.appendChild(tdName);

      const tdUrl = document.createElement('td');
      tdUrl.textContent = group.assigned_url || 'No URL assigned';
      tr.appendChild(tdUrl);

      const tdActions = document.createElement('td');
      const btn = document.createElement('button');
      btn.className = 'btn btn-danger btn-sm';
      btn.textContent = 'Delete';
      btn.addEventListener('click', () => deleteGroup(group.id));
      tdActions.appendChild(btn);
      tr.appendChild(tdActions);

      tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Error loading groups: ' + err.message);
  }
}

async function deleteGroup(id) {
  if (!confirm('Are you sure you want to delete this group?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers,
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Failed to delete group');

    alert(data.message || 'Group deleted');
    loadGroups();
  } catch (err) {
    alert('Error deleting group: ' + err.message);
  }
}
