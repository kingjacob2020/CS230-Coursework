//backend book management
//lecture 7 and 8 Express and SQLite

//lecture 7 - express setup
const express = require("express");

//lecture 8 - sqlite 
const sqlite3 = require("sqlite3").verbose();

const app = express();
const port = 3000;

//lecture 7 - parse json bodies
app.use(express.json());

//lecture 8 - connect to database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  }
  else {
    console.log("Connected to the SQLite database.");
  }
});

//create books tables
db.run(`CREATE TABLE IF NOT EXISTS books (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  year INTEGER,
  status TEXT NOT NULL CHECK(status IN ('to-read', 'reading', 'completed'))
)`
, (err) => {
  if (err) {
    console.error("Error creating table:", err.message);
  }
  else {
    console.log("Books table ready");
  }
}
);

//lecture 6 - basic route
app.get("/", (req, res) => {
  res.send("Server running...");
});

//lecture 6/8 -- get all books and filter by status
app.get("/books", (req, res) => {
    const status = req.query.status;
    const allowedStatuses = ["to-read", "reading", "completed"];

    if(status) {
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: "Invalid status value" });
        }


        const sql = "SELECT * FROM books WHERE status = ?";
        db.all(sql, [status], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } else {
        const sql = "SELECT * FROM books";
        db.all(sql, [], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    }
});


//lecture 6/8 -- get book by id
app.get("/books/:id", (req, res) => {
    const sql = "SELECT * FROM books WHERE id = ?";
    const id = req.params.id;

    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        } else if (!row) {
            return res.status(404).json({ error: "Book not found" });
        } else {
            res.json(row);
        }
    });
});

//lecture 7/8 -- add new book
app.post("/books", (req, res) => {
    const { title, author, year, status } = req.body;

    if (!title || !author || !status) {
        return res.status(400).json({ error: "Title, author, and status are required" });
    }

    const allowedStatuses = ["to-read", "reading", "completed"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    //lecture 8 - insert books into database
    const sql = "INSERT INTO books (title, author, year, status) VALUES";
    db.run(sql, [title, author, year || null, status], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            message: "Book added",
            id: this.lastID
        });
    });
});

//lecture 7/8 update books
app.put("/books/:id", (req, res) => {
    const id = req.params.id;
    const { title, year, status } = req.body;

    const allowedStatuses = ["to-read", "reading", "completed"];
    if (status && !allowedStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
    }

    //check if book exists
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        
        }
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }


        ///updating fields
        const updatedTitle = title !== undefined ? title : book.title;
        const updatedYear = year !== undefined ? year : book.year;
        const updatedStatus = status !== undefined ? status : book.status;

        //lecture 8 -- update
        const sql = "UPDATE books SET title = ?, year = ?, status = ? WHERE id = ?";
        db.run(sql, [updatedTitle, updatedYear, updatedStatus, id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Book updated", changes: this.changes });
        });
    });
});


//lecture 7/8 -- delete book
app.delete("/books/:id", (req, res) => {
    const id = req.params.id;

    //check if book exists
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!book) {
            return res.status(404).json({ error: "Book not found" });
        }

        //lecture 8 -- delete
        const sql = "DELETE FROM books WHERE id = ?";
        db.run(sql, [id], function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({ message: "Book deleted", changes: this.changes });
        });
    });
});


//lecture 7 - start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

