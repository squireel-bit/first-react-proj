import express from 'express';
import cors from 'cors';
import pg from 'pg';
import env from "dotenv";
import bodyParser from "body-parser";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'https://first-react-proj-kappa.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
env.config();
app.use(bodyParser.json());



const fs = require('fs');
const url = require('url');

const config = {
    user: "avnadmin",
    password: "AVNS_ZWk_tfodqvhC96EJlaa",
    host: "pg-372176fb-rahulytprem-e006.g.aivencloud.com",
    port: 12386,
    database: "defaultdb",
    ssl: {
        rejectUnauthorized: true,
        ca: `-----BEGIN CERTIFICATE-----
MIIEQTCCAqmgAwIBAgIUCetStQALwBlY7qGiKUVzhEcNYu0wDQYJKoZIhvcNAQEM
BQAwOjE4MDYGA1UEAwwvZWM0Mzc1MDgtNjZlZC00NGVlLWI2NzgtOThhNTI2NDk4
YzlkIFByb2plY3QgQ0EwHhcNMjUwMTAyMDczNzAzWhcNMzQxMjMxMDczNzAzWjA6
MTgwNgYDVQQDDC9lYzQzNzUwOC02NmVkLTQ0ZWUtYjY3OC05OGE1MjY0OThjOWQg
UHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCCAYoCggGBANWFQwMG
iHkqpER1QUHFoZKOXPSpUiBLy4WweIjZ74ystd+E1+MGDhyuB3uiafhqNGYfKI8G
ZM/vRPHkQKjiLhyd0Tuj4nWOgXevtPjrbHwxvrh19WH/9AxjULX8P9MFL3LfJeUU
kZru75eAe+1wWUDQY4CpiETtzON8UQxkSCcG36OE9koPc9UjKVX0+C5WGtrQYKVP
19x6Y6VIG29nNRsJcmjLa2//6gP/yFdJVY9zN3BJt2kdT74r6XsqHfuKwdJfO8Ts
5TmxC8p6sPItpH/lADPqE0Xdnnfnp8St6XagQk+WVyu71JJnfCsVS+nJPXoSceM9
fsTSfHtQ/9t6yQMO7DyicMiwkilw63SLAaqmoFXiA8YayIucEbXFQSqvi+3uhtxl
oD33pVG23DNy6SL2YVgbDxQ+rZdviuFazF9B4AIYYtjLCr1FfMu9I+FlJunw1t6F
Ewk7R+cICIe6CIxoa3VO+nIgCPkJ3D1gAU6jAIxzDI/Eh8iUjicZQO1JbQIDAQAB
oz8wPTAdBgNVHQ4EFgQUCSMkLyg4YRZ0bb5wYVwhkWHVyfMwDwYDVR0TBAgwBgEB
/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQADggGBACH8WFjluKbQ0Vlz
WR6pvI2zCUZVQpJpZ6Rf22mg+CuOCRY44nKy6WOSsfL/xpA3Me9IM+cXUDac9JAJ
ZVy3aIyP0N++thVAgQ8vHBefHNBaMcotJ+UuReqW0J3CyY+R/I6iliMTVdXjwzKT
d7hRtCw74W2y2BCQNKp+9SX7jRFFEM2W+1bGIMA389s/1atMjiSLgIgu/1ASaw2i
rZfEXLGMRG5Oob3qZdyP2/8FlmrlQzRuB6QmawguFujquo5VDRTwZA6k7SVA+eI4
/txIGIgsCbQkos66BsfGRF78xFuvp28rqGYs1Hjb+GVNfSqnW92BMEDBQEwktmfZ
XXtfbHnWHnlUgHM2q5Os1A53HX2Pgc3DZqt/cQk9ZfXaUK2JB4N8F/k/L/D64Vl3
5z5uTLtKCOLoQrU2Dif9yCOyP1XfLXuNZXHk/fcNm7nDWqjKfjKV/52Gb7TIpBlg
slw24NVwnVuBe/tVCoF7pjF5l8fOUHbDPo+Mq3/VwPHbCuUBHA==
-----END CERTIFICATE-----`,
    },
};

const client = new pg.Client(config);
client.connect(function (err) {
    if (err)
        throw err;
    client.query("SELECT VERSION()", [], function (err, result) {
        if (err)
            throw err;

        console.log(result.rows[0].version);
        client.end(function (err) {
            if (err)
                throw err;
        });
    });
});

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
