import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gradient-app text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-muted hover:text-white transition-colors">
              Premium backlink marketplace for SEO professionals and digital marketers.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-muted hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-muted hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
              <li>
                <a 
                  href="/robots.txt" 
                  className="text-muted hover:text-white transition-colors" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Robots.txt
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-muted">
                Email: contact@backlinkbazaar.online
              </li>
              <li className="text-muted">
                Support Hours: 24/7
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-muted">
            &copy; {new Date().getFullYear()} Backlink Bazaar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;