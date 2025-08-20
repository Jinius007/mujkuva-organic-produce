
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Award, Leaf, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
// import { useCart } from "@/contexts/CartContext";

// Define product types
interface Product {
  id: string;
  name: string;
  description: string;
  detailedDescription: string;
  price: number;
  unit: string;
  image: string;
  nutritionalInfo: string[];
  benefits: string[];
}

// Sample product data
const productsData: Record<string, Product> = {
  "little-gourd": {
    id: "little-gourd",
    name: "Little Gourd (Tindora)",
    description: "Farm fresh, organically grown little gourd with exceptional taste and nutritional value.",
    detailedDescription: "Our little gourd is grown using organic farming practices, free from synthetic pesticides and fertilizers. Each piece is harvested at the perfect stage of ripeness to ensure optimal flavor and nutritional content. Little gourd is known for its distinctive taste and numerous health benefits.",
    price: 50,
    unit: "500g",
    image: "/lovable-uploads/faf0beb0-6926-4c2d-a405-283f9c98c26b.png",
    nutritionalInfo: [
      "Rich in vitamins A and C",
      "Good source of dietary fiber",
      "Contains essential minerals like potassium and magnesium",
      "Low in calories and carbohydrates"
    ],
    benefits: [
      "Supports immune function",
      "Aids in digestion",
      "Helps manage blood sugar levels",
      "Contributes to heart health"
    ]
  },
  "bhindi": {
    id: "bhindi",
    name: "Bhindi (Okra)",
    description: "Fresh organic bhindi, crispy and nutritious. Perfect for healthy cooking.",
    detailedDescription: "Our organic bhindi is grown without synthetic pesticides or fertilizers, ensuring the highest quality and taste. Rich in nutrients and with a unique texture, bhindi is perfect for curries, fries, and various regional dishes. Each piece is carefully selected for optimal freshness.",
    price: 40,
    unit: "500g",
    image: "/lovable-uploads/e19656d6-a849-47ba-8795-7c1f88dd326d.png",
    nutritionalInfo: [
      "High in dietary fiber",
      "Rich in vitamins C and K",
      "Contains folate and antioxidants",
      "Good source of magnesium and potassium"
    ],
    benefits: [
      "Supports digestive health",
      "May help control blood sugar",
      "Promotes heart health",
      "Boosts immune function"
    ]
  },
  "dudhi": {
    id: "dudhi",
    name: "Dudhi (Bottle Gourd)",
    description: "Fresh organic bottle gourd, healthy and versatile. Great for curries and soups.",
    detailedDescription: "Our organic bottle gourd is cultivated using traditional farming methods without any chemical inputs. Known for its mild flavor and high water content, dudhi is excellent for various dishes and provides numerous health benefits. It's particularly popular in Indian cuisine.",
    price: 40,
    unit: "per piece",
    image: "/lovable-uploads/0124ffce-e145-407b-9ca8-dd9fcb4b700c.png",
    nutritionalInfo: [
      "High water content (96%)",
      "Rich in vitamins B and C",
      "Contains calcium and iron",
      "Low in calories and fat"
    ],
    benefits: [
      "Helps with hydration",
      "Aids in weight management",
      "Supports kidney function",
      "Promotes healthy digestion"
    ]
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  // Orders closed for this slot
  const addToCart = () => {
    toast.error("Orders closed for this slot");
  };
  const [quantity, setQuantity] = useState(1);
  const [stockMessage, setStockMessage] = useState("");
  
  // Get product details
  const product = productId ? productsData[productId] : null;
  
  if (!product) {
    return (
      <div className="page-container text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
        <p className="mb-8">The product you are looking for does not exist.</p>
        <button 
          onClick={() => navigate("/produce")}
          className="btn-primary"
        >
          Back to Products
        </button>
      </div>
    );
  }
  // REMOVE BLOCK ALL ORDERING: Always show product details and enable ordering
  // (No-op: main return is below)
  
  const totalPrice = product.price * quantity;
  
  // Refresh stock data on component mount
  useEffect(() => {
    refreshStockData();
  }, [refreshStockData]);

  // Calculate available stock for real products
  const availableStock = getAvailableStock(product.id);
  const isOutOfStock = availableStock === 0;
  
  // Update stock message when quantity changes
  useEffect(() => {
    const message = getStockMessage(product.id, quantity);
    setStockMessage(message);
  }, [quantity, product.id, getStockMessage]);

  // Handle add to cart
  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock for the current batch");
      return;
    }
    
    if (!isStockAvailable(product.id, quantity)) {
      toast.error(getStockMessage(product.id, quantity));
      return;
    }
    
    const success = addToCart(product, quantity);
    if (success) {
      if (product.id === 'dudhi') {
        toast.success(`Added ${quantity} pieces to cart`);
      } else {
        toast.success(`Added ${quantity} units (${(quantity * 0.5).toFixed(1)}kg) to cart`);
      }
      setQuantity(1); // Reset quantity
    } else {
      toast.error("Could not add to cart. Please check stock availability.");
    }
  };
  
  // Handle quantity changes
  const incrementQuantity = () => {
    const newQuantity = quantity + 1;
    if (isStockAvailable(product.id, newQuantity)) {
      setQuantity(newQuantity);
    }
  };
  
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="page-transition pt-24">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-organic-100 rounded-full z-0"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-earth-100 rounded-full z-0"></div>
              <img 
                src={product.image} 
                alt={product.name} 
                className="rounded-xl shadow-xl w-full max-w-md relative z-10"
              />
            </div>
          </motion.div>
          
          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center mb-6">
              <div className="px-3 py-1 bg-organic-100 text-organic-700 rounded-full text-sm font-medium">
                Certified Organic
              </div>
              <div className="mx-3 w-1 h-1 bg-gray-300 rounded-full"></div>
              <div className="text-gray-500 text-sm">PGS Organic 1</div>
            </div>
            
            <h1 className="text-4xl font-serif font-bold text-organic-800 mb-4">
              {product.name}
            </h1>
            
            <div className="text-2xl font-bold text-organic-600 mb-6">
              ₹{product.price} per {product.unit}
            </div>
            
            {/* Stock Information */}
            return (
              <div className="page-transition pt-24">
                <div className="container mx-auto px-4 py-12">
                  <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                    <h1 className="text-2xl font-bold mb-6 text-organic-800">Orders closed for this slot</h1>
                    <p className="mb-2 text-gray-700">Ordering is currently unavailable. Please check back later.</p>
                  </div>
                </div>
              </div>
            );
              )}
