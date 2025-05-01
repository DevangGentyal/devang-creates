import React from 'react';
import Hero from '../components/Hero/Hero';
import VideoCarousel from '../components/VideoSection/VideoCarousel';
import AboutSection from '../components/About/AboutSection';
import SoftwareSection from '../components/Software/SoftwareSection';
import ContactForm from '../components/Contact/ContactForm';
import { getFeaturedVideos } from '../data/videos';

const HomePage: React.FC = () => {
  const featuredShortVideos = getFeaturedVideos('short');
  const featuredLongVideos = getFeaturedVideos('long');

  return (
    <div>
      <Hero />
      
      <section id="featured" className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4 text-white">
              Featured <span className="text-primary">Work</span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Browse through my portfolio of selected projects. Each video showcases my skill and 
              versatility as a video editor across different formats and genres.
            </p>
          </div>
          
          <div className="space-y-20">
            <VideoCarousel 
              videos={featuredShortVideos} 
              title="Short Form Content" 
              subtitle="Engaging, high-impact short-form videos optimized for social media and quick consumption."
            />
            
            <VideoCarousel 
              videos={featuredLongVideos} 
              title="Long Form Content" 
              subtitle="Immersive long-form videos that tell comprehensive stories with depth and nuance."
            />
          </div>
        </div>
      </section>
      
      <AboutSection />
      <SoftwareSection />
      <ContactForm />
    </div>
  );
};

export default HomePage;