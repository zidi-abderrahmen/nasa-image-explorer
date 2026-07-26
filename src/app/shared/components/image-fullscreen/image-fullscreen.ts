import { Component, Inject, HostListener, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

export interface ImageFullscreenData {
  imageUrl: string;
  alt?: string;
  title?: string;
  date?: string;
}

interface Point {
  x: number;
  y: number;
}

@Component({
  selector: 'app-image-fullscreen',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './image-fullscreen.html',
  styleUrl: './image-fullscreen.scss',
})
export class ImageFullscreen implements OnInit, OnDestroy {
  @ViewChild('imageRef', { static: true }) imageRef!: ElementRef<HTMLImageElement>;
  @ViewChild('containerRef', { static: true }) containerRef!: ElementRef<HTMLDivElement>;

  scale = 1;
  translateX = 0;
  translateY = 0;
  isLoading = true;
  isDragging = false;
  showControls = true;
  private controlsTimeout: ReturnType<typeof setTimeout> | null = null;

  private readonly minScale = 1;
  private readonly maxScale = 5;
  private readonly zoomStep = 0.2;

  // Pan state
  private lastPanPoint: Point | null = null;
  private initialDistance = 0;
  private initialScale = 1;

  constructor(
    public dialogRef: MatDialogRef<ImageFullscreen>,
    @Inject(MAT_DIALOG_DATA) public data: ImageFullscreenData
  ) {}

  ngOnInit(): void {
    // Auto-hide controls after 3 seconds
    this.resetControlsTimeout();
  }

  ngOnDestroy(): void {
    if (this.controlsTimeout) {
      clearTimeout(this.controlsTimeout);
    }
  }

  // ─── IMAGE LOADING ───
  onImageLoad(): void {
    this.isLoading = false;
  }

  onImageError(): void {
    this.isLoading = false;
  }

  // ─── ZOOM ───
  zoomIn(): void {
    this.setScale(this.scale + this.zoomStep);
  }

  zoomOut(): void {
    this.setScale(this.scale - this.zoomStep);
  }

  setScale(newScale: number): void {
    const oldScale = this.scale;
    this.scale = Math.min(this.maxScale, Math.max(this.minScale, newScale));
    
    // When zooming out to 1, reset pan
    if (this.scale === 1) {
      this.translateX = 0;
      this.translateY = 0;
    } else if (oldScale !== this.scale) {
      // Adjust pan to zoom towards center
      this.translateX *= this.scale / oldScale;
      this.translateY *= this.scale / oldScale;
      this.clampPan();
    }
  }

  resetZoom(): void {
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
  }

  // ─── WHEEL ZOOM ───
  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -this.zoomStep : this.zoomStep;
    this.setScale(this.scale + delta);
  }

  // ─── MOUSE PAN ───
  onMouseDown(event: MouseEvent): void {
    if (this.scale > 1) {
      this.isDragging = true;
      this.lastPanPoint = { x: event.clientX, y: event.clientY };
      this.showControls = true;
      if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging || !this.lastPanPoint) return;
    event.preventDefault();
    
    const dx = event.clientX - this.lastPanPoint.x;
    const dy = event.clientY - this.lastPanPoint.y;
    
    this.translateX += dx;
    this.translateY += dy;
    this.clampPan();
    
    this.lastPanPoint = { x: event.clientX, y: event.clientY };
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.lastPanPoint = null;
    this.resetControlsTimeout();
  }

  onMouseLeave(): void {
    this.isDragging = false;
    this.lastPanPoint = null;
  }

  // ─── TOUCH: PAN & PINCH ───
  onTouchStart(event: TouchEvent): void {
    if (event.touches.length === 1 && this.scale > 1) {
      this.isDragging = true;
      this.lastPanPoint = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      this.showControls = true;
      if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
    } else if (event.touches.length === 2) {
      this.isDragging = false;
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.initialDistance = Math.sqrt(dx * dx + dy * dy);
      this.initialScale = this.scale;
    }
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();
    
    if (event.touches.length === 1 && this.isDragging && this.lastPanPoint) {
      const dx = event.touches[0].clientX - this.lastPanPoint.x;
      const dy = event.touches[0].clientY - this.lastPanPoint.y;
      this.translateX += dx;
      this.translateY += dy;
      this.clampPan();
      this.lastPanPoint = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    } else if (event.touches.length === 2 && this.initialDistance > 0) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const scaleChange = distance / this.initialDistance;
      this.setScale(this.initialScale * scaleChange);
    }
  }

  onTouchEnd(): void {
    this.isDragging = false;
    this.lastPanPoint = null;
    this.initialDistance = 0;
    this.resetControlsTimeout();
  }

  // ─── CLAMP PAN ───
  private clampPan(): void {
    if (this.scale <= 1) {
      this.translateX = 0;
      this.translateY = 0;
      return;
    }
    
    const rect = this.imageRef?.nativeElement?.getBoundingClientRect();
    const containerRect = this.containerRef?.nativeElement?.getBoundingClientRect();
    
    if (!rect || !containerRect) return;
    
    const maxX = Math.max(0, (rect.width * this.scale - containerRect.width) / 2);
    const maxY = Math.max(0, (rect.height * this.scale - containerRect.height) / 2);
    
    this.translateX = Math.max(-maxX, Math.min(maxX, this.translateX));
    this.translateY = Math.max(-maxY, Math.min(maxY, this.translateY));
  }

  // ─── BACKDROP CLICK ───
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.close();
    }
  }

  // ─── CONTROLS VISIBILITY ───
  onContainerMouseMove(): void {
    this.showControls = true;
    this.resetControlsTimeout();
  }

  private resetControlsTimeout(): void {
    if (this.controlsTimeout) clearTimeout(this.controlsTimeout);
    this.controlsTimeout = setTimeout(() => {
      if (!this.isDragging) {
        this.showControls = false;
      }
    }, 3000);
  }

  // ─── KEYBOARD SHORTCUTS ───
    @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.close();
  }

  @HostListener('document:keydown.plus', ['$event'])
  @HostListener('document:keydown.equal', ['$event'])
  onZoomInKey(event: Event): void {
    event.preventDefault();
    this.zoomIn();
  }

  @HostListener('document:keydown.minus', ['$event'])
  onZoomOutKey(event: Event): void {
    event.preventDefault();
    this.zoomOut();
  }

  @HostListener('document:keydown.0', ['$event'])
  onResetKey(event: Event): void {
    const ke = event as KeyboardEvent;
    if (ke.ctrlKey || ke.metaKey) {
      event.preventDefault();
      this.resetZoom();
    }
  }

  @HostListener('document:keydown.arrowup', ['$event'])
  onPanUp(event: Event): void {
    event.preventDefault();
    if (this.scale > 1) {
      this.translateY += 50;
      this.clampPan();
    }
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onPanDown(event: Event): void {
    event.preventDefault();
    if (this.scale > 1) {
      this.translateY -= 50;
      this.clampPan();
    }
  }

  @HostListener('document:keydown.arrowleft', ['$event'])
  onPanLeft(event: Event): void {
    event.preventDefault();
    if (this.scale > 1) {
      this.translateX += 50;
      this.clampPan();
    }
  }

  @HostListener('document:keydown.arrowright', ['$event'])
  onPanRight(event: Event): void {
    event.preventDefault();
    if (this.scale > 1) {
      this.translateX -= 50;
      this.clampPan();
    }
  }

  close(): void {
    this.dialogRef.close();
  }

  // Helper for template
  get canZoomIn(): boolean {
    return this.scale < this.maxScale;
  }

  get canZoomOut(): boolean {
    return this.scale > this.minScale;
  }

  get zoomPercentage(): string {
    return Math.round(this.scale * 100) + '%';
  }
}