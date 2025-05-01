export interface VideoType {
  id: string;
  youtubeId: string;
  type: 'short' | 'long';
  category: VideoCategory;
  title: string;
}

export type VideoCategory = 'documentary' | 'talkingHead' | 'advertisement' | 'gaming' | 'vlog' | 'all';

export interface SoftwareSkill {
  name: string;
  icon: string;
  proficiency: number;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
}