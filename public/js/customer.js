document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("customerForm");
    const tbody = document.getElementById("customerTableBody");
  
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
  
      try {
        const response = await fetch("http://localhost:5000/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
  
        if (!response.ok) {
          throw new Error("Failed to save customer");
        }
  
        form.reset(); // Clear form after success
        fetchCustomers(); // Refresh the table with new data
      } catch (error) {
        console.error("Error:", error);
        alert("Error: Failed to save customer");
      }
    });
  
    // Fetch and show customers on page load
    fetchCustomers();
  });
  
  async function fetchCustomers() {
    try {
      const res = await fetch("http://localhost:5000/api/customers");
      const data = await res.json();
      console.log("Fetched customers:", data); // ✅
  
      const tableBody = document.getElementById("customerTableBody");
      tableBody.innerHTML = "";
  
      data.forEach((cust, index) => {
        const row = `
          <tr>
          <tr data-id="${cust.id}">
            <td>${index + 1}</td>
            <td>${cust.name}</td>
            <td>${cust.address}</td>
            <td>${cust.location}</td>
            <td>${cust.phone}</td>
            <td>${cust.email}</td>
            <td>
      
        <button onclick="deleteCustomer(${cust.id})">Delete</button>
      </td>
          </tr>
        `;
        tableBody.innerHTML += row;
      });
    } catch (error) {
      console.error("❌ Fetch error:", error);
    }
  }
  

  function editCustomer(id) {
    const row = document.querySelector(`tr[data-id="${id}"]`);
    const cells = row.querySelectorAll("td");
  
    // Populate form with row data
    document.getElementById("name").value = cells[1].innerText;
    document.getElementById("address").value = cells[2].innerText;
    document.getElementById("location").value = cells[3].innerText;
    document.getElementById("phone").value = cells[4].innerText;
    document.getElementById("email").value = cells[5].innerText;
  
    // Save ID for update
    form.setAttribute("data-edit-id", id);
  }
  
  async function deleteCustomer(id) {
    if (confirm("Are you sure you want to delete this customer?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/customers/${id}`, {
          method: "DELETE",
        });
  
        if (res.ok) {
          alert("Customer deleted");
          fetchCustomers();
        } else {
          alert("Failed to delete customer");
        }
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  }
  
  