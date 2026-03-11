import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinateListComponent } from './coordinate-list.component';

describe('CoordinateListComponent', () => {
  let component: CoordinateListComponent;
  let fixture: ComponentFixture<CoordinateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoordinateListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
