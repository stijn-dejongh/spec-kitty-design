import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkStub } from './sk-stub';

describe('SkStub', () => {
  let component: SkStub;
  let fixture: ComponentFixture<SkStub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkStub]
    }).compileComponents();

    fixture = TestBed.createComponent(SkStub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
