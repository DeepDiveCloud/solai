// public/js/users.js

const API_URL = '/api/users';
const GROUP_API_URL = '/api';

// Load data on page ready
document.addEventListener('DOMContentLoaded', () => {
  loadUsers();
  loadUsersForGroupAttach();
  loadGroups();
});

// — Add User Form Submission —
document.getElementById('addUserForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    name:     document.getElementById('name').value.trim(),
    email:    document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    role:     document.getElementById('role').value
  };

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || 'User added successfully!');
    e.target.reset();
    loadUsers();
    loadUsersForGroupAttach();
  } catch (err) {
    alert('Error adding user: ' + err.message);
  }
});

// — Refresh Users Button —
document.getElementById('refreshBtn').addEventListener('click', loadUsers);

// — Fetch and Render Users List —
async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(res.statusText);
    const users = await res.json();

    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-danger btn-sm">Delete</button>
        </td>
      `;
      // Attach delete handler
      tr.querySelector('button').addEventListener('click', () => deleteUser(user.id));
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert('Error loading users: ' + err.message);
  }
}

// — Delete a User —
async function deleteUser(id) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(res.statusText);
    alert('User deleted');
    loadUsers();
    loadUsersForGroupAttach();
  } catch (err) {
    alert('Error deleting user: ' + err.message);
  }
}

// — Populate User Dropdown for Group Attachment —
async function loadUsersForGroupAttach() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error(res.statusText);
    const users = await res.json();

    const userSelect = document.getElementById('userSelect');
    userSelect.innerHTML = '<option value="">Select User</option>';
    users.forEach(u => {
      userSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });
  } catch (err) {
    console.error('Error loading users for group attach:', err);
  }
}

// — Populate Groups Dropdown —
async function loadGroups() {
    try {
      const res = await fetch(`${GROUP_API_URL}/groups`);  // resolves to /api/groups
      if (!res.ok) throw new Error(res.statusText);
      const groups = await res.json();
  
      console.log("Fetched groups:", groups);  // <— add this line to debug
  
      const groupSelect = document.getElementById("groupSelect");
      groupSelect.innerHTML = '<option value="">Select Group</option>';
      groups.forEach(g => {
        groupSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
      });
    } catch (err) {
      console.error("Error loading groups:", err);
    }
}

// — Attach User to Group —
async function attachUserToGroup() {
  const userId  = document.getElementById('userSelect').value;
  const groupId = document.getElementById('groupSelect').value;
  const resultP = document.getElementById('result');

  if (!userId || !groupId) {
    resultP.innerText = 'Please select both a user and a group.';
    return;
  }

  try {
    const res = await fetch(`${GROUP_API_URL}/user-group`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, groupId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || res.statusText);
    resultP.innerText = data.message;
  } catch (err) {
    resultP.innerText = 'Error: ' + err.message;
  }
}
