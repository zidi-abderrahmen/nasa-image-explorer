import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApodSkeletonCard } from './apod-skeleton-card';

describe('ApodSkeletonCard', () => {
  let component: ApodSkeletonCard;
  let fixture: ComponentFixture<ApodSkeletonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApodSkeletonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApodSkeletonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
