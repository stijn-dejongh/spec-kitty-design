import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkCheckBulletComponent } from './sk-check-bullet';

describe('SkCheckBulletComponent', () => {
  let component: SkCheckBulletComponent;
  let fixture: ComponentFixture<SkCheckBulletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkCheckBulletComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SkCheckBulletComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the provided text', () => {
    component.text = 'Feature description here';
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-check-bullet__text')?.textContent?.trim()).toBe('Feature description here');
  });

  it('should render the checkmark icon with aria-hidden', () => {
    const el: HTMLElement = fixture.nativeElement;
    const icon = el.querySelector('.sk-check-bullet__icon');
    expect(icon?.getAttribute('aria-hidden')).toBe('true');
  });
});
