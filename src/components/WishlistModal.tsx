import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WishlistItem {
  id: string;
  produceName: string;
  produceValue: string; // Store the value for dropdown matching
  language: string;
  isCustom: boolean;
}

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Common vegetables with English, Hindi, and Gujarati names
const commonVegetables = [
  { english: "Tomato", hindi: "टमाटर (Tamatar)", gujarati: "ટામેટા (Tameta)", value: "Tomato" },
  { english: "Onion", hindi: "प्याज (Pyaz)", gujarati: "ડુંગળી (Dungli)", value: "Onion" },
  { english: "Potato", hindi: "आलू (Aloo)", gujarati: "બટાટા (Batata)", value: "Potato" },
  { english: "Brinjal", hindi: "बैंगन (Baingan)", gujarati: "રીંગણ (Ringan)", value: "Brinjal" },
  { english: "Okra", hindi: "भिंडी (Bhindi)", gujarati: "ભીંડી (Bhindi)", value: "Okra" },
  { english: "Cucumber", hindi: "खीरा (Kheera)", gujarati: "કાકડી (Kakdi)", value: "Cucumber" },
  { english: "Bottle Gourd", hindi: "लौकी (Lauki)", gujarati: "દુધી (Dudhi)", value: "Bottle Gourd" },
  { english: "Ridge Gourd", hindi: "तोरी (Tori)", gujarati: "તુરીયા (Turiyo)", value: "Ridge Gourd" },
  { english: "Bitter Gourd", hindi: "करेला (Karela)", gujarati: "કારેલું (Karelu)", value: "Bitter Gourd" },
  { english: "Spinach", hindi: "पालक (Palak)", gujarati: "પાલક (Palak)", value: "Spinach" },
  { english: "Fenugreek", hindi: "मेथी (Methi)", gujarati: "મેથી (Methi)", value: "Fenugreek" },
  { english: "Coriander", hindi: "धनिया (Dhaniya)", gujarati: "કોથમીર (Kothmir)", value: "Coriander" },
  { english: "Mint", hindi: "पुदीना (Pudina)", gujarati: "પુદીના (Pudina)", value: "Mint" },
  { english: "Cauliflower", hindi: "फूलगोभी (Phoolgobhi)", gujarati: "ફૂલકોબી (Phoolkobi)", value: "Cauliflower" },
  { english: "Cabbage", hindi: "पत्तागोभी (Pattagobhi)", gujarati: "કોબી (Kobi)", value: "Cabbage" },
  { english: "Carrot", hindi: "गाजर (Gajar)", gujarati: "ગાજર (Gajar)", value: "Carrot" },
  { english: "Radish", hindi: "मूली (Mooli)", gujarati: "મૂળો (Mulo)", value: "Radish" },
  { english: "Beetroot", hindi: "चुकंदर (Chukandar)", gujarati: "બીટ (Beet)", value: "Beetroot" },
  { english: "Green Beans", hindi: "फलियां (Faliyan)", gujarati: "ફલિયા (Faliya)", value: "Green Beans" },
  { english: "Peas", hindi: "मटर (Matar)", gujarati: "વટાણા (Vatana)", value: "Peas" },
  { english: "Capsicum", hindi: "शिमला मिर्च (Shimla Mirch)", gujarati: "બટાકા મરચાં (Bataka Marcha)", value: "Capsicum" },
  { english: "Chili", hindi: "मिर्च (Mirch)", gujarati: "મરચાં (Marcha)", value: "Chili" },
  { english: "Ginger", hindi: "अदरक (Adrak)", gujarati: "આદુ (Adu)", value: "Ginger" },
  { english: "Garlic", hindi: "लहसुन (Lahsun)", gujarati: "લસણ (Lasun)", value: "Garlic" },
  { english: "Lemon", hindi: "नींबू (Nimbu)", gujarati: "લીંબુ (Limbu)", value: "Lemon" },
  { english: "Tindora", hindi: "तेंडली (Tendli)", gujarati: "તેંડલી (Tendli)", value: "Tindora" },
];

const WishlistModal = ({ isOpen, onClose }: WishlistModalProps) => {
  const [items, setItems] = useState<WishlistItem[]>([
    { id: crypto.randomUUID(), produceName: "", produceValue: "", language: "English", isCustom: false }
  ]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), produceName: "", produceValue: "", language: "English", isCustom: false }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof WishlistItem, value: string | boolean) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const updateItemMultiple = (id: string, updates: Partial<WishlistItem>) => {
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one produce item is filled
    const validItems = items.filter(item => item.produceName.trim() !== "");
    if (validItems.length === 0) {
      toast.error("Please add at least one produce item");
      return;
    }

    setIsSubmitting(true);

    try {
      // Insert each wishlist item separately
      const insertPromises = validItems.map(item => 
        supabase
          .from('consumer_wishlist')
          .insert({
            produce_name: item.produceName.trim(),
            language: item.language,
            customer_name: customerName.trim() || null,
            customer_phone: customerPhone.trim() || null,
            customer_email: customerEmail.trim() || null,
            notes: item.isCustom ? "Custom produce request" : null
          })
      );

      const results = await Promise.all(insertPromises);
      
      // Check for errors
      const hasError = results.some(result => result.error);
      if (hasError) {
        const errors = results.filter(r => r.error).map(r => r.error?.message);
        throw new Error(errors.join(", "));
      }

      // Reset form
      setItems([{ id: crypto.randomUUID(), produceName: "", produceValue: "", language: "English", isCustom: false }]);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");

      toast.success(`Successfully submitted ${validItems.length} wishlist item(s)!`);
      onClose();
    } catch (error: any) {
      console.error("Wishlist submission error:", error);
      toast.error(error.message || "Failed to submit wishlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-organic-800">
                  What are you looking for?
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <p className="text-gray-600 text-sm">
                  Please enter the produce that you would like to purchase in the future
                </p>

                {/* Customer Details (Optional) */}
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-organic-800">Your Details (Optional)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-500 focus:outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-500 focus:outline-none"
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-500 focus:outline-none"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                </div>

                {/* Produce Items */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-organic-800">Produce Items</h3>
                    <button
                      type="button"
                      onClick={addItem}
                      className="flex items-center gap-2 text-organic-600 hover:text-organic-700 text-sm font-medium"
                    >
                      <Plus size={16} />
                      Add Item
                    </button>
                  </div>

                  {items.map((item, index) => (
                    <div key={item.id} className="p-4 border border-gray-200 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>

                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`produce-type-${item.id}`}
                            checked={!item.isCustom}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateItemMultiple(item.id, {
                                  isCustom: false,
                                  produceName: "",
                                  produceValue: ""
                                });
                              }
                            }}
                            className="text-organic-600 cursor-pointer"
                          />
                          <span className="text-sm cursor-pointer">From List</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name={`produce-type-${item.id}`}
                            checked={item.isCustom}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateItemMultiple(item.id, {
                                  isCustom: true,
                                  produceName: "",
                                  produceValue: ""
                                });
                              }
                            }}
                            className="text-organic-600 cursor-pointer"
                          />
                          <span className="text-sm cursor-pointer">Others</span>
                        </label>
                      </div>

                      {!item.isCustom ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Select Produce
                            </label>
                            <select
                              value={item.produceValue || ""}
                              onChange={(e) => {
                                const selectedValue = e.target.value;
                                const selected = commonVegetables.find(v => v.value === selectedValue);
                                if (selected) {
                                  // Store both the value (for dropdown) and English name (for database)
                                  updateItemMultiple(item.id, {
                                    produceValue: selected.value,
                                    produceName: selected.english,
                                    language: "English"
                                  });
                                } else {
                                  updateItemMultiple(item.id, {
                                    produceValue: selectedValue,
                                    produceName: selectedValue
                                  });
                                }
                              }}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-500 focus:border-organic-500 focus:outline-none bg-white text-gray-900"
                              required={index === 0}
                            >
                              <option value="">Select a produce...</option>
                              {commonVegetables.map((veg) => (
                                <option key={veg.value} value={veg.value}>
                                  {veg.english} - {veg.hindi} - {veg.gujarati}
                                </option>
                              ))}
                            </select>
                            {item.produceValue && (
                              <p className="mt-2 text-sm text-organic-600 font-medium">
                                Selected: {item.produceName}
                              </p>
                            )}
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Produce Name
                            </label>
                            <input
                              type="text"
                              value={item.produceName}
                              onChange={(e) => updateItem(item.id, "produceName", e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-500 focus:border-organic-500 focus:outline-none"
                              placeholder="Enter produce name..."
                              required={index === 0}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Language
                            </label>
                            <select
                              value={item.language}
                              onChange={(e) => updateItem(item.id, "language", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-500 focus:outline-none"
                            >
                              <option value="English">English</option>
                              <option value="Hindi">Hindi</option>
                              <option value="Gujarati">Gujarati</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-organic-600 text-white rounded-lg hover:bg-organic-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Wishlist"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WishlistModal;

