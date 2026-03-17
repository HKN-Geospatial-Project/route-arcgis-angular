import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcgisMapComponent } from './arcgis-map.component';

describe('ArcgisMap', () => {
  let component: ArcgisMapComponent;
  let fixture: ComponentFixture<ArcgisMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArcgisMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ArcgisMapComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
