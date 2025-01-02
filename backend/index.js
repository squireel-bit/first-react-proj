import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv'; // Ensure dotenv is loaded at the top
import bodyParser from 'body-parser';

dotenv.config(); // Load environment variables

// Allow TLS certificates to be self-signed (unsafe for production)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'; 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// PostgreSQL client setup
const db = new pg.Client({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false, // Disable SSL certificate validation for self-signed certs
  },
});

db.connect().catch(err => {
  console.error('Failed to connect to the database:', err.message);
  process.exit(1); // Exit if database connection fails
});

// Routes

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM books ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching books:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get single book by ID
app.get('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching book:', err.message);
    res.status(500).send('Server Error');
  }
});

// Add a book
app.post('/api/books', async (req, res) => {
  const { title, author, cover_url, rating, notes, isbn, description } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO books (title, author, cover_url, rating, notes, isbn, description) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, author, cover_url, rating, notes, isbn, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding book:', err.message);
    res.status(500).send('Server Error');
  }
});

// Update a book's notes
app.put('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  const { notes } = req.body;
  try {
    const result = await db.query(
      'UPDATE books SET notes = $1 WHERE id = $2 RETURNING *',
      [notes, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating book:', err.message);
    res.status(500).send('Server Error');
  }
});

// Delete a book
app.delete('/api/books/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.json({ message: 'Book deleted', book: result.rows[0] });
  } catch (err) {
    console.error('Error deleting book:', err.message);
    res.status(500).send('Server Error');
  }
});

// Get book notes (optional route based on your initial code)
app.get('/api/books/:id/notes', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT notes FROM books WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Book not found');
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching book notes:', err.message);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
