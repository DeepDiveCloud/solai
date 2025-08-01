const API_URL = "/api/users";
const GROUP_API_URL = "/api";

document.addEventListener("DOMContentLoaded", () => {
  loadUsers();
  loadUsersForGroupAttach();
  loadGroups();
});

document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    alert(data.message || "User added successfully!");
    e.target.reset();
    loadUsers();
    loadUsersForGroupAttach();
  } catch (err) {
    alert("Error adding user: " + err.message);
  }
});

document.getElementById("refreshBtn").addEventListener("click", loadUsers);

async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    const tbody = document.getElementById("userTableBody");
    tbody.innerHTML = "";

    users.forEach(user => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.role}</td>
        <td>
          <button class="btn btn-danger btn-sm">Delete</button>
        </td>
      `;
      tr.querySelector("button").addEventListener("click", () => deleteUser(user.id));
      tbody.appendChild(tr);
    });
  } catch (err) {
    alert("Error loading users: " + err.message);
  }
}

async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error(res.statusText);
    alert("User deleted");
    loadUsers();
    loadUsersForGroupAttach();
  } catch (err) {
    alert("Error deleting user: " + err.message);
  }
}

async function loadUsersForGroupAttach() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();

    const userSelect = document.getElementById("userSelect");
    userSelect.innerHTML = '<option value="">Select User</option>';
    users.forEach(u => {
      userSelect.innerHTML += `<option value="${u.id}">${u.name}</option>`;
    });
  } catch (err) {
    console.error("Error loading users for group attach:", err);
  }
}

async function loadGroups() {
  try {
    const res = await fetch(`${GROUP_API_URL}/groups`);
    const groups = await res.json();

    const groupSelect = document.getElementById("groupSelect");
    groupSelect.innerHTML = '<option value="">Select Group</option>';
    groups.forEach(g => {
      groupSelect.innerHTML += `<option value="${g.id}">${g.name}</option>`;
    });
  } catch (err) {
    console.error("Error loading groups:", err);
  }
}

async function attachUserToGroup() {
  const userId = document.getElementById("userSelect").value;
  const groupId = document.getElementById("groupSelect").value;
  const resultP = document.getElementById("result");

  if (!userId || !groupId) {
    resultP.innerText = "Select both a user and a group.";
    return;
  }

  try {
    const res = await fetch(`${GROUP_API_URL}/user-group`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, groupId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || res.statusText);
    resultP.innerText = data.message;
    loadUserGroups(userId); // Refresh attached groups
  } catch (err) {
    resultP.innerText = "Error: " + err.message;
  }
}

async function loadUserGroups(userId) {
  const list = document.getElementById('userGroupList');
  list.innerHTML = '';

  if (!userId) return;

  try {
    const res = await fetch(`/api/user-groups/${userId}`);
    if (!res.ok) throw new Error("Failed to load user groups");

    const groups = await res.json();

    if (groups.length === 0) {
      list.innerHTML = '<li class="list-group-item text-muted">No groups assigned</li>';
      return;
    }

    groups.forEach(group => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        ${group.name}
        <button class="btn btn-sm btn-danger" onclick="removeUserGroup(${userId}, ${group.id})">Remove</button>
      `;
      list.appendChild(li);
    });
  } catch (err) {
    console.error("Error loading user groups:", err);
  }
}
async function removeUserGroup(userId, groupId) {
  if (!confirm('Are you sure you want to detach this group from the user?')) return;

  try {
    const res = await fetch(`/api/user-group/${userId}/${groupId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to remove group');
    loadUserGroups(userId); // Refresh list
  } catch (err) {
    console.error("Error removing group:", err);
    alert('Error removing group: ' + err.message);
  }
}


