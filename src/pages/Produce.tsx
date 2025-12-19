import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { Search, ArrowRight, Heart } from "lucide-react";
import { toast } from "sonner";
import WishlistModal from "@/components/WishlistModal";

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

// Updated produce list - Tindora, Bajra, and Fresh Turmeric
const products: Product[] = [
  {
    id: "tindora",
    name: "Tindora",
    description: "Farm fresh, organically grown tindora with exceptional taste and nutritional value. Minimum order: 250 gm.",
    price: 100,
    unit: "kg",
    image: "/lovable-uploads/faf0beb0-6926-4c2d-a405-283f9c98c26b.png",
    category: "Vegetables"
  },
  {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    description: "Fresh organic bajra grains, rich in nutrients and perfect for healthy cooking. Minimum order: 250 gm.",
    price: 40,
    unit: "kg",
    image: "/lovable-uploads/WhatsApp Image 2025-08-28 at 10.57.12 (2).jpeg",
    category: "Grains"
  },
  {
    id: "fresh-turmeric",
    name: "Fresh Turmeric",
    description: "Fresh organic turmeric, naturally grown and packed with essential nutrients and health benefits. Minimum order: 250 gm.",
    price: 120,
    unit: "kg",
    image: "/lovable-uploads/high-quality-fresh-turmeric-healthy-superfood-indonesia-fresh-turmeric-rhizomes-curcuma-longa-indonesia-displayed-405377264.webp",
    category: "Spices"
  },
  {
    id: "tomato",
    name: "Tomato",
    description: "Fresh organic tomatoes, naturally ripened and packed with flavor and essential nutrients. Minimum order: 250 gm.",
    price: 80,
    unit: "kg",
    image: "/lovable-uploads/Tamatar.PNG",
    category: "Vegetables"
  }
];

const Produce = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);
  const navigate = useNavigate();
  
  // Restore ordering functionality
  const handleOrderNow = (productId: string) => {
    navigate(`/produce/${productId}`);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearchTerm = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.category === selectedCategory : true;
    return matchesSearchTerm && matchesCategory;
  });

  return (
    <div>
      {/* Search and Filter Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-organic-800 mb-4">
              Fresh Organic Produce
            </h1>
            <p className="text-gray-700 mb-8">
              Discover the taste of health with our organically grown fruits and vegetables.
            </p>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full py-3 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-organic-500 focus:outline-none"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <Search className="text-gray-400" />
                </div>
              </div>
              <div className="relative w-full">
                <select
                  value={selectedCategory || ""}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-3 px-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-organic-500 focus:outline-none"
                >
                  <option value="">All Categories</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Grains">Grains</option>
                  <option value="Spices">Spices</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="max-w-4xl mx-auto">
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
                    <div className="h-64 w-full overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        style={{ aspectRatio: '1/1' }}
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
                        onClick={() => handleOrderNow(product.id)}
                        className="flex items-center text-organic-600 font-medium hover:text-organic-700 transition-colors w-full justify-center py-2 rounded bg-green-100 text-green-800 font-semibold"
                      >
                        <span>Order Now</span>
                        <ArrowRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {/* Wishlist Card - Integrated into product grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: filteredProducts.length * 0.1 }}
                  onClick={() => setIsWishlistModalOpen(true)}
                  className="bg-gradient-to-br from-organic-400 via-orange-500 to-pink-500 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover-scale cursor-pointer border-4 border-white"
                >
                  <div className="h-64 w-full overflow-hidden bg-gradient-to-br from-organic-300 via-orange-400 to-pink-400 flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-organic-500/20 to-pink-500/20"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto mb-4 animate-pulse">
                        <Heart className="text-organic-600" size={48} fill="currentColor" />
                      </div>
                      <div className="w-16 h-1 bg-white/80 mx-auto rounded-full"></div>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-xl font-bold text-white drop-shadow-lg">What are you looking for?</h3>
                      <div className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                        Wishlist
                      </div>
                    </div>
                    <p className="text-white/90 mb-4 line-clamp-2 font-medium">
                      Tell us what produce you'd like to purchase in the future
                    </p>
                    <button
                      type="button"
                      className="flex items-center text-white font-semibold hover:text-white transition-colors w-full justify-center py-2 rounded bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 hover:bg-white/30 font-bold"
                    >
                      <span>Add to Wishlist</span>
                      <ArrowRight size={16} className="ml-2" />
                    </button>
                  </div>
                </motion.div>
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

      {/* Wishlist Modal */}
      <WishlistModal 
        isOpen={isWishlistModalOpen} 
        onClose={() => setIsWishlistModalOpen(false)} 
      />
    </div>
  );
};

export default Produce;
