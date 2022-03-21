import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MMPaginatorComponent } from './mmpaginator.component';

describe('MMPaginatorComponent', () => {
  let component: MMPaginatorComponent;
  let fixture: ComponentFixture<MMPaginatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MMPaginatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MMPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
