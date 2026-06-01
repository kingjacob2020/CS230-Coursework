const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, 'data');
const dbPath = path.join(dataDir, 'app.db');
const modelPath = path.join(__dirname, 'model.sql');

if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("Failed to connect to database:", err);
    } else {
        console.log("Connected to SQLite database.");
        initializeDatabase();
    }
});

function initializeDatabase() {
    const modelSQL = fs.readFileSync(modelPath, 'utf-8');

    db.serialize(() => {
        db.run("PRAGMA foreign_keys = ON");

        db.exec(modelSQL, (err) => {
            if (err) {
                console.error("Failed to initialize database:", err);
            } else {
                console.log("Database initialized successfully.");
            }
        });
    });
}

module.exports = db;