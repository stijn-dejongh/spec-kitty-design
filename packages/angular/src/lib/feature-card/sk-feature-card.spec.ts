import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkFeatureCardComponent } from './sk-feature-card';

describe('SkFeatureCardComponent', () => {
  let component: SkFeatureCardComponent;
  let fixture: ComponentFixture<SkFeatureCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkFeatureCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkFeatureCardComponent);
    component = fixture.componentInstance;
    component.title = 'Test card';
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default iconVariant to yellow', () => {
    expect(component.iconVariant).toBe('yellow');
  });

  it('should render the title', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-feature-card__title')?.textContent).toContain('Test card');
  });

  it('should apply yellow chip class by default', () => {
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-feature-card__icon-chip--yellow')).toBeTruthy();
  });

  it('should apply green chip class when iconVariant is green', () => {
    component.iconVariant = 'green';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-feature-card__icon-chip--green')).toBeTruthy();
  });

  it('should apply purple chip class when iconVariant is purple', () => {
    component.iconVariant = 'purple';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-feature-card__icon-chip--purple')).toBeTruthy();
  });
});
