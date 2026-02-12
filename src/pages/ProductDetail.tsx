
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
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

// Sample product data (only the products currently sold on site)
const productsData: Record<string, Product> = {
  "green-garlic": {
    id: "green-garlic",
    name: "Green Garlic",
    description: "Fresh organic green garlic with mild flavor, perfect for winter seasoning. Minimum order: 250 gm.",
    detailedDescription: "Our organic green garlic is harvested young to provide a fresh, mild garlic flavor that is less pungent than mature bulbs. Grown without synthetic pesticides, it is an essential winter ingredient for curries, chutneys, and parathas.",
    price: 120,
    unit: "kg",
    image: "/lovable-uploads/green garlic.PNG",
    nutritionalInfo: [
      "Rich in Allicin (powerful antioxidant)",
      "High in Vitamin C",
      "Contains Iron and Manganese",
      "Good source of Vitamin B6"
    ],
    benefits: [
      "Boosts immune system",
      "Natural antibiotic properties",
      "Promotes heart health",
      "Helps improve blood circulation"
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
  },

  "brinjal_doli": {
    id: "brinjal_doli",
    name: "Brinjal (Doli Variety)",
    description: "Fresh organic brinjal (eggplant), naturally grown and packed with essential nutrients and health benefits. Minimum order: 250 gm.",
    detailedDescription: "Our organic brinjal is cultivated using traditional farming methods without any chemical inputs. Rich in antioxidants and fiber, brinjal is a versatile vegetable that can be used in various traditional and modern dishes. It's known for its unique texture and ability to absorb flavors, making it perfect for curries, stir-fries, and grilled dishes.",
    price: 60,
    unit: "kg",
    image: "/lovable-uploads/Brinjal_Doli Variety.PNG",
    nutritionalInfo: [
      "High in dietary fiber",
      "Rich in antioxidants (especially nasunin)",
      "Good source of vitamins B1, B6, and K",
      "Contains essential minerals like potassium and manganese"
    ],
    benefits: [
      "Supports heart health",
      "May help control blood sugar levels",
      "Promotes digestive health",
      "Rich in antioxidants that protect cells"
    ]
  },

  "brinjal_bharuchi": {
    id: "brinjal_bharuchi",
    name: "Brinjal (Bharuchi Variety)",
    description: "Fresh organic brinjal (eggplant), naturally grown and packed with essential nutrients and health benefits. Minimum order: 250 gm.",
    detailedDescription: "Our organic brinjal is cultivated using traditional farming methods without any chemical inputs. Rich in antioxidants and fiber, brinjal is a versatile vegetable that can be used in various traditional and modern dishes. It's known for its unique texture and ability to absorb flavors, making it perfect for curries, stir-fries, and grilled dishes.",
    price: 60,
    unit: "kg",
    image: "/lovable-uploads/Brinjal_Bharuchi Variety.PNG",
    nutritionalInfo: [
      "High in dietary fiber",
      "Rich in antioxidants (especially nasunin)",
      "Good source of vitamins B1, B6, and K",
      "Contains essential minerals like potassium and manganese"
    ],
    benefits: [
      "Supports heart health",
      "May help control blood sugar levels",
      "Promotes digestive health",
      "Rich in antioxidants that protect cells"
    ]
  }
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1); // Minimum order: 1 unit = 250 gm
  const { addToCart } = useCart();
  
  // Convert units to kg (1 unit = 0.25 kg = 250 gm)
  const quantityInKg = quantity * 0.25;
  
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
    if (quantity < 1) {
      toast.error("Minimum order quantity is 1 unit (250 gm)");
      return;
    }
    
    // Convert units to kg for cart (1 unit = 0.25 kg)
    const quantityInKg = quantity * 0.25;
    
    const success = addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      image: product.image,
    }, quantityInKg);
    
    if (success) {
      toast.success(`Added ${quantity} unit${quantity > 1 ? 's' : ''} (${quantityInKg}kg) of ${product.name} to cart`);
      setQuantity(1); // Reset to minimum quantity (1 unit)
    } else {
      toast.error("Could not add to cart. Please check stock availability.");
    }
  };
  
  // Handle quantity changes (increment/decrement by 1 unit = 250 gm)
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
              <label className="block text-gray-700 mb-2">Quantity (1 unit = 250 gm, Minimum: 1 unit):</label>
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                >
                  -
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold w-12 text-center">{quantity} unit{quantity > 1 ? 's' : ''}</span>
                  <span className="text-sm text-gray-500">({quantityInKg} kg)</span>
                </div>
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
