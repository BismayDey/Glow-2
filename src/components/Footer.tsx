import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, Youtube, Facebook, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-mauve-300 text-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-serif mb-4">Shop</h3>
            <ul className="space-y-2">
              <li><a href="#eyes" className="hover:text-white transition">Eyes</a></li>
              <li><a href="#lips" className="hover:text-white transition">Lips</a></li>
              <li><a href="#nails" className="hover:text-white transition">Nails</a></li>
              <li><a href="#face" className="hover:text-white transition">Face</a></li>
              <li><a href="#tools" className="hover:text-white transition">Tools</a></li>
              <li><a href="#skincare" className="hover:text-white transition">Skincare</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-serif mb-4">Customer Care</h3>
            <ul className="space-y-2">
              <li><a href="#contact" className="hover:text-white transition">Contact Us</a></li>
              <li><a href="#shipping" className="hover:text-white transition">Shipping & Returns</a></li>
              <li><a href="#faqs" className="hover:text-white transition">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-2xl font-serif mb-4">Connect</h3>
            <div className="flex space-x-4 mb-6">
              <a href="#instagram" className="hover:text-white transition">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#youtube" className="hover:text-white transition">
                <Youtube className="h-6 w-6" />
              </a>
              <a href="#facebook" className="hover:text-white transition">
                <Facebook className="h-6 w-6" />
              </a>
            </div>
            <p>Sign up for our newsletter to receive updates and exclusive offers.</p>
            <div className="mt-4 flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 rounded-lg sm:rounded-r-none focus:outline-none flex-1 mb-2 sm:mb-0"
              />
              <button className="bg-rose-500 text-white px-4 py-2 rounded-lg sm:rounded-l-none hover:bg-rose-600 transition">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p>© 2025 GLOW All Rights Reserved</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#privacy" className="hover:text-white transition">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;