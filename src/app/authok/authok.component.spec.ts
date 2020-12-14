import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthokComponent } from './authok.component';

describe('AuthokComponent', () => {
  let component: AuthokComponent;
  let fixture: ComponentFixture<AuthokComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthokComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthokComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
