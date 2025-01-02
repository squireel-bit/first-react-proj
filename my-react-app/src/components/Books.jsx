import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { Rate } from 'antd';
import { useNavigate } from 'react-router-dom';

const Books = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);

    const fetchBooks = async () => {
        const { data } = await Axios.get('https://first-react-proj-o8de.vercel.app/api/books/');
        setBooks(data);

    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleBookClick = (bookId) => {
        navigate(`/book/${bookId}`);
    };

    return (
        <div className='books-container'>
            <h1 className='books-title'>My Book Collection</h1>
            <div className='books-grid'>
                {books.map((book) => (
                    <div 
                        className='book-card' 
                        key={book.id}
                        onClick={() => handleBookClick(book.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className='book-image'>
                            <img src={book.cover_url} alt={book.title} />
                        </div>
                        <div className='book-info'>
                            <h2>{book.title}</h2>
                            <h3>{book.author}</h3>
                            <Rate 
                                defaultValue={book.rating} 
                                style={{ color: "#FFA500" }} 
                                disabled 
                                tooltips={['terrible', 'bad', 'normal', 'good', 'wonderful']} 
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Books;
