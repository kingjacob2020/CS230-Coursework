const db = require("../db");

exports.getAllArtists = (req, res) => {
    const sql = "SELECT * FROM artists";

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve artists" });
        }

        res.json(rows);
    });
};

exports.getArtistById = (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM artists WHERE id = ?";

    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve artist" });
        }

        if (!row) {
            res.status(404).json({ error: "Artist not found" });
        }

        res.json(row);
    });
};

exports.createArtist = (req, res) => {
    const { name, genre, monthly_listeners } = req.body;

    if (!name || !genre || !monthly_listeners){
        return res.status(400).json({ 
            error: "Name, genre, and monthly listeners are required" 
        });
    }

    const sql = "INSERT INTO artists (name, genre, monthly_listeners) VALUES (?, ?, ?)";

    db.run(sql, [name, genre, monthly_listeners], function (err) {
        if (err) {
            res.status(500).json({ error: "Failed to create artist" });
        }

        res.status(201).json({
            message: "Artist created successfully",
            artist: {
                id: this.lastID,
            }
        });
    });
};

exports.updateArtist = (req, res) => {
    const { id } = req.params;
    const { name, genre, monthly_listeners } = req.body;

    db.get("SELECT * FROM artists WHERE id = ?", [id], (err, artist) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve artist" });
        }

        if (!artist) {
            res.status(404).json({ error: "Artist not found" });
        }

        const updatedName = name !== undefined ? name : artist.name;
        const updatedGenre = genre !== undefined ? genre : artist.genre;
        const updatedListeners = monthly_listeners !== undefined
            ? monthly_listeners
            : artist.monthly_listeners;

        const sql = `
            UPDATE artists
            SET name = ?, genre = ?, monthly_listeners = ?
            WHERE id = ?
        `;

        db.run(sql, [updatedName, updatedGenre, updatedListeners, id], function (err) {
            if (err) {
                res.status(500).json({ error: "Failed to update artist" });
            }
            
            res.json({
                message: "Artist updated",
                changes: this.changes,
            });
        });
    });
};

exports.deleteArtist = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM artists WHERE id = ?", [id], (err, artist) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve artist" });
        }

        if (!artist) {
            return res.status(404).json({ error: "Artist not found" });
        }

        const sql = "DELETE FROM artists WHERE id = ?";

        db.run(sql, [id], function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to delete artist" });
            }

            res.json({
                message: "Artist deleted",
                changes: this.changes,
            });
        });
    });
};