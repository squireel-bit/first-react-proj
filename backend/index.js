import express from 'express';
import cors from 'cors';
import pg from 'pg';
import env from "dotenv";
import bodyParser from "body-parser";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
env.config();
app.use(bodyParser.json());



const db = new pg.Client(({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, 
  },});
db.connect();

// Routes

// Get all books

app.get('/api/books', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");

    }
});

/// Get single book by id

app.get('/api/books/:id', async (req, res) => {

    const { id } = req.params;

    try {
        const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }

        res.json(result.rows[0]);


    } catch (err) {
        console.error('Error', err.message);
        res.status(500).send("Server Error");

    }

});


/// Add a book

app.post('/api/books', async (req, res) => {

    const { title, author, cover_url, rating, notes, isbn, description } = req.body;

    try {

        const result = await db.query('INSERT INTO books (title, author, cover_url, rating, notes, isbn, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [title, author, cover_url, rating, notes, isbn, description]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error', err.message);
        res.status(500).send("Server Error");
    }

});

/// Update a book

app.put('/api/books/:id', async (req, res) => {

    const { id } = req.params;
    const { notes } = req.body;

    try {

        const result = await db.query('UPDATE books SET notes = $1 WHERE id = $2 RETURNING *', [notes, id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        } res.json(result.rows[0]);


    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");

    }
});


/// Delete a book

app.delete('/api/books/:id', async (req, res) => {


    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }
        res.json({ message: 'Book deleted', book: result.rows[0] });

    } catch (err) {
        console.err(err.message);
        res.status(500).send("Server Error");

    }

});

app.get("/api/books/:id/notes", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }

});





app.listen(PORT, (req, res) => {
    console.log(`Server is running on PORT ${PORT}`);

});
