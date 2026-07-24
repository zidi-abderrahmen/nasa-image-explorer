import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NasaApi } from '../../core/services/nasa-api';
import { FavoritesService } from '../../core/services/favorites';
import { Apod } from '../../core/models/apod';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-image-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './image-detail.html',
  styleUrl: './image-detail.scss',
})
export class ImageDetail {
  apod?: Apod;
  loading = true;
  error?: string;
  safeUrl?: SafeResourceUrl;

  constructor(
    private route: ActivatedRoute,
    private nasaApi: NasaApi,
    public favoritesService: FavoritesService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const date = params['date'];
      if (date) {
        this.loadApodByDate(date);
      }
    });
  }

  loadApodByDate(date: string): void {
    this.loading = true;
    this.error = undefined;
    this.nasaApi.getApodByDate(date).subscribe({
      next: (data) => {
        this.apod = data;
        if (data.media_type === 'video') {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  toggleFavorite(): void {
    if (this.apod) {
      this.favoritesService.toggleFavorite(this.apod);
    }
  }

  isFavorite(): boolean {
    return this.apod ? this.favoritesService.isFavorite(this.apod.date) : false;
  }

  goBack(): void {
    this.location.back();
  }
}
