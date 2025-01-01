import React from 'react';

const About = () => {
  return (
    <div className='about-container'>
      <div className='about-content'>
        <h1 className='about-title'>About This Application</h1>
        <div className='about-text'>
          <p className='about-paragraph'>This application is designed to help users review and manage their book collection.</p>
          <p className='about-paragraph'>It allows users to add, update, and delete books, as well as rate them and leave notes.</p>
          <p className='about-paragraph'>Created by Rahul, this app aims to provide a user-friendly interface for book lovers.</p>
        </div>
      </div>
    </div>
  );
};

export default About;