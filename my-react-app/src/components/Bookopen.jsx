import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Axios from 'axios';
import { Rate } from 'antd';

const Booksopen = () => {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                const bookResponse = await Axios.get(`http://localhost:3000/api/books/${id}`);
                setBook(bookResponse.data);

                const notesResponse = await Axios.get(`http://localhost:3000/api/books/${id}/notes`);
                setNotes(notesResponse.data);
            } catch (error) {
                console.error('Error fetching book details:', error);
            }
        };

        fetchBookDetails();
    }, [id]);

    if (!book) return <div>Loading...</div>;

    function deleteBook() {
        Axios.delete(`http://localhost:3000/api/books/${id}`)
            .then(() => {
                window.location.href = '/';
            })
            .catch(error => console.error('Error deleting book:', error));
    }

    return (
        <div className="book-details-container">
            <div className="book-open-content">
                <div className="book-open-image">
                    <img src={book.cover_url} alt={book.title} />
                </div>
                <div className="book-open-details">
                    <h1 className="book-open-title">{book.title}</h1>
                    <h2 className="book-open-author">{book.author}</h2>
                    <Rate
                        defaultValue={book.rating}
                        style={{ color: "#FFA500" }}
                        disabled
                        tooltips={['terrible', 'bad', 'normal', 'good', 'wonderful']}
                    />
                    <p className="book-open-description">{book.description}</p>
                </div>
            </div>
            <div className="book-notes">
                <h2>Notes</h2>
                {notes.map((note) => (
                    <div key={note.id} className="note">
                        <p>{note.notes}</p>
                        <button
                            className="edit-note-btn"
                            onClick={() => {
                                const updatedNote = prompt('Edit note:', note.notes);
                                if (updatedNote) {
                                    Axios.put(`http://localhost:3000/api/books/${note.id}`, {
                                        notes: updatedNote
                                    })
                                        .then(() => {
                                            const updatedNotes = notes.map(n =>
                                                n.id === note.id ? { ...n, notes: updatedNote } : n
                                            );
                                            setNotes(updatedNotes);
                                        })
                                        .catch(error => console.error('Error updating note:', error));
                                }
                            }}
                        >
                            Edit Notes
                        </button>
                        <span className="note-date"> Last updated on {new Date(note.created_at).toLocaleDateString()}</span>
                        
                    </div>
                ))}
            </div>
            <button className='deletebtn' onClick={deleteBook}>Delete Book</button>
        </div>
    );
};

export default Booksopen;
