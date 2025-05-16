import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-neutral-600 bg-opacity-35 text-neutral-400 py-4 text-center">
      <div className="flex items-center justify-center gap-4 mb-2">
        <Link to="/about" className="hover:underline">About</Link>
        <Link to="/contact" className="hover:underline">Contact Us</Link>
      </div>
      <p className="text-sm">Created by Laxmi Gupta</p>
    </footer>
  );
};

export default Footer;
