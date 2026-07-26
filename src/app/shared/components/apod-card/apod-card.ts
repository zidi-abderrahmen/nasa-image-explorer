import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Apod } from '../../../core/models/apod';

@Component({
  selector: 'app-apod-card',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatTooltipModule],
  templateUrl: './apod-card.html',
  styleUrl: './apod-card.scss',
})
export class ApodCard {
  @Input() apod!: Apod;
  @Input() mode: 'browse' | 'favorite' = 'browse';
  @Input() isFavorite = false;
  @Input() descriptionLength = 120;

  @Output() toggleFavorite = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  isImageLoaded = false;

  onImageLoad(event: Event): void {
    this.isImageLoaded = true;
  }

  onToggleFavorite(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.toggleFavorite.emit();
  }

  onRemove(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.remove.emit();
  }

  get displayImageUrl(): string {
    if (this.apod?.media_type === 'video') {
      return this.apod.thumbnail_url || 'assets/video-placeholder.jpg';
    }
    return this.apod?.url;
  }
}