import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Backlink Bazaar</h3>
            <p className="text-slate-600">
              Your trusted marketplace for high-quality backlinks and SEO services.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-600 hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/category/keyword-rank" className="text-slate-600 hover:text-primary transition-colors">
                  Keyword Rank
                </Link>
              </li>
              <li>
                <Link to="/category/blog-comments" className="text-slate-600 hover:text-primary transition-colors">
                  Blog Comments
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/faq" className="text-slate-600 hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-slate-600 hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-slate-600 hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-slate-600 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://facebook.com', '_blank');
                }}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-600 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://twitter.com', '_blank');
                }}
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-slate-600 hover:text-primary transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  window.open('https://instagram.com', '_blank');
                }}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="mailto:contact@backlinkbazaar.com" 
                className="text-slate-600 hover:text-primary transition-colors"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t mt-8 pt-8 text-center text-slate-600">
          <p>&copy; {new Date().getFullYear()} Backlink Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;