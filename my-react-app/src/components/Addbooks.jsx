import React, { useState } from 'react';
import axios from 'axios';
import { Rate } from 'antd';


const BookForm = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_url: '',
    rating: '',
    notes: '',
    isbn: '',
    description: ''
  });

  const searchBooks = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data.docs.slice(0, 5)); // Limit to first 5 results
    } catch (error) {
      console.error('Error searching books:', error);
    }
  };

  const selectBook = (book) => {
    const coverUrl = book.cover_i 
      ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`
      : '';
    
    setFormData({
      ...formData,
      title: book.title,
      author: book.author_name ? book.author_name[0] : '',
      cover_url: coverUrl,
      isbn: book.isbn ? book.isbn[0] : '',
      description: book.description || book.first_sentence ? 
      (book.description || book.first_sentence[0]) : ''
    });
    setSearchResults([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('https://first-react-proj-o8de.vercel.app/api/books', formData);
    window.location.href = '/';
  };

  const [isSearching, setIsSearching] = useState(false);

  return (
    <div className="book-form">
      <h1 className='cntch1'>Add a book</h1>
      <form onSubmit={async (e) => {
        setIsSearching(true);
        await searchBooks(e);
        setIsSearching(false);
      }} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for a book..."
        />
        <button type="submit">Search</button>
      </form>

      {isSearching && (
        <div className="search-popup">
          <p>Searching...</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="search-results">
          {searchResults.map((book, index) => (
            <div key={index} className="search-result" onClick={() => selectBook(book)}>
              <p>{book.title} by {book.author_name ? book.author_name[0] : 'Unknown'}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className='book-form'>
        <input type="text" placeholder="Title" value={formData.title} required onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
        <input type="text" placeholder="Author" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} />
        <input type="url" placeholder="Cover URL" value={formData.cover_url} onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })} />
        <input type="text" placeholder="ISBN" value={formData.isbn} onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} />
        <textarea placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
        <div className="rating">
          <p>Rating</p>
          <Rate 
            onChange={(value) => setFormData({ ...formData, rating: value })}
            value={formData.rating}
            style={{ colorBorder: 'red' }}  
            tooltips={['terrible', 'bad', 'normal', 'good', 'wonderful']} />
        </div>
        <textarea placeholder="Notes" onChange={(e) => setFormData({ ...formData, notes: e.target.value })}></textarea>
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default BookForm;
