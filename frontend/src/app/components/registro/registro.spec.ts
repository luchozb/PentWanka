import { TestBed } from '@angular/core/testing';
import { testProviders } from '../../testing/test-providers';
import { RegistroComponent } from './registro';

describe('RegistroComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComponent],
      providers: [...testProviders]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RegistroComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
