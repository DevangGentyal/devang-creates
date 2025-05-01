import React from 'react';
import { motion } from 'framer-motion';

const SoftwareSection: React.FC = () => {
  const software = [
    {
      name: 'Adobe Premiere Pro',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Adobe_Premiere_Pro_CC_icon.svg',
      proficiency: 95
    },
    {
      name: 'Adobe After Effects',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/c/cb/Adobe_After_Effects_CC_icon.svg',
      proficiency: 90
    },
    {
      name: 'CapCut',
      logo: 'https://static.vecteezy.com/system/resources/previews/013/948/546/non_2x/capcut-logo-on-transparent-white-background-free-vector.jpg',
      proficiency: 85
    },
    {
      name: 'Adobe Photoshop',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Adobe_Photoshop_CC_icon.svg',
      proficiency: 80
    },
    {
      name: 'Canva',
      logo: 'https://freepnglogo.com/images/all_img/1691829322canva-app-logo-png.png',
      proficiency: 85
    }
  ];

  return (
    <section id="software" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold font-display mb-4 text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Software & <span className="text-primary">Skills</span>
          </motion.h2>
          <motion.p 
            className="text-neutral-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Mastering industry-standard editing tools to deliver professional results
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {software.map((tool, index) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background-light p-6 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <img 
                  src={tool.logo} 
                  alt={tool.name} 
                  className="w-16 h-16 mb-4"
                />
                <h3 className="text-white text-center text-sm font-medium mb-3">{tool.name}</h3>
                
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SoftwareSection;