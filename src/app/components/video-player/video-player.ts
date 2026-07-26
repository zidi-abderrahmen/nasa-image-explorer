import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { VideoUrlPipe } from '../../shared/pipes/videoUrl/video-url-pipe';

@Component({
  selector: 'app-video-player',
  imports: [CommonModule, MatIconModule, VideoUrlPipe],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer {
  @Input() apodUrl!: string;
  @Input() title = 'NASA Video';
  @Input() thumbnailUrl?: string;
}
