
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
  "tindora": {
    id: "tindora",
    name: "Tindora",
    description: "Farm fresh, organically grown tindora with exceptional taste and nutritional value. Minimum order: 250 gm.",
    detailedDescription: "Our tindora is grown using organic farming practices, free from synthetic pesticides and fertilizers. Each piece is harvested at the perfect stage of ripeness to ensure optimal flavor and nutritional content. Tindora is known for its distinctive taste and numerous health benefits.",
    price: 100,
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
    description: "Fresh organic bajra grains, rich in nutrients and perfect for healthy cooking. Minimum order: 250 gm.",
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
  "fresh-turmeric": {
    id: "fresh-turmeric",
    name: "Fresh Turmeric",
    description: "Fresh organic turmeric, naturally grown and packed with essential nutrients and health benefits. Minimum order: 250 gm.",
    detailedDescription: "Our fresh organic turmeric is cultivated using traditional farming methods without any chemical inputs. Known for its powerful anti-inflammatory and antioxidant properties, fresh turmeric is a superfood that provides numerous health benefits. It's perfect for cooking, making golden milk, or adding to your daily wellness routine.",
    price: 120,
    unit: "kg",
    image: "/lovable-uploads/high-quality-fresh-turmeric-healthy-superfood-indonesia-fresh-turmeric-rhizomes-curcuma-longa-indonesia-displayed-405377264.webp",
    nutritionalInfo: [
      "Rich in curcumin (active compound)",
      "High in antioxidants",
      "Contains essential vitamins and minerals",
      "Natural anti-inflammatory properties"
    ],
    benefits: [
      "Supports immune function",
      "Aids in reducing inflammation",
      "Promotes brain health",
      "Supports heart health and digestion"
    ]
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(0.25); // Minimum order: 250 gm
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
    if (quantity < 0.25) {
      toast.error("Minimum order quantity is 250 gm (0.25 kg)");
      return;
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
      setQuantity(0.25); // Reset to minimum quantity
    } else {
      toast.error("Could not add to cart. Please check stock availability.");
    }
  };
  
  // Handle quantity changes (increment/decrement by 0.25 kg = 250 gm)
  const incrementQuantity = () => {
    setQuantity(prev => prev + 0.25);
  };
  
  const decrementQuantity = () => setQuantity(prev => (prev > 0.25 ? prev - 0.25 : 0.25));

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
              <label className="block text-gray-700 mb-2">Quantity (Minimum: 250 gm):</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 0.25}
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
