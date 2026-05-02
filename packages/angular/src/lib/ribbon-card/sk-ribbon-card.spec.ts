import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkRibbonCardComponent } from './sk-ribbon-card';

describe('SkRibbonCardComponent', () => {
  let component: SkRibbonCardComponent;
  let fixture: ComponentFixture<SkRibbonCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkRibbonCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkRibbonCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not render a ribbon when ribbonLabel is null', () => {
    component.ribbonLabel = null;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-ribbon-card__ribbon')).toBeNull();
  });

  it('should render a ribbon when ribbonLabel is set', () => {
    component.ribbonLabel = 'Primary Workshop';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const ribbon = el.querySelector('.sk-ribbon-card__ribbon');
    expect(ribbon).toBeTruthy();
    expect(ribbon?.textContent?.trim()).toContain('Primary Workshop');
  });

  it('should default ribbonVariant to yellow', () => {
    expect(component.ribbonVariant).toBe('yellow');
  });

  it('should apply yellow ribbon class when ribbonVariant is yellow', () => {
    component.ribbonLabel = 'Workshop';
    component.ribbonVariant = 'yellow';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-ribbon-card__ribbon--yellow')).toBeTruthy();
  });

  it('should apply green ribbon class when ribbonVariant is green', () => {
    component.ribbonLabel = 'Stable';
    component.ribbonVariant = 'green';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-ribbon-card__ribbon--green')).toBeTruthy();
  });
});
