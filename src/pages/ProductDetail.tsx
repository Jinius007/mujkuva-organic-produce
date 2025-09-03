
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Minus, Plus, Award, Leaf, ShoppingBag, ShoppingCart, X } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";

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
    price: 80,
    unit: "kg",
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
  "bajra": {
    id: "bajra",
    name: "Bajra (Pearl Millet)",
    description: "Fresh organic bajra grains, rich in nutrients and perfect for healthy cooking.",
    detailedDescription: "Our organic bajra is grown without synthetic pesticides or fertilizers, ensuring the highest quality and taste. Rich in nutrients and with a unique texture, bajra is perfect for various traditional dishes and provides numerous health benefits.",
    price: 40,
    unit: "kg",
    image: "/lovable-uploads/WhatsApp Image 2025-08-28 at 10.57.12 (2).jpeg",
    nutritionalInfo: [
      "High in dietary fiber",
      "Rich in B vitamins",
      "Contains essential minerals like iron and magnesium",
      "Good source of protein"
    ],
    benefits: [
      "Supports digestive health",
      "May help control blood sugar",
      "Promotes heart health",
      "Boosts energy levels"
    ]
  },
  "banana": {
    id: "banana",
    name: "Banana",
    description: "Fresh organic green bananas, naturally grown and packed with essential nutrients.",
    detailedDescription: "Our organic green bananas are cultivated using traditional farming methods without any chemical inputs. Known for their nutritional value and versatility, these bananas are perfect for cooking and provide numerous health benefits.",
    price: 40,
    unit: "kg",
    image: "/lovable-uploads/WhatsApp Image 2025-09-03 at 09.34.58.jpeg",
    nutritionalInfo: [
      "Rich in potassium",
      "Good source of vitamins B6 and C",
      "Contains dietary fiber",
      "Low in calories and fat"
    ],
    benefits: [
      "Supports heart health",
      "Aids in digestion",
      "Boosts energy levels",
      "Promotes healthy skin"
    ]
  },
  "galki": {
    id: "galki",
    name: "Galki (Sponge Gourd)",
    description: "Fresh organic sponge gourd, healthy and versatile. Great for curries and soups.",
    detailedDescription: "Our organic sponge gourd is grown using organic farming practices, free from synthetic pesticides and fertilizers. Known for its mild flavor and high nutritional content, galki is excellent for various dishes and provides numerous health benefits.",
    price: 40,
    unit: "kg",
    image: "/lovable-uploads/sponge gourd.PNG",
    nutritionalInfo: [
      "High water content",
      "Rich in vitamins A and C",
      "Contains calcium and iron",
      "Low in calories and carbohydrates"
    ],
    benefits: [
      "Helps with hydration",
      "Aids in weight management",
      "Supports immune function",
      "Promotes healthy digestion"
    ]
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  
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
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (product.id === "little-gourd") {
      if (quantity > 10) {
        toast.error("You cannot add more than 10 units of Little Gourd.");
        return;
      }
    } else if (product.id === "bajra") {
      if (quantity > 20) {
        toast.error("You cannot add more than 20 units of Bajra.");
        return;
      }
    } else if (product.id === "banana") {
      if (quantity > 15) {
        toast.error("You cannot add more than 15 units of Banana.");
        return;
      }
    } else if (product.id === "galki") {
      if (quantity > 10) {
        toast.error("You cannot add more than 10 units of Galki.");
        return;
      }
    }
         const success = addToCart({
       id: product.id,
       name: product.name,
       price: product.price,
       unit: product.unit,
       image: product.image,
     }, quantity);
     
          if (success) {
       toast.success(`Added ${quantity}kg of ${product.name} to cart`);
       setQuantity(1); // Reset quantity
     } else {
       toast.error("Could not add to cart. Please check stock availability.");
     }
  };
  
  // Handle quantity changes
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
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
            
            <p className="text-gray-700 mb-6">
              {product.detailedDescription}
            </p>
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Quantity:</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>
                <span className="text-lg font-semibold w-12 text-center">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-organic-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-organic-700 transition-colors"
            >
              Add to Cart
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
