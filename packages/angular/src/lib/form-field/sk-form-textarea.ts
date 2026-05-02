import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * FormTextarea — controlled multiline text input primitive.
 *
 * Supports all five states: Default, Focus (CSS :focus), Error, Disabled, Filled.
 *
 * Error state accessibility:
 *   - Sets aria-invalid="true" on the <textarea> element.
 *   - Sets aria-describedby="<textareaId>-error" so screen readers announce
 *     the error message rendered by the parent sk-form-field.
 *
 * Implements ControlValueAccessor for reactive / template-driven form compatibility.
 */
@Component({
  selector: 'sk-form-textarea',
  standalone: true,
  imports: [],
  templateUrl: './sk-form-textarea.html',
  styleUrl: './sk-form-textarea.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SkFormTextareaComponent),
      multi: true,
    },
  ],
})
export class SkFormTextareaComponent implements ControlValueAccessor {
  /** The id applied to the underlying <textarea>. Must match the parent FormField fieldId. */
  @Input() textareaId = '';

  /** Placeholder text. */
  @Input() placeholder = '';

  /** Number of visible rows. */
  @Input() rows = 4;

  /** Current value. */
  @Input() value = '';

  /** When true the textarea shows the error state (red border + aria-invalid). */
  @Input() hasError = false;

  /** When true the textarea is non-interactive. */
  @Input() disabled = false;

  /** Emits the new string value whenever the user types. */
  @Output() valueChange = new EventEmitter<string>();

  // ControlValueAccessor internals
  private _onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
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
