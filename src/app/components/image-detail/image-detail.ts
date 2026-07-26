import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { NasaApi } from '../../core/services/nasa/nasa-api';
import { FavoritesService } from '../../core/services/favorites/favorites';
import { Apod } from '../../core/models/apod';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { ImageFullscreen, ImageFullscreenData } from '../../shared/components/image-fullscreen/image-fullscreen';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoPlayer } from '../video-player/video-player';

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
    MatDividerModule,
    VideoPlayer
  ],
  templateUrl: './image-detail.html',
  styleUrl: './image-detail.scss',
})
export class ImageDetail {
  apod?: Apod;
  loading = true;
  error: string | null = null;
  imageLoaded = false;
  safeUrl?: SafeResourceUrl;
  private readonly dialog = inject(MatDialog);

  private readonly snackBar = inject(MatSnackBar);

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
        this.loadApod(date);
      }
    });
  }

  loadApod(date: string): void {
    this.loading = true;
    this.error = null;
    this.imageLoaded = false;
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

  onImageLoad(): void {
    this.imageLoaded = true;
  }

  openFullscreen(): void {
    if (!this.apod) {
      console.warn('No APOD data available for fullscreen');
      return;
    }

    if (this.apod.media_type !== 'image') {
      return;
    }

    const dialogConfig: MatDialogConfig<ImageFullscreenData> = {
      data: {
        imageUrl: this.apod.hdurl || this.apod.url,
        alt: this.apod.title || 'NASA Astronomy Picture',
        title: this.apod.title,
        date: this.apod.date
      },
      panelClass: ['fullscreen-dialog', 'no-padding-dialog'],
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      hasBackdrop: false,
      autoFocus: false,
      closeOnNavigation: true,
      disableClose: false,
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '150ms'
    };

    const dialogRef = this.dialog.open(ImageFullscreen, dialogConfig);

    dialogRef.afterClosed().subscribe(() => {});
  }

  toggleFavorite(): void {
    if (this.apod) {
      this.favoritesService.toggleFavorite(this.apod);
    }
  }

  isFavorite(): boolean {
    return this.apod ? this.favoritesService.isFavorite(this.apod.date) : false;
  }

  shareApod(): void {
    const shareData = {
      title: this.apod?.title,
      text: this.apod?.explanation,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        this.copyToClipboard(shareData.url);
      });
    } else {
      this.copyToClipboard(shareData.url);
    }
  }

  private copyToClipboard(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('🔗 Link copied to clipboard!', 'Dismiss', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['success-snackbar']
      });
    }).catch(() => {
      this.snackBar.open('❌ Failed to copy link', 'Retry', {
        duration: 4000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      }).onAction().subscribe(() => {
        this.copyToClipboard(url);
      });
    });
  }

  goBack(): void {
    window.history.back();
  }
}
