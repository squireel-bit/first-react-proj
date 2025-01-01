import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Books from '../components/Books';
import AboutPage from '../pages/AboutPage';
import ContactPage from '../pages/ContactPage';
import NotFoundPage from '../pages/NotFoundPage';
import Addbooks from '../components/Addbooks';
import Homepage from '../pages/Homepage';
import BookOpen from '../pages/Booksopen';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        {/* <Books /> */}
        <Routes>
        <Route path="/" element={<Homepage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/addbooks" element={<Addbooks />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/book/:id" element={<BookOpen />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
