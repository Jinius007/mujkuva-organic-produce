
import { Link } from "react-router-dom";
import { Mail, Phone, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-organic-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <img 
                src="/lovable-uploads/612110f5-6418-4e8f-9b03-5a591cb78013.png" 
                alt="Mujkuva Organic Farmer Co-Op Society Ltd" 
                className="h-16 w-16 object-contain" 
              />
            </Link>
            <h3 className="text-xl font-serif font-bold mb-2">Mujkuva Organic</h3>
            <p className="text-organic-100 text-sm mb-4">
              Certified organic produce from the heart of rural India
            </p>
            <div className="flex space-x-4 text-organic-200">
              <span className="hover:text-white transition-colors cursor-pointer" aria-label="Instagram">
                <Instagram size={20} />
              </span>
              <span className="hover:text-white transition-colors cursor-pointer" aria-label="Facebook">
                <Facebook size={20} />
              </span>
              <span className="hover:text-white transition-colors cursor-pointer" aria-label="Twitter">
                <Twitter size={20} />
              </span>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "About Us", path: "/about" },
                { name: "Our Certification", path: "/certification" },
                { name: "Our Produce", path: "/produce" },
                { name: "Contact Us", path: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link 
                    to={item.path}
                    className="text-organic-200 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/produce/little-gourd"
                  className="text-organic-200 hover:text-white transition-colors"
                >
                  Little Gourd
                </Link>
              </li>
              <li>
                <Link 
                  to="/produce"
                  className="text-organic-200 hover:text-white transition-colors"
                >
                  Seasonal Vegetables
                </Link>
              </li>
              <li>
                <Link 
                  to="/produce"
                  className="text-organic-200 hover:text-white transition-colors"
                >
                  Fruits
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-organic-200">
              <div className="flex items-start space-x-3">
                <Mail size={18} className="mt-0.5 flex-shrink-0" />
                <div>
                  <span className="hover:text-white transition-colors">
                    mrpatel@nddb.coop
                  </span>
                  <br />
                  <span className="hover:text-white transition-colors">
                    sinjini@nddb.coop
                  </span>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone size={18} className="mt-0.5 flex-shrink-0" />
                <div>
                  <span className="hover:text-white transition-colors">
                    +91 98790 78182
                  </span>
                  <br />
                  <span className="hover:text-white transition-colors">
                    +91 77384 08994
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-organic-800 mt-8 pt-8 text-center text-organic-300 text-sm">
          <p>© {new Date().getFullYear()} Mujkuva Organic Farmer Cooperative Society Ltd. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
