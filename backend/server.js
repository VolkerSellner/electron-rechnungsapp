const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());

// Verbindung zu SQLite (Datenbank nur temporär im RAM)
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) console.error("Fehler bei SQLite:", err.message);
    else console.log("Mit SQLite verbunden!");
    db.run(`
        CREATE TABLE customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            email TEXT
        )
    `);
});

// API-Endpunkt: Kunden aus der Datenbank abrufen
app.get("/customers", (req, res) => {
    db.all("SELECT * FROM customers", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Kunden" });
        res.json(rows);
    });
});

// API-Endpunkt: Kunden hinzufügen
app.post("/customers", (req, res) => {
    const { firstName, lastName, email } = req.body;
    db.run("INSERT INTO customers (firstName, lastName, email) VALUES (?, ?, ?)", [firstName, lastName, email], function (err) {
        if (err) return res.status(500).send("Fehler beim Speichern des Kunden.");
        res.json({ id: this.lastID, firstName, lastName, email });
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Backend läuft auf http://localhost:${PORT}`);
});
