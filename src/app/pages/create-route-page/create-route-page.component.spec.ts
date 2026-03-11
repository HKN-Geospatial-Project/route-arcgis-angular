import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRoutePageComponent } from './create-route-page.component';

describe('CreateRoutePageComponent', () => {
  let component: CreateRoutePageComponent;
  let fixture: ComponentFixture<CreateRoutePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateRoutePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRoutePageComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
