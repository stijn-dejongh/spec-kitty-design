import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkSectionBannerComponent } from './sk-section-banner';

describe('SkSectionBannerComponent', () => {
  let component: SkSectionBannerComponent;
  let fixture: ComponentFixture<SkSectionBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkSectionBannerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkSectionBannerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to neutral variant', () => {
    expect(component.variant).toBe('neutral');
  });

  it('should apply the variant class', () => {
    component.variant = 'purple';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const banner = el.querySelector('.sk-section-banner');
    expect(banner?.classList.contains('sk-section-banner--purple')).toBeTrue();
  });

  it('should render the label', () => {
    component.label = 'VERSION 1.X — FIRST STABLE RELEASE';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-section-banner__label')?.textContent?.trim()).toBe('VERSION 1.X — FIRST STABLE RELEASE');
  });

  it('should render the dot with aria-hidden', () => {
    const el: HTMLElement = fixture.nativeElement;
    const dot = el.querySelector('.sk-section-banner__dot');
    expect(dot?.getAttribute('aria-hidden')).toBe('true');
  });
});
