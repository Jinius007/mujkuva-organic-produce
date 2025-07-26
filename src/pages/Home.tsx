import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Award, Users, ShoppingBag } from "lucide-react";

const Home = () => {
  const fadeIn = {
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

  return <div className="page-transition">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-organic-50 to-white pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07')] bg-cover bg-center opacity-10"></div>
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <motion.div initial={{
              opacity: 0,
              y: 30
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              duration: 0.5
            }}>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-organic-800 leading-tight mb-6">
                  Pure Organic <br />
                  <span className="text-earth-500">Goodness</span>, From <br />
                  Farm to Home
                </h1>
                <p className="text-lg md:text-xl text-gray-700 mb-8 md:max-w-lg">
                  Experience the authentic taste of certified organic produce from Mujkuva Organic Farmer Cooperative Society.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link to="/produce" className="btn-primary flex items-center justify-center space-x-2">
                    <span>Shop Now</span>
                    <ArrowRight size={18} />
                  </Link>
                  <Link to="/about" className="btn-secondary flex items-center justify-center space-x-2">
                    <span>Learn More</span>
                  </Link>
                </div>
              </motion.div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} animate={{
              opacity: 1,
              scale: 1
            }} transition={{
              duration: 0.5,
              delay: 0.2
            }} className="relative">
                <div className="w-72 h-72 md:w-96 md:h-96 bg-organic-300 rounded-full opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                <img src="/lovable-uploads/612110f5-6418-4e8f-9b03-5a591cb78013.png" alt="Mujkuva Organic Logo" className="w-80 h-80 md:w-[400px] md:h-[400px] object-contain relative z-10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 className="text-4xl font-serif font-bold text-organic-800 mb-4" initial={{
            opacity: 0,
            y: 30
          }} animate={{
            opacity: 1,
            y: 0
          }} transition={{
            duration: 0.5
          }}>
              Why Choose Mujkuva Organic?
            </motion.h2>
            <motion.div className="w-24 h-1 bg-earth-400 mx-auto" initial={{
            width: 0
          }} animate={{
            width: 96
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }}></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[{
            icon: <Leaf className="text-organic-500" size={40} />,
            title: "100% Organic",
            description: "All our produce is grown using organic farming methods, certified under PGS Organic standards."
          }, {
            icon: <Award className="text-organic-500" size={40} />,
            title: "PGS Certified",
            description: "Our cooperative has received first-year certification under the Participatory Guarantee System."
          }, {
            icon: <Users className="text-organic-500" size={40} />,
            title: "Farmer Cooperative",
            description: "We are a group of 21 progressive farmers from Mujkuva village committed to sustainable agriculture."
          }].map((feature, i) => <motion.div key={i} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-organic-100" custom={i} variants={fadeIn} initial="initial" whileInView="animate" viewport={{
            once: true,
            margin: "-50px"
          }}>
                <div className="flex justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-organic-800 mb-3 text-center">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>)}
          </div>
        </div>
      </section>

      {/* About Cooperative Society Section */}
      <section className="py-20 bg-organic-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 className="text-4xl font-serif font-bold text-organic-800 mb-4" initial={{
            opacity: 0,
            y: 30
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true,
            margin: "-50px"
          }} transition={{
            duration: 0.5
          }}>
              About Mujkuva Organic Farmers' Cooperative Society
            </motion.h2>
            <motion.div className="w-24 h-1 bg-earth-400 mx-auto" initial={{
            width: 0
          }} whileInView={{
            width: 96
          }} viewport={{
            once: true,
            margin: "-50px"
          }} transition={{
            duration: 0.7,
            delay: 0.3
          }}></motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{
            opacity: 0,
            x: -30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true,
            margin: "-50px"
          }} transition={{
            duration: 0.5
          }}>
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-organic-100 rounded-full z-0"></div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-earth-100 rounded-full z-0"></div>
                <img src="/lovable-uploads/612110f5-6418-4e8f-9b03-5a591cb78013.png" alt="Mujkuva Organic Logo" className="w-full rounded-lg shadow-lg relative z-10" />
              </div>
            </motion.div>
            
            <motion.div initial={{
            opacity: 0,
            x: 30
          }} whileInView={{
            opacity: 1,
            x: 0
          }} viewport={{
            once: true,
            margin: "-50px"
          }} transition={{
            duration: 0.5
          }}>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  Mujkuva Organic Farmers' Cooperative Society was established with the support of NDDB (National Dairy Development Board) to promote organic farming practices in the village of Mujkuva.
                </p>
                <p className="mb-4">
                  Our cooperative consists of 21 progressive farmers who are committed to sustainable agriculture and organic farming methods. All of our members have received organic certification for the first year under PGS (Participatory Guarantee System) certification.
                </p>
                <p className="mb-4">
                  The Hon'ble Union Minister (FAHD), Shri Rajiv Ranjan Singh, personally presented the certificate of registration to our Chairman in the presence of the Chairman of NDDB and Ms. Varsha Joshi, Additional Secretary of FAHD.
                </p>
                <p>
                  Our initiative helps in marketing organic produce, which encourages farmers to adopt organic farming practices. The cooperative serves as an inspirational model where organic fertilizer generated within the village is used for regenerative agriculture practices.
                </p>
              </div>
              
              <div className="mt-8">
                <Link to="/about" className="btn-primary inline-flex items-center space-x-2">
                  <span>Learn More About Us</span>
                  <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-organic-600 to-organic-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 className="text-3xl md:text-4xl font-serif font-bold mb-6" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-50px"
        }} transition={{
          duration: 0.5
        }}>
            Ready to Experience the Organic Difference?
          </motion.h2>
          <motion.p className="text-lg md:text-xl mb-10 max-w-2xl mx-auto" initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-50px"
        }} transition={{
          duration: 0.5,
          delay: 0.2
        }}>
            Join us in supporting sustainable farming practices while enjoying the fresh taste and health benefits of organic produce.
          </motion.p>
          <motion.div initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: "-50px"
        }} transition={{
          duration: 0.5,
          delay: 0.3
        }}>
            <Link to="/produce" className="btn-secondary bg-white text-organic-700 hover:bg-gray-100">
              Shop Organic Produce
            </Link>
          </motion.div>
        </div>
      </section>
    </div>;
};

export default Home;
