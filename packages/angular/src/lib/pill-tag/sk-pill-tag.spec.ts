import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkPillTagComponent } from './sk-pill-tag';
import { SkEyebrowPillComponent } from './sk-eyebrow-pill';

describe('SkPillTagComponent', () => {
  let component: SkPillTagComponent;
  let fixture: ComponentFixture<SkPillTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkPillTagComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkPillTagComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply default variant class', () => {
    component.label = 'v1.0.0';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.sk-tag') as HTMLElement;
    expect(span).toBeTruthy();
    expect(span.classList.contains('sk-tag--green')).toBe(false);
    expect(span.classList.contains('sk-tag--purple')).toBe(false);
  });

  it('should apply green variant class', () => {
    component.variant = 'green';
    component.label = 'SemVer';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.sk-tag') as HTMLElement;
    expect(span.classList.contains('sk-tag--green')).toBe(true);
  });

  it('should apply purple variant class', () => {
    component.variant = 'purple';
    component.label = 'Skills Pack';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.sk-tag') as HTMLElement;
    expect(span.classList.contains('sk-tag--purple')).toBe(true);
  });

  it('should apply breaking variant class', () => {
    component.variant = 'breaking';
    component.label = 'Breaking';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.sk-tag') as HTMLElement;
    expect(span.classList.contains('sk-tag--breaking')).toBe(true);
  });
});

describe('SkEyebrowPillComponent', () => {
  let component: SkEyebrowPillComponent;
  let fixture: ComponentFixture<SkEyebrowPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkEyebrowPillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkEyebrowPillComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render eyebrow pill', () => {
    component.label = 'For software teams adopting agentic coding';
    fixture.detectChanges();
    const span = fixture.nativeElement.querySelector('.sk-eyebrow-pill') as HTMLElement;
    expect(span).toBeTruthy();
  });
});
