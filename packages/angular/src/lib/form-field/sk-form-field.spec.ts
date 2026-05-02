import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkFormFieldComponent } from './sk-form-field';
import { SkFormInputComponent } from './sk-form-input';
import { SkFormTextareaComponent } from './sk-form-textarea';

describe('SkFormFieldComponent', () => {
  let component: SkFormFieldComponent;
  let fixture: ComponentFixture<SkFormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkFormFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkFormFieldComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add error class when hasError is false', () => {
    component.hasError = false;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-form-field--error')).toBeNull();
  });

  it('should add error class when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.sk-form-field--error')).not.toBeNull();
  });
});

describe('SkFormInputComponent', () => {
  let component: SkFormInputComponent;
  let fixture: ComponentFixture<SkFormInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkFormInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkFormInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set aria-invalid when hasError is false', () => {
    component.hasError = false;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('should set aria-invalid="true" when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-describedby when hasError is true and inputId is set', () => {
    component.hasError = true;
    component.inputId = 'test-input';
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.getAttribute('aria-describedby')).toBe('test-input-error');
  });

  it('should be disabled when disabled input is true', () => {
    component.disabled = true;
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.disabled).toBeTrue();
  });
});

describe('SkFormTextareaComponent', () => {
  let component: SkFormTextareaComponent;
  let fixture: ComponentFixture<SkFormTextareaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkFormTextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SkFormTextareaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set aria-invalid="true" when hasError is true', () => {
    component.hasError = true;
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set aria-describedby when hasError is true and textareaId is set', () => {
    component.hasError = true;
    component.textareaId = 'test-textarea';
    fixture.detectChanges();
    const textarea: HTMLTextAreaElement = fixture.nativeElement.querySelector('textarea');
    expect(textarea.getAttribute('aria-describedby')).toBe('test-textarea-error');
  });
});
