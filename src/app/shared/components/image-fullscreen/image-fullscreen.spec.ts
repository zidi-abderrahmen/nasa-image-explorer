import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageFullscreen } from './image-fullscreen';

describe('ImageFullscreen', () => {
  let component: ImageFullscreen;
  let fixture: ComponentFixture<ImageFullscreen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImageFullscreen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImageFullscreen);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
