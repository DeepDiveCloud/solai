const API_URL = "http://localhost:5000/api/users";

document.addEventListener("DOMContentLoaded", loadUsers);

async function loadUsers() {
  try {
    const res = await fetch(API_URL);
    const users = await res.json();
    const table = document.getElementById("userTable");
    table.innerHTML = "";

    users.forEach((u) => {
      table.innerHTML += `
        <tr>
          <td>${u.id}</td>
          <td><input type="text" value="${u.name}" data-id="${u.id}" data-field="name" class="form-control form-control-sm"></td>
          <td><input type="email" value="${u.email}" data-id="${u.id}" data-field="email" class="form-control form-control-sm"></td>
          <td>
            <select data-id="${u.id}" data-field="role" class="form-select form-select-sm">
              <option ${u.role === "Admin" ? "selected" : ""}>Admin</option>
              <option ${u.role === "User" ? "selected" : ""}>User</option>
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-success" onclick="updateUser(${u.id})">Save</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${u.id})">Delete</button>
          </td>
        </tr>`;
    });
  } catch (err) {
    console.error("Error loading users:", err);
  }
}

// Add User
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role }),
  });

  e.target.reset();
  loadUsers();
});

// Update User
async function updateUser(id) {
  const name = document.querySelector(`[data-id='${id}'][data-field='name']`).value;
  const email = document.querySelector(`[data-id='${id}'][data-field='email']`).value;
  const role = document.querySelector(`[data-id='${id}'][data-field='role']`).value;

  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, role }),
  });

  loadUsers();
}

// Delete User
async function deleteUser(id) {
  if (!confirm("Delete this user?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  loadUsers();
}
