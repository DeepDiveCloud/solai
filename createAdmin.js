const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "solai"
});

const email = "admin@example.com";
const password = "admin123";

bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }

    db.query("INSERT INTO users (email, password, role) VALUES (?, ?, 'admin')", [email, hash], (error, results) => {
        if (error) {
            console.error("Error inserting user:", error);
        } else {
            console.log("Admin user created successfully!");
        }
        db.end();
    });
});
