import { VideoType } from '../types';

export const videos: VideoType[] = [
	{
		id: '1',
		title: 'Dexter VS Zodiac Killer',
		category: 'documentary',
		type: 'long',
		youtubeId: 'Lq-cBox9CK4'
	},
	{
		id: '2',
		title: 'Best Vlog Edits',
		category: 'vlog',
		type: 'long',
		youtubeId: 'VcNNCR__HI0'
	},
	{
		id: '3',
		title: 'Dexter Broke Character',
		category: 'documentary',
		type: 'long',
		youtubeId: 'JH9ERcpwS4g'
	},
	{
		id: '4',
		title: 'College Character Day Gets Wild 😭',
		category: 'vlog',
		type: 'long',
		youtubeId: '0mP8VPjmzlg'
	},
	{
		id: '5',
		title: 'Aurther Mitchel',
		category: 'documentary',
		type: 'long',
		youtubeId: 'Kt59uyfDZMg&rco'
	},
	{
		id: '6',
		title: 'Snoop Dogg in Olympics 2024?',
		category: 'documentary',
		type: 'long',
		youtubeId: 'i57px8pzzWI'
	},
	{
		id: '7',
		title: 'How To Become A Millionaire in 2024',
		category: 'documentary',
		type: 'long',
		youtubeId: 'fupZr88o7-M'
	},
	{
		id: '8',
		title: 'Bollywood Day/Character Day at VIT!',
		category: 'vlog',
		type: 'long',
		youtubeId: 'ELHUP5jFfoY'
	},
	{
		id: '9',
		title: 'Kai Cenat Edit',
		category: 'talkingHead',
		type: 'short',
		youtubeId: 'ycyiH-jDo_Q'
	},
	{
		id: '10',
		title: 'Reel 1',
		category: 'talkingHead',
		type: 'short',
		youtubeId: 'bDXiEe7GBUA'
	},
	{
		id: '11',
		title: 'How to Bulk - 1.4M Views',
		category: 'talkingHead',
		type: 'short',
		youtubeId: '4Iw91tON3Ns'
	},
	{
		id: '12',
		title: 'How to get Jacked - 2M Views',
		category: 'talkingHead',
		type: 'short',
		youtubeId: '6Vr-IIQa9nA'
	},
	{
		id: '13',
		title: 'Ad 1',
		category: 'advertisement',
		type: 'short',
		youtubeId: 'ZBnk2atcdew'
	},
	{
		id: '14',
		title: 'Ad 2',
		category: 'advertisement',
		type: 'short',
		youtubeId: 'qPZ6_dZcn90'
	},
	{
		id: '15',
		title: 'Ad 3',
		category: 'advertisement',
		type: 'short',
		youtubeId: 'd6dkNWVVVME'
	}
];

export const getFeaturedVideos = (type?: 'short' | 'long') => {
  if (type) {
    return videos.filter(video => video.type === type).slice(0, 5);
  }
  return videos.slice(0, 5);
};

export const getVideosByType = (type: 'short' | 'long') => {
  return videos.filter(video => video.type === type);
};

export const getVideosByCategory = (category: string, type: 'short' | 'long') => {
  if (category === 'all') {
    return getVideosByType(type);
  }
  return videos.filter(video => 
    video.category === category && video.type === type
  );
};
