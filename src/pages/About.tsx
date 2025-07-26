
import { motion } from "framer-motion";
import { Award, Users, Leaf } from "lucide-react";
const About = () => {
  const fadeInUp = {
    initial: {
      opacity: 0,
      y: 30
    },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };
  return <div className="page-transition pt-24">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-organic-50 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 className="section-title" initial={{
            opacity: 0,
            y: -20
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              About Mujkuva Organic
            </motion.h1>
            <motion.div className="w-24 h-1 bg-earth-400 mx-auto mb-8" initial={{
            width: 0
          }} animate={{
            width: 96
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }}></motion.div>
            <motion.p className="text-lg text-gray-700 mb-8" initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} transition={{
            duration: 0.5,
            delay: 0.4
          }}>
              Committed to sustainable agriculture and empowering local farmers through organic practices
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-organic-100 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-earth-100 rounded-full z-0"></div>
                <img src="/lovable-uploads/612110f5-6418-4e8f-9b03-5a591cb78013.png" alt="Mujkuva Organic Logo" className="rounded-lg shadow-lg w-full max-w-md mx-auto relative z-10" />
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-6">Our Story</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  NDDB supported in organizing and registration of one more village level cooperative i.e. Mujkuva Organic Farmers' Cooperative Society where in 21 progressive farmers of Mujkuva village are the members at the beginning. All the registered members have received organic certificate for first year registered under PGS certification.
                </p>
                <p className="mb-4">
                  Hon'ble Union Minister (FAHD), Shri Rajiv Ranjan Singh, presented the certificate of registration to the Chairman of the Organic Cooperative Society in presence of Chairman NDDB and Ms Varsha Joshi, Additional Secretary, FAHD.
                </p>
                <p>
                  This initiative also helps in marketing of the organic produce which encourages farmers to adopt organic farming practices. The organic cooperative society can serve as an inspirational model wherein organic fertiliser generated within the village can be used for regenerative agriculture practices, which enhance soil fertility and improve human health and can be adopted by nearby villages.
                </p>
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            <motion.div className="order-2 md:order-1" initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-6">Our Certification</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  All our members have received organic certification for the first year under PGS (Participatory Guarantee System) certification. This certification validates our commitment to organic farming practices and sustainable agriculture.
                </p>
                <p>
                  The PGS Certification process is a decentralized organic certification system that relies on mutual trust, knowledge sharing, and peer verification. It's designed specifically for small-scale farmers who are committed to organic farming methods.
                </p>
              </div>
            </motion.div>
            
            <motion.div className="order-1 md:order-2" initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <div className="relative flex justify-center">
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-organic-100 rounded-full z-0"></div>
                <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-earth-100 rounded-full z-0"></div>
                <img src="/lovable-uploads/ba79b90b-bbdf-419c-b53f-691ef85173c4.png" alt="PGS Certification" className="rounded-lg shadow-lg w-48 md:w-64 relative z-10" />
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-organic-100 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-earth-100 rounded-full z-0"></div>
                <img src="/lovable-uploads/23941a2e-e600-4a24-bd5e-5f435b868c8a.png" alt="Certificate Presentation" className="rounded-lg shadow-lg w-full max-w-md mx-auto relative z-10" />
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              <h2 className="text-3xl font-serif font-bold text-organic-800 mb-6">Recognition & Achievement</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">The Hon'ble Union Minister (FAHD), Shri Rajiv Ranjan Singh, personally presented the certificate of registration to our Chairman.</p>
                <p>
                  This ceremony, attended by the Chairman of NDDB and Ms. Varsha Joshi, Additional Secretary of FAHD, marks a significant milestone in our journey toward sustainable and organic farming practices in our region.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Our Values */}
      <section className="py-16 bg-organic-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 className="text-4xl font-serif font-bold text-organic-800 mb-4" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.5
          }}>
              Our Core Values
            </motion.h2>
            <motion.div className="w-24 h-1 bg-earth-400 mx-auto" initial={{
            width: 0
          }} whileInView={{
            width: 96
          }} viewport={{
            once: true
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }}></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: <Leaf className="text-organic-500" size={40} />,
            title: "Sustainability",
            description: "We are committed to farming practices that are environmentally responsible and sustainable for future generations."
          }, {
            icon: <Users className="text-organic-500" size={40} />,
            title: "Community",
            description: "We believe in empowering our local farming community through knowledge sharing and collective growth."
          }, {
            icon: <Award className="text-organic-500" size={40} />,
            title: "Quality",
            description: "We maintain the highest standards of quality in our organic produce, ensuring freshness and nutritional value."
          }].map((value, i) => <motion.div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-organic-100" custom={i} variants={fadeInUp} initial="initial" whileInView="animate" viewport={{
            once: true
          }}>
                <div className="flex justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-organic-800 mb-3 text-center">
                  {value.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {value.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>
    </div>;
};
export default About;
