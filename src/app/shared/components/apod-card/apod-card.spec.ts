import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApodCard } from './apod-card';

describe('ApodCard', () => {
  let component: ApodCard;
  let fixture: ComponentFixture<ApodCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApodCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApodCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
