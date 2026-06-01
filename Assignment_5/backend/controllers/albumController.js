const db = require('../db');

exports.getAllAlbums = (req, res) => {
    const sql = `
        SELECT albums.*, artists.name AS artist_name
        FROM albums
        LEFT JOIN artists ON albums.artist_id = artists.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve albums" });
        }

        res.json(rows);
    });
};

exports.getAlbumById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT albums.*, artists.name AS artist_name
        FROM albums
        LEFT JOIN artists ON albums.artist_id = artists.id
        WHERE albums.id = ?
    `;

    db.get(sql, [id], (err, album) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve album" });
        }

        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }

        res.json(album);
    });
};

exports.createAlbum = (req, res) => {
    const { name, release_year, listens, artist_id } = req.body;

    if (!name || release_year === undefined || listens === undefined || artist_id === undefined) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    const sql = "INSERT INTO albums (name, release_year, listens, artist_id) VALUES (?, ?, ?, ?)";

    db.run(sql, [name, release_year, listens, artist_id], function (err) {
        if (err) {
            return res.status(500).json({ error: "Failed to create album" });
        }

        res.status(201).json({
            message: "Album created successfully",
            album: {
                id: this.lastID,
                name,
                release_year,
                listens,
                artist_id
            }
        });
    });
};

exports.updateAlbum = (req, res) => {
    const { id } = req.params;
    const { name, release_year, listens, artist_id } = req.body;

    db.get("SELECT * FROM albums WHERE id = ?", [id], (err, album) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve album" });
        }

        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }

        const updatedName = name !== undefined ? name : album.name;
        const updatedReleaseYear = release_year !== undefined ? release_year : album.release_year;
        const updatedArtistId = artist_id !== undefined ? artist_id : album.artist_id;
        const updatedListens = listens !== undefined ? listens : album.listens;

        const sql = "UPDATE albums SET name = ?, release_year = ?, listens = ?, artist_id = ? WHERE id = ?";

        db.run(sql, [updatedName, updatedReleaseYear, updatedListens, updatedArtistId, id], function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to update album" });
            }

            res.json({
                message: "Album updated successfully",
                changes: this.changes
            });
        });
    });
};

exports.deleteAlbum = (req, res) => {
    const { id } = req.params;

    db.get("SELECT * FROM albums WHERE id = ?", [id], function (err, album) {
        if (err) {
            return res.status(500).json({ error: "Failed to delete album" });
        }

        if (!album) {
            return res.status(404).json({ error: "Album not found" });
        }

        db.run("DELETE FROM albums WHERE id = ?", [id], function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to delete album" });
            }

            res.json({
                message: "Album deleted successfully",
                changes: this.changes
            });
        });
    });
};