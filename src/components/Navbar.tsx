
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Menu, X, ShoppingCart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar = ({ isScrolled }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link 
          to="/" 
          className="flex items-center space-x-2"
          onClick={closeMenu}
        >
          <img 
            src="/lovable-uploads/612110f5-6418-4e8f-9b03-5a591cb78013.png" 
            alt="Mujkuva Organic Farmer Co-Op Society Ltd" 
            className="h-14 w-14 object-contain" 
          />
          <div className="hidden md:block">
            <h1 className="text-organic-800 font-serif font-bold text-xl leading-tight">
              Mujkuva Organic
            </h1>
            <p className="text-organic-600 text-xs leading-tight">
              Farmer Cooperative Society Ltd
            </p>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {[
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
            { name: "Certification", path: "/certification" },
            { name: "Produce", path: "/produce" },
            { name: "Contact", path: "/contact" },
          ].map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "relative font-medium transition-colors hover:text-organic-500",
                  "after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0",
                  "after:bg-organic-500 after:origin-bottom-right after:transition-transform after:duration-300",
                  "hover:after:scale-x-100 hover:after:origin-bottom-left",
                  isActive
                    ? "text-organic-500 after:scale-x-100"
                    : "text-gray-700"
                )
              }
            >
              {item.name}
            </NavLink>
          ))}
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="relative text-gray-700 hover:text-organic-500 transition-colors p-2"
          >
            <ShoppingCart size={20} />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-organic-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </Link>
          
          <Link 
            to="/produce" 
            className="btn-primary"
          >
            Shop Now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-organic-800" 
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {[
                { name: "Home", path: "/" },
                { name: "About", path: "/about" },
                { name: "Certification", path: "/certification" },
                { name: "Produce", path: "/produce" },
                { name: "Contact", path: "/contact" },
              ].map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "py-2 px-4 rounded-md transition-colors",
                      isActive
                        ? "bg-organic-100 text-organic-700 font-medium"
                        : "text-gray-700 hover:bg-organic-50"
                    )
                  }
                  onClick={closeMenu}
                >
                  {item.name}
                </NavLink>
              ))}
              <Link
                to="/cart"
                className="flex items-center justify-between py-2 px-4 rounded-md text-gray-700 hover:bg-organic-50 transition-colors"
                onClick={closeMenu}
              >
                <span>Cart</span>
                <div className="flex items-center">
                  <ShoppingCart size={18} />
                  {getTotalItems() > 0 && (
                    <span className="ml-2 bg-organic-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </div>
              </Link>
              
              <Link 
                to="/produce" 
                className="btn-primary text-center"
                onClick={closeMenu}
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
