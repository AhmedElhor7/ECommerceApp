import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingSppinerComponent } from './loading-sppiner.component';

describe('LoadingSppinerComponent', () => {
  let component: LoadingSppinerComponent;
  let fixture: ComponentFixture<LoadingSppinerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadingSppinerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadingSppinerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
