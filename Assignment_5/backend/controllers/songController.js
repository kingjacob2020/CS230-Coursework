const db = require('../db');
exports.getAllSongs = (req, res) => {
    const sql = `
        SELECT songs.*, albums.name AS album_name
        FROM songs
        LEFT JOIN albums ON songs.album_id = albums.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve songs" });
        }

        res.json(rows);
    });
};

exports.getSongById = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT songs.*, albums.name AS album_name
        FROM songs
        LEFT JOIN albums ON songs.album_id = albums.id
        WHERE songs.id = ?
    `;

    db.get(sql, [id], (err, song) => {
        if (err) {
            res.status(500).json({ error: "Failed to retrieve song" });
        }

        if (!song) {
            res.status(404).json({ error: "Song not found" });
        }

        res.json(song);
    });
};

exports.createSong = (req, res) => {
    const { name, release_year, album_id } = req.body;

    if(!name || release_year === undefined || !album_id) {
        return res.status(400).json({
            error: "Missing required fields"
        });
    }

    const sql = "INSERT INTO songs (name, release_year, album_id) VALUES (?, ?, ?)";
    db.run(sql, [name, release_year, album_id], function (err) {
            if (err) {
            res.status(500).json({ error: "Failed to create song" });
        }

        res.status(201).json({
            message: "Song created successfully",
            song: {
                id: this.lastID,
                name,
                release_year,
                album_id
            }
        });
    });
};

exports.updateSong = (req, res) => {
    const { id } = req.params;
    const { name, release_year, album_id } = req.body;

    db.get("SELECT * FROM songs WHERE id = ?", [id], (err, song) => {
        if (err) {
            return res.status(500).json({ error: "Failed to retrieve song" });
        }

        if (!song) {
            return res.status(404).json({ error: "Song not found" });
        }

        const updatedName = name !== undefined ? name : song.name;
        const updatedReleaseYear = release_year !== undefined ? release_year : song.release_year;
        const updatedAlbumId = album_id !== undefined ? album_id : song.album_id;

        const sql = "UPDATE songs SET name = ?, release_year = ?, album_id = ? WHERE id = ?";

        db.run(sql, [updatedName, updatedReleaseYear, updatedAlbumId, id], function (err) {
            if (err) {
                return res.status(500).json({ error: "Failed to update song" });
            }

            res.json({
                message: "Song updated successfully",
                changes: this.changes
            });
        });
    });
};

exports.deleteSong = (req, res) => {
    const { id } = req.params;

    db.get("select * FROM songs WHERE id = ?", [id], (err, song) => {
        if (err) {
            return res.status(500).json({ error: "Failed to delete song" });
        }

        if (!song){
            return res.status(404).json({error: "Song not found"});
        }

        db.run("Delete from songs where id = ?", [id], function (err) {
            if (err){
                return res.status(500).json({error:"failed to delete song"})
            }
        

            res.json({
                message: "song deleted",
                changes: this.changes
            });
        });
    });
};