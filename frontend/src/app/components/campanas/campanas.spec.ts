import { TestBed } from '@angular/core/testing';
import { testProviders } from '../../testing/test-providers';
import { CampanasComponent } from './campanas';

describe('CampanasComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampanasComponent],
      providers: [...testProviders]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(CampanasComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
