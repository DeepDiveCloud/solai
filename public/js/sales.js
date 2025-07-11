
    document.getElementById("salesForm").addEventListener("submit", function (e) {
      e.preventDefault();

      const row = document.querySelector("#tableBody tr");
      const data = {};
      row.querySelectorAll("input").forEach(input => {
        data[input.name] = input.value;
      });

      fetch("http://localhost:5000/api/sales", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      }).then(res => res.json())
        .then(res => {
          alert("Saved successfully");
        }).catch(err => {
          console.error(err);
          alert("Failed to save");
        });
    });
  