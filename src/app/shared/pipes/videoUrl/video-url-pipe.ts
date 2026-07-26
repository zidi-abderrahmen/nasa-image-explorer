import { Pipe, PipeTransform } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

export type VideoType = 'youtube' | 'direct' | 'external';

export interface ProcessedVideo {
  type: VideoType;
  url: string | SafeResourceUrl;
  thumbnail?: string;
}

@Pipe({
  name: 'videoUrl',
  standalone: true
})
export class VideoUrlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): ProcessedVideo {
    if (!url) return { type: 'external', url: '' };

    const youtubeMatch = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (youtubeMatch) {
      const embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1`;
      return {
        type: 'youtube',
        url: this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl),
        thumbnail: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
      };
    }

    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      const embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      return {
        type: 'youtube', // same iframe logic
        url: this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl),
      };
    }

    if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) {
      return {
        type: 'direct',
        url: url
      };
    }

    return {
      type: 'external',
      url: url
    };
  }

}
