import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { VideoType } from '../../types';
import VideoCard from './VideoCard';

interface VideoCarouselProps {
  videos: VideoType[];
  title: string;
  subtitle?: string;
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos, title, subtitle }) => {
  const sliderRef = useRef<Slider | null>(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  const handlePrev = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  return (
    <div className="relative">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold font-display text-white mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-neutral-400 text-sm md:text-base">
              {subtitle}
            </p>
          )}
        </div>
        <div className="flex mt-4 md:mt-0 space-x-2">
          <button 
            onClick={handlePrev}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={handleNext}
            className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white transition-colors"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <Slider ref={sliderRef} {...settings} className="video-carousel">
        {videos.map((video) => (
          <div key={video.id} className="px-2">
            <VideoCard video={video} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VideoCarousel;