import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * FormField — container component that wraps a label, input/textarea, and
 * description or error message. Apply [hasError]="true" to show the error
 * state; the error message is rendered with role="alert" and an id that
 * consuming inputs should reference via aria-describedby.
 */
@Component({
  selector: 'sk-form-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sk-form-field.html',
  styleUrl: './sk-form-field.css',
})
export class SkFormFieldComponent {
  /** Label text rendered above the control. */
  @Input() label = '';

  /** Helper text shown below the control when there is no error. */
  @Input() description = '';

  /** Error message shown (with role="alert") when hasError is true. */
  @Input() errorMessage = '';

  /** When true the field adopts the error styling and renders the error message. */
  @Input() hasError = false;

  /**
   * The id that will be set on the <label> for attribute and used to
   * construct the error message id (<fieldId>-error).
   * Consuming input elements should set [id]="fieldId" and
   * [attr.aria-describedby]="fieldId + '-error'" when hasError is true.
   */
  @Input() fieldId = '';
}
