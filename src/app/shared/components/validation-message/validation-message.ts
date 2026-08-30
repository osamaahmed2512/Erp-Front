import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  imports: [],
  standalone: true,
  templateUrl: './validation-message.html',
  styleUrl: './validation-message.css',
})
export class ValidationMessage {
  @Input() control: AbstractControl | null = null;

  getMessage(): string {
    if (!this.control || !this.control.touched || !this.control.errors) {
      return '';
    }

    if (this.control.hasError('required')) {
      return 'This field is required';
    }

    if (this.control.hasError('email')) {
      return 'Please enter a valid email';
    }

    if (this.control.hasError('minlength')) {
      const error = this.control.getError('minlength');
      return `Minimum length is ${error.requiredLength} characters`;
    }

    if (this.control.hasError('maxlength')) {
      const error = this.control.getError('maxlength');
      return `Maximum ${error.requiredLength} characters allowed`;
    }
    if (this.control.hasError('min')) {
      const error = this.control.getError('min');
      return `Minimum value is ${error.min}`;
    }
    if (this.control.hasError('max')) {
      const error = this.control.getError('max');
      return `Maximum value is ${error.max}`;
    }
    if (this.control.hasError('invalidDateRange')) {
      return 'End date cannot be before start date';
    }
    if (this.control.hasError('invalidShift')) {
      return 'Enter a valid shift and break';
    }
    if (this.control.hasError('pattern')) {
      const error = this.control.getError('pattern');

      const match = error.requiredPattern.match(/\\d\{(\d+)\}/);

      if (match) {
        return `Please enter exactly ${match[1]} digits`;
      }

      return 'Please enter a valid format';
    }
    return '';
  }
}
