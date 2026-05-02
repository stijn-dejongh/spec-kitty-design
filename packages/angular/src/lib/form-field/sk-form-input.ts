import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * FormInput — controlled text input primitive.
 *
 * Supports all five states: Default, Focus (CSS :focus), Error, Disabled, Filled.
 *
 * Error state accessibility:
 *   - Sets aria-invalid="true" on the <input> element.
 *   - Sets aria-describedby="<inputId>-error" so screen readers announce the
 *     error message rendered by the parent sk-form-field.
 *
 * Implements ControlValueAccessor for reactive / template-driven form compatibility.
 * Falls back cleanly to @Input() value + @Output() valueChange for simple usage.
 */
@Component({
  selector: 'sk-form-input',
  standalone: true,
  imports: [],
  templateUrl: './sk-form-input.html',
  styleUrl: './sk-form-input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkFormInputComponent),
      multi: true,
    },
  ],
})
export class SkFormInputComponent implements ControlValueAccessor {
  /** The id applied to the underlying <input>. Must match the parent FormField fieldId. */
  @Input() inputId = '';

  /** HTML input type attribute. */
  @Input() type: string = 'text';

  /** Placeholder text. */
  @Input() placeholder = '';

  /** Current value (for simple @Input/@Output usage). */
  @Input() value = '';

  /** When true the input shows the error state (red border + aria-invalid). */
  @Input() hasError = false;

  /** When true the input is non-interactive. */
  @Input() disabled = false;

  /** Emits the new string value whenever the user types. */
  @Output() valueChange = new EventEmitter<string>();

  // ControlValueAccessor internals
  private _onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this._onChange(target.value);
    this.valueChange.emit(target.value);
  }

  // ControlValueAccessor implementation
  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
