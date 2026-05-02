import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkNavPillComponent } from './sk-nav-pill';

describe('SkNavPillComponent', () => {
  let component: SkNavPillComponent;
  let fixture: ComponentFixture<SkNavPillComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkNavPillComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkNavPillComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render default items', () => {
    fixture.detectChanges();
    const nav = fixture.nativeElement as HTMLElement;
    const links = nav.querySelectorAll('.sk-nav-pill__item');
    expect(links.length).toBe(4);
  });

  it('should mark active item with aria-current="page"', () => {
    fixture.detectChanges();
    const nav = fixture.nativeElement as HTMLElement;
    const activeLink = nav.querySelector('.sk-nav-pill__item--active');
    expect(activeLink).toBeTruthy();
    expect(activeLink?.getAttribute('aria-current')).toBe('page');
  });

  it('should render custom items', () => {
    component.items = [
      { label: 'Home', href: '/', active: true },
      { label: 'Docs', href: '/docs' },
    ];
    fixture.detectChanges();
    const nav = fixture.nativeElement as HTMLElement;
    const links = nav.querySelectorAll('.sk-nav-pill__item');
    expect(links.length).toBe(2);
  });
});
