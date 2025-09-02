const bcrypt = require("bcrypt");

(async () => {
  const password = "Dark@220"; // plain password
  const hashed = await bcrypt.hash(password, 10);
  console.log("Hashed:", hashed);
})();
