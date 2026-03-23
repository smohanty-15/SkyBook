import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnrCheck } from './pnr-check';

describe('PnrCheck', () => {
  let component: PnrCheck;
  let fixture: ComponentFixture<PnrCheck>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnrCheck],
    }).compileComponents();

    fixture = TestBed.createComponent(PnrCheck);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
