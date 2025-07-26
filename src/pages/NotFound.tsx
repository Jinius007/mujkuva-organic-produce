
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-organic-50 to-white pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-9xl font-serif font-bold text-organic-300 mb-6">404</div>
            <h1 className="text-4xl font-serif font-bold text-organic-800 mb-4">Page Not Found</h1>
            <p className="text-xl text-gray-600 mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>

            <Link to="/" className="btn-primary inline-flex items-center space-x-2">
              <ArrowLeft size={18} />
              <span>Return to Home</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
