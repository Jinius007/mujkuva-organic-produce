
import { motion } from "framer-motion";
import { Check, Award, FileText } from "lucide-react";

const AboutCertification = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1 * i,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
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
              Our PGS Certification
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
              Understanding our commitment to organic standards and sustainable farming practices
            </motion.p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="prose prose-lg max-w-none"
              >
                <h2 className="text-3xl font-serif font-bold text-organic-800 mb-6">About PGS Certification</h2>
                
                <p>
                  Participatory Guarantee System (PGS) Certification is a decentralized organic certification system recognized by the Government of India under the PGS-India program. It is affordable, farmer-friendly, and community-based, relying on mutual trust, knowledge sharing, and peer verification rather than third-party audits.
                </p>
                
                <p>
                  Small and marginal farmers form local groups to self-evaluate and verify each other's organic farming practices based on set standards. This system helps farmers market their produce as "PGS-Organic" while ensuring transparency, credibility, and compliance with organic farming principles.
                </p>
                
                <h3 className="text-2xl font-serif font-bold text-organic-800 mt-10 mb-6">The Certification Process</h3>
                
                <p>
                  The PGS Certification process begins with the formation of farmer groups, where local farmers join under the PGS-India program. After registering and committing to organic farming standards, farmers undergo training to familiarize themselves with the certification requirements.
                </p>
                
                <p>
                  The process includes field inspections by fellow group members, who review each other's farms and practices to ensure adherence to organic methods. The inspection is followed by a peer review and the certification is granted based on mutual evaluation.
                </p>
                
                <p>
                  The first level of certification, PGS Organic 1, is awarded after the first year, indicating that the farm is on its way to becoming fully organic but is still in the transition phase.
                </p>
                
                <h3 className="text-2xl font-serif font-bold text-organic-800 mt-10 mb-6">Our Certification Status</h3>
                
                <p>
                  After completing the first year under PGS Organic 1, farmers work towards achieving the final stage of certification, PGS Organic 2, which can be attained after a three-year period of consistent organic practices.
                </p>
                
                <p>
                  The PGS Organic 1 certification affirms that the farming practices adhere to organic standards, though the farm is still in the conversion stage. We are proud to have obtained the PGS Organic 1 certification after the first year, demonstrating our commitment to sustainable and organic farming practices, with the goal of reaching full certification in the coming years.
                </p>
                
                <div className="mt-10 p-6 bg-organic-50 rounded-lg border border-organic-100">
                  <h4 className="text-xl font-bold text-organic-800 mb-4">Our Commitment</h4>
                  <p className="mb-0">
                    At Mujkuva Organic Farmers' Cooperative Society, we're fully committed to adhering to the principles and standards of organic farming. Our certification journey represents our dedication to providing genuinely organic produce to our consumers while ensuring sustainable farming practices that benefit both the environment and our community.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="sticky top-24"
              >
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-organic-100">
                  <div className="p-6 bg-organic-500 text-white">
                    <h3 className="text-xl font-bold mb-2">PGS Certification Benefits</h3>
                    <p className="text-organic-50">
                      Why this certification matters for farmers and consumers
                    </p>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-4">
                      {[
                        "Cost-effective certification approach for small farmers",
                        "Encourages knowledge sharing among farmer communities",
                        "Builds trust between producers and consumers",
                        "Maintains high standards of organic farming practices",
                        "Provides market access for small-scale organic farmers",
                        "Supports sustainable and regenerative agriculture"
                      ].map((benefit, i) => (
                        <li key={i} className="flex">
                          <Check size={20} className="text-organic-500 mt-1 mr-3 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center justify-center">
                      <img 
                        src="/lovable-uploads/ba79b90b-bbdf-419c-b53f-691ef85173c4.png" 
                        alt="PGS Certification Logo" 
                        className="h-28 object-contain"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-organic-100">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-organic-100 p-3 rounded-full">
                        <Award className="text-organic-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-organic-800 mb-2">Recognition</h3>
                        <p className="text-gray-600">
                          Our cooperative has received official recognition from the Union Minister (FAHD) and NDDB for our organic farming initiatives.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden border border-organic-100">
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-organic-100 p-3 rounded-full">
                        <FileText className="text-organic-600" size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-organic-800 mb-2">Documentation</h3>
                        <p className="text-gray-600">
                          We maintain transparent documentation of all our organic farming practices as required by PGS certification standards.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Certification Steps */}
      <section className="py-16 bg-organic-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              className="text-4xl font-serif font-bold text-organic-800 mb-4"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              PGS Certification Process
            </motion.h2>
            <motion.div 
              className="w-24 h-1 bg-earth-400 mx-auto mb-6"
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
            ></motion.div>
            <motion.p
              className="max-w-2xl mx-auto text-gray-700"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              The journey from conventional to certified organic farming
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Group Formation",
                description: "Farmers form local groups under the PGS-India program and commit to organic standards."
              },
              {
                step: "02",
                title: "Training & Documentation",
                description: "Members undergo training on organic practices and begin documenting their farming methods."
              },
              {
                step: "03",
                title: "Peer Inspections",
                description: "Fellow group members conduct field inspections to verify adherence to organic methods."
              },
              {
                step: "04",
                title: "Certification",
                description: "PGS Organic 1 certification is granted after the first year, with full certification after 3 years."
              }
            ].map((step, i) => (
              <motion.div
                key={i}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-organic-100"
                custom={i}
                variants={fadeInUp}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 bg-organic-100 rounded-full flex items-center justify-center text-organic-700 font-bold text-lg mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-organic-800 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutCertification;
