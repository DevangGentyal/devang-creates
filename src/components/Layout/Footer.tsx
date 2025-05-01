import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Instagram, Youtube, Mail, Linkedin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-background-dark border-t border-neutral-800 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-white mb-4">
              <Film className="h-8 w-8 text-primary" />
              <span className="font-display">Devang</span>
            </Link>
            <p className="text-neutral-400 text-sm mb-6">
              Professional video editing services for short-form and long-form content.
              Creating engaging visual stories since 2022.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/devang_gentyal/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.instagram.com/devang.creates/" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.youtube.com/@devangcreates" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <h3 className="font-display font-medium text-white text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/short-form" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Short Form
                </Link>
              </li>
              <li>
                <Link to="/long-form" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Long Form
                </Link>
              </li>
              <li>
                <Link to="/#about" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Video Categories */}
          <div className="md:col-span-1">
            <h3 className="font-display font-medium text-white text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/short-form?category=documentary" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Documentaries
                </Link>
              </li>
              <li>
                <Link to="/short-form?category=talkingHead" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Talking Heads
                </Link>
              </li>
              <li>
                <Link to="/short-form?category=advertisement" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Advertisements
                </Link>
              </li>
              <li>
                <Link to="/short-form?category=gaming" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Gaming
                </Link>
              </li>
              <li>
                <Link to="/short-form?category=vlog" className="text-neutral-400 hover:text-primary transition-colors text-sm">
                  Vlogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-1">
            <h3 className="font-display font-medium text-white text-lg mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail size={18} className="text-primary mt-0.5" />
                <span className="text-neutral-400 text-sm">contact@devangedits.com</span>
              </div>
              <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full md:w-auto">
                Get in Touch
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} Devang Gentyal. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-neutral-500 hover:text-primary text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-neutral-500 hover:text-primary text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;