import React from 'react';
import { VideoType } from '../../types';
import { motion } from 'framer-motion';

interface VideoCardProps {
  video: VideoType;
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  return (
    <motion.div
      className="relative rounded-lg overflow-hidden bg-background-light"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="aspect-video relative">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          className="absolute top-0 left-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </motion.div>
  );
};

export default VideoCard;