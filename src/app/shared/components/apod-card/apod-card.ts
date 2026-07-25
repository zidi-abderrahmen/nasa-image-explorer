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
  @Input({ required: true }) apod!: Apod;
  @Input() isFavorite = false;
  @Input() mode: 'browse' | 'favorite' = 'browse';
  @Input() descriptionLength = 120;

  @Output() toggleFavorite = new EventEmitter<Event>();
  @Output() remove = new EventEmitter<Event>();

  isImageLoaded = false;

  onImageLoad(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.decode()
      .then(() => this.isImageLoaded = true)
      .catch(() => this.isImageLoaded = true);
  }

  onToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.toggleFavorite.emit(event);
  }

  onRemove(event: Event): void {
    event.stopPropagation();
    this.remove.emit(event);
  }

  get displayImageUrl(): string {
    if (this.apod.media_type === 'video' && this.apod.thumbnail_url) {
      return this.apod.thumbnail_url;
    }
    return this.apod.url;
  }
}