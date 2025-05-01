import React from 'react';
import { Link } from 'react-router-dom';
import { Play, Film, VideoIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background video or image with overlay */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 object-cover w-full h-full opacity-40"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-56431-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/70 to-background"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1 
            className="text-4xl md:text-6xl font-bold font-display mb-4 text-white leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Crafting Visual <span className="text-primary">Stories</span> That Captivate
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-neutral-300 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Professional video editing for short-form and long-form content that 
            drives engagement and tells compelling stories.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link 
              to="/short-form" 
              className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-colors"
            >
              <VideoIcon className="mr-2 h-5 w-5" />
              Short Form
            </Link>
            <Link 
              to="/long-form" 
              className="inline-flex items-center justify-center px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-md font-medium transition-colors"
            >
              <Film className="mr-2 h-5 w-5" />
              Long Form
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <a href="#featured" className="inline-flex items-center text-neutral-400 hover:text-primary transition-colors">
              <span className="mr-2">View My Work</span>
              <div className="animate-bounce">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated gradient elements */}
      <div className="absolute top-1/4 -left-40 w-80 h-80 bg-primary/20 rounded-full filter blur-3xl animate-pulse-slow opacity-30"></div>
      <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-accent/20 rounded-full filter blur-3xl animate-pulse-slow opacity-30"></div>
    </section>
  );
};

export default Hero;