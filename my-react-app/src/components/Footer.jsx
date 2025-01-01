import React from 'react';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

const Footer = () => {
  return (
    <div className='footer'>
      <span>&copy; {new Date().getFullYear()} Book-Reviews. All rights reserved.</span>
      <div className='footer-links'>
        <a href='https://github.com/iamrahul-l'>About me<LinkedInIcon/></a>
        <a href='https://github.com/iamrahul-l/first-react-proj'>Project docs  < GitHubIcon/></a>
      </div>
    </div>
  );
};

export default Footer;
