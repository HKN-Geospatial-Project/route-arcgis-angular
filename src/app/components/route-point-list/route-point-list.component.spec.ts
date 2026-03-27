import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutePointListComponent } from './route-point-list.component';

describe('CoordinateListComponent', () => {
  let component: RoutePointListComponent;
  let fixture: ComponentFixture<RoutePointListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoutePointListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RoutePointListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
