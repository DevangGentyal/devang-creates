import React from 'react';
import { Camera, Award, Users, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AboutSection: React.FC = () => {
  const stats = [
    { icon: <Camera className="h-6 w-6" />, value: '50+', label: 'Projects Completed' },
    { icon: <Award className="h-6 w-6" />, value: '4M+', label: 'Most Viewed Edit' },
    { icon: <Users className="h-6 w-6" />, value: '20+', label: 'Happy Clients' },
    { icon: <Clock className="h-6 w-6" />, value: '1+', label: 'Years Experience' },
  ];

  return (
    <section id="about" className="py-20 bg-background-dark">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="rounded-lg overflow-hidden"
              >
                <img 
                  src="https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg" 
                  alt="Video Editor at Work" 
                  className="w-full h-auto rounded-lg"
                />
              </motion.div>
              
              <div className="absolute -top-5 -left-5 w-24 h-24 border-2 border-primary rounded-lg z-0"></div>
              <div className="absolute -bottom-5 -right-5 w-24 h-24 border-2 border-accent rounded-lg z-0"></div>
            </div>
          </div>
          
          <div className="order-1 md:order-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display mb-6 text-white">
                About <span className="text-primary">Me</span>
              </h2>
              
              <p className="text-neutral-300 mb-6">
                I'm Devang Gentyal, a professional video editor and content creator with over a year of 
                experience crafting engaging visual content. My work spans across various formats, from 
                viral short-form content to long-form videos that tell compelling stories.
              </p>
              
              <p className="text-neutral-300 mb-6">
                I've had the privilege of working with notable creators like @_prem_joshi, where my edits 
                consistently achieved over 1M+ views, with one edit surpassing 4M views. My international 
                client portfolio includes working with Stand Out Content (@standoutcontent) and various 
                other creators.
              </p>
              
              <p className="text-neutral-300 mb-8">
                As both a creator and editor, I bring a unique perspective to each project. You can find my work 
                on YouTube (@devangcreates) and Instagram (@devang_gentyal, @devang.creates), where I showcase 
                my editing style and creative vision.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-3">
                      {stat.icon}
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-1">{stat.value}</h4>
                    <p className="text-sm text-neutral-400">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
              
              <button className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-md font-medium transition-colors">
                Download Showreel
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;