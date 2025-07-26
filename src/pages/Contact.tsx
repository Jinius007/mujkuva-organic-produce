
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          message: formData.message
        });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
      
      toast.success("Message sent successfully!");
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Contact Us
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
              Have questions about our products or services? Get in touch with us.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-8">
                Get in Touch
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-organic-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-organic-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-organic-800 mb-2">Email Us</h3>
                    <p className="text-gray-700 mb-1">
                      For any queries regarding orders or the certification, please reach out to:
                    </p>
                    <a href="mailto:mrpatel@nddb.coop" className="text-organic-600 hover:text-organic-700 block">
                      mrpatel@nddb.coop
                    </a>
                    <a href="mailto:sinjini@nddb.coop" className="text-organic-600 hover:text-organic-700 block">
                      sinjini@nddb.coop
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-organic-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-organic-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-organic-800 mb-2">Call Us</h3>
                    <p className="text-gray-700 mb-1">
                      Need immediate assistance? Give us a call:
                    </p>
                    <a href="tel:+919879078182" className="text-organic-600 hover:text-organic-700 block">
                      +91 98790 78182
                    </a>
                    <a href="tel:+917738408994" className="text-organic-600 hover:text-organic-700 block">
                      +91 77384 08994
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-organic-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-organic-600" size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-organic-800 mb-2">Visit Us</h3>
                    <p className="text-gray-700">
                      Mujkuva Village, Anand District,<br />
                      Gujarat, India
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12 p-6 bg-organic-50 rounded-lg border border-organic-100">
                <h3 className="text-lg font-bold text-organic-800 mb-4">Our Business Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monday - Friday:</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Saturday:</span>
                    <span className="font-medium">9:00 AM - 2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-8">
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input-field"
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    Your Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="input-field"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full sm:w-auto flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
              
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Note:</span> We value your privacy. Any information you provide will only be used to respond to your inquiry and will not be shared with third parties.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 bg-organic-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-organic-800 mb-4">
              Find Us
            </h2>
            <p className="text-gray-700 max-w-2xl mx-auto">
              Visit our cooperative in Mujkuva Village, Anand District, Gujarat to see our organic farming practices in action.
            </p>
          </div>
          
          <div className="bg-white p-2 rounded-xl shadow-lg overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14744.914379867514!2d72.94141637913824!3d22.53665896697885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e50c0f8fccc7d%3A0x77e5f0fb5b0dc02f!2sMujkuva%2C%20Gujarat%20388001!5e0!3m2!1sen!2sin!4v1656427312182!5m2!1sen!2sin!4v1656427312182!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Mujkuva Village Map"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
