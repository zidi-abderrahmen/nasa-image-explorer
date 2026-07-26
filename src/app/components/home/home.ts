import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NasaApi } from '../../core/services/nasa/nasa-api';
import { FavoritesService } from '../../core/services/favorites/favorites';
import { Apod } from '../../core/models/apod';
import { HomeImageState } from '../../core/services/home/home-image-state';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ImageFullscreen, ImageFullscreenData } from '../../shared/components/image-fullscreen/image-fullscreen';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VideoPlayer } from '../video-player/video-player';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    VideoPlayer
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  todayApod?: Apod;
  loading = true;
  error?: string | null = null;
  imageLoaded = false;
  private readonly dialog = inject(MatDialog);

  private readonly snackBar = inject(MatSnackBar);

  constructor(
    private nasaApi: NasaApi,
    public favoritesService: FavoritesService,
    private homeImageState: HomeImageState,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.homeImageState.apod$.subscribe(apod => {
      this.todayApod = apod;
    });

    if (!this.homeImageState.currentApod) {
      this.loadTodayApod();
    } else {
      this.loading = false;
    }
  }

  loadTodayApod(): void {
    this.loading = true;
    this.error = null;
    this.nasaApi.getTodayApod().subscribe({
      next: (data) => {
        this.homeImageState.setApod(data);
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        console.error(err);
      }
    });
  }

  onImageLoad() {
    this.imageLoaded = true;
  }

  openFullscreen(): void {
    if (!this.todayApod) {
      console.warn('No APOD data available for fullscreen');
      return;
    }

    if (this.todayApod.media_type !== 'image') {
      return;
    }

    const dialogConfig: MatDialogConfig<ImageFullscreenData> = {
      data: {
        imageUrl: this.todayApod.hdurl || this.todayApod.url,
        alt: this.todayApod.title || 'NASA Astronomy Picture',
        title: this.todayApod.title,
        date: this.todayApod.date
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
    if (this.todayApod) {
      this.favoritesService.toggleFavorite(this.todayApod);
    }
  }

  isFavorite(): boolean {
    return this.todayApod ? this.favoritesService.isFavorite(this.todayApod.date) : false;
  }

  shareApod(): void {
    const shareData = {
      title: this.todayApod?.title,
      text: this.todayApod?.explanation,
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
}
