const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const fileUpload = require("express-fileupload");
const XLSX = require("xlsx");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(cors());
app.use(fileUpload());

// Verbindung zu SQLite (Datenbank nur temporär im RAM)
const db = new sqlite3.Database(":memory:", (err) => {
    if (err) console.error("Fehler bei SQLite:", err.message);
    else {
        console.log("Mit SQLite verbunden!");
        db.run(`
            CREATE TABLE invoices (
                invoiceNumber TEXT,
                date TEXT,
                customer TEXT,
                text TEXT,
                netDays INTEGER,
                dueDate TEXT,
                netAmount REAL,
                vat REAL,
                grossAmount REAL
            )
        `);
    }
});

// Hilfsfunktion: Excel-Datum in ISO-Format konvertieren
const formatDate = (serial) => {
    const excelStartDate = new Date(1899, 11, 30); // Excel-Seriendaten beginnen hier
    return new Date(excelStartDate.getTime() + serial * 86400000).toISOString().split("T")[0];
};

// API-Endpunkt: Excel-Datei hochladen und Daten verarbeiten
app.post("/import-excel", async (req, res) => {
    try {
        if (!req.files || !req.files.file) {
            return res.status(400).send("Keine Datei hochgeladen.");
        }

        const excelFile = req.files.file;
        const workbook = XLSX.read(excelFile.data, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);

        console.log("Verarbeitete Daten aus Excel:", data);

        // SQLite-Statement vorbereiten
        const insertStmt = db.prepare(`
            INSERT INTO invoices (
                invoiceNumber, date, customer, text, netDays, dueDate, netAmount, vat, grossAmount
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        // Excel-Daten verarbeiten
        data.forEach((row, index) => {
            if (!row["Rechnungsnr"] || !row["Datum"]) {
                console.log(`Zeile ${index} übersprungen (ungültige Daten):`, row);
                return;
            }

            insertStmt.run(
                row["Rechnungsnr"],
                row["Datum"],
                row["Kunde"] || "Unbekannt",
                row["Text"] || "",
                row["Nettotage"] || 0,
                row["Fälligkeit"],
                parseFloat(row["Netto"]) || 0,
                parseFloat(row["Mwst"]) || 0,
                parseFloat(row["Brutto"]) || 0
            );
        });

        insertStmt.finalize();
        res.status(200).json({ message: "Daten erfolgreich importiert", data });
    } catch (err) {
        console.error("Fehler beim Verarbeiten der Datei:", err);
        res.status(500).send("Fehler beim Verarbeiten der Datei.");
    }
});

// API-Endpunkt: Daten aus der Datenbank abrufen
app.get("/customers", (req, res) => {
    db.all("SELECT * FROM invoices", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Fehler beim Abrufen der Daten" });
        res.json(rows);
    });
});

// Test-Route
app.get("/", (req, res) => {
    res.send("Backend läuft");
});

// Server starten
app.listen(PORT, () => {
    console.log(`Backend läuft auf http://localhost:${PORT}`);
});
