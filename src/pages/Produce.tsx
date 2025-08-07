
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { Search, ArrowRight } from "lucide-react";

// Define product types
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  image: string;
  category: string;
}

// Sample product data
const products: Product[] = [
  {
    id: "little-gourd",
    name: "Little Gourd (Tindora)",
    description: "Farm fresh, organically grown little gourd with exceptional taste and nutritional value.",
    price: 50,
    unit: "500g",
    image: "/lovable-uploads/faf0beb0-6926-4c2d-a405-283f9c98c26b.png",
    category: "Gourds"
  },
  {
    id: "bhindi",
    name: "Bhindi (Okra)",
    description: "Fresh organic bhindi, crispy and nutritious. Perfect for healthy cooking.",
    price: 40,
    unit: "500g",
    image: "/lovable-uploads/e19656d6-a849-47ba-8795-7c1f88dd326d.png",
    category: "Vegetables"
  },
  {
    id: "dudhi",
    name: "Dudhi (Bottle Gourd)",
    description: "Fresh organic bottle gourd, healthy and versatile. Great for curries and soups.",
    price: 40,
    unit: "per piece",
    image: "/lovable-uploads/0124ffce-e145-407b-9ca8-dd9fcb4b700c.png",
    category: "Gourds"
  }
];

const Produce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(products.map(product => product.category)));

  return (
    <div className="page-transition pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-organic-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="section-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Organic Produce
            </motion.h1>
            <motion.div 
              className="w-24 h-1 bg-earth-400 mx-auto mb-8"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            ></motion.div>
            <motion.p 
              className="text-lg text-gray-700 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Fresh, certified organic produce from our cooperative directly to your home
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search and Filter */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row gap-4 md:items-center mb-8">
              <div className="flex-grow relative">
                <div className="absolute inset-y-0 left-3 flex items-center">
                  <Search size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text"
                  placeholder="Search for products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
              
              <div className="flex space-x-4 overflow-x-auto pb-2 md:pb-0">
                <button 
                  className={`py-2 px-4 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                    selectedCategory === null
                      ? "bg-organic-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  All Products
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`py-2 px-4 rounded-full font-medium text-sm whitespace-nowrap transition-colors ${
                      selectedCategory === category
                        ? "bg-organic-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 hover-scale"
                >
                  <div className="h-56 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-organic-800">{product.name}</h3>
                      <div className="px-3 py-1 bg-organic-100 text-organic-700 rounded-full text-sm font-medium">
                        ₹{product.price} per {product.unit}
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, 1);
                        navigate('/cart');
                      }}
                      className="flex items-center text-organic-600 font-medium hover:text-organic-700 transition-colors w-full justify-center py-2 rounded bg-green-100 text-green-800 font-semibold"
                    >
                      <span>Order Now</span>
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-6">
                We couldn't find any products matching your search criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory(null);
                }}
                className="btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Ordering Information */}
      <section className="py-16 bg-organic-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-4">How to Order</h2>
              <p className="text-gray-700">
                Follow these simple steps to order our fresh organic produce
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Select Products",
                  description: "Choose from our range of certified organic produce."
                },
                {
                  step: "02",
                  title: "Place Your Order",
                  description: "Enter your details and specify the quantity you need."
                },
                {
                  step: "03",
                  title: "Make Payment",
                  description: "Use the QR code to make a secure payment and confirm your order."
                }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  className="bg-white p-6 rounded-xl shadow-md"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-10 h-10 bg-organic-100 rounded-full flex items-center justify-center text-organic-700 font-bold text-sm mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-lg font-bold text-organic-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Produce;
