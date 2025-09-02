// generate-hash.js
const bcrypt = require("bcrypt");

const password = "123456";
bcrypt.hash(password, 10).then(hash => {
  console.log("👉 Bcrypt Hash:", hash);
});
