import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getVideosByCategory, getVideosByType } from '../data/videos';
import { VideoType, VideoCategory } from '../types';
import VideoCard from '../components/VideoSection/VideoCard';
import { motion } from 'framer-motion';

interface VideoPageProps {
  type: 'short' | 'long';
}

const VideoPage: React.FC<VideoPageProps> = ({ type }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category') as VideoCategory || 'all';
  
  const [selectedCategory, setSelectedCategory] = useState<VideoCategory>(categoryFromUrl);
  const [videos, setVideos] = useState<VideoType[]>([]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setVideos(getVideosByType(type));
    } else {
      setVideos(getVideosByCategory(selectedCategory, type));
    }
  }, [selectedCategory, type]);

  useEffect(() => {
    // Update URL when category changes
    if (selectedCategory === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', selectedCategory);
    }
    setSearchParams(searchParams);
  }, [selectedCategory]);

  // Categories with display labels
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'documentary', label: 'Documentary' },
    { value: 'talkingHead', label: 'Talking Head' },
    { value: 'advertisement', label: 'Advertisement' },
    { value: 'gaming', label: 'Gaming' },
    { value: 'vlog', label: 'Vlog' }
  ];

  const handleCategoryChange = (category: VideoCategory) => {
    setSelectedCategory(category);
  };

  return (
    <div className="pt-24 pb-20 bg-background min-h-screen">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold font-display mb-4 text-white">
            {type === 'short' ? 'Short Form' : 'Long Form'} <span className="text-primary">Videos</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            {type === 'short' 
              ? 'Browse my collection of short, impactful videos designed for social media and digital platforms.' 
              : 'Explore my portfolio of in-depth, narrative-driven videos that tell complete stories.'}
          </p>
        </motion.div>

        {/* Category Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value as VideoCategory)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-primary text-white'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {videos.length > 0 ? (
            videos.map((video) => (
              <motion.div 
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <VideoCard video={video} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <h3 className="text-xl text-neutral-300 mb-2">No videos found</h3>
              <p className="text-neutral-500">
                No videos matching the selected category were found.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VideoPage;