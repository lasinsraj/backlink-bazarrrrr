import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">About Us</h3>
            <p className="text-slate-400">
              Premium backlink marketplace for SEO professionals and digital marketers.
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-slate-400 hover:text-white">Home</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-white">Shop</Link></li>
              <li><Link to="/contact" className="text-slate-400 hover:text-white">Contact</Link></li>
              <li><Link to="/faq" className="text-slate-400 hover:text-white">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-slate-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/refund-policy" className="text-slate-400 hover:text-white">Refund Policy</Link></li>
              <li><a href="/robots.txt" className="text-slate-400 hover:text-white" target="_blank" rel="noopener noreferrer">Robots.txt</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-slate-400">
              <li>Email: contact@backlinkbazaar.com</li>
              <li>Support Hours: 24/7</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-slate-800 text-center text-slate-400">
          <p>&copy; {new Date().getFullYear()} Backlink Bazaar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;