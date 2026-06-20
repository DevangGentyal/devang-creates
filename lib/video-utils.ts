/**
 * Convert YouTube URLs to embed format
 * Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/share?v=ID, or just the ID
 */
export function getYouTubeEmbedUrl(url: string): string {
  try {
    if (!url) return '';
    
    let videoId = '';

    // youtube.com/embed/VIDEO_ID
    if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0].split('&')[0];
    }
    // youtube.com/watch?v=VIDEO_ID or youtube.com/share?v=VIDEO_ID
    else if (url.includes('youtube.com/watch') || url.includes('youtube.com/share')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    }
    // youtu.be/VIDEO_ID or youtu.be/VIDEO_ID?
    else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0].split('&')[0];
    }
    // Just a video ID (11-12 chars, alphanumeric, underscore, hyphen)
    else if (/^[a-zA-Z0-9_-]{11,12}$/.test(url.trim())) {
      videoId = url.trim();
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    }

    return url;
  } catch (error) {
    console.error('[v0] Error converting YouTube URL:', error);
    return url;
  }
}

/**
 * Convert Google Drive URLs to embed format
 * Handles share links and various Google Drive URL formats
 */
export function getGoogleDriveEmbedUrl(url: string): string {
  try {
    if (!url) return '';
    
    let fileId = '';

    // Handle /file/d/FILE_ID/view?usp=sharing format
    if (url.includes('drive.google.com/file/d/')) {
      fileId = url.split('drive.google.com/file/d/')[1].split('/')[0];
    } 
    // Handle /open?id=FILE_ID format
    else if (url.includes('drive.google.com/open?id=')) {
      fileId = url.split('id=')[1].split('&')[0];
    } 
    // Handle folder format
    else if (url.includes('drive.google.com/drive/folders/')) {
      fileId = url.split('drive.google.com/drive/folders/')[1].split('?')[0];
    } 
    // Handle uc?id=FILE_ID format (direct download link)
    else if (url.includes('drive.google.com/uc?id=')) {
      fileId = url.split('id=')[1].split('&')[0];
    }
    // Just a file ID
    else if (/^[a-zA-Z0-9_-]+$/.test(url.trim()) && url.trim().length > 20) {
      fileId = url.trim();
    }

    if (fileId) {
      // Use the embed URL format for Google Drive
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }

    return url;
  } catch (error) {
    console.error('[v0] Error converting Google Drive URL:', error);
    return url;
  }
}

/**
 * Get the appropriate embed URL based on video source
 */
export function getEmbedUrl(url: string, source: string = 'youtube'): string {
  if (source === 'google-drive') {
    return getGoogleDriveEmbedUrl(url);
  }
  return getYouTubeEmbedUrl(url);
}

/**
 * Get video thumbnail URL (YouTube only)
 */
export function getVideoThumbnail(url: string): string {
  try {
    let videoId = '';

    if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch') || url.includes('youtube.com/share')) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (/^[a-zA-Z0-9_-]{11,12}$/.test(url.trim())) {
      videoId = url.trim();
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }

    return '';
  } catch (error) {
    console.error('[v0] Error getting video thumbnail:', error);
    return '';
  }
}
