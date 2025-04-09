import { Component, input, forwardRef, OnInit, computed } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  Validators,
  FormControl,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { cn } from '@/app/utils/css';

@Component({
  selector: 'app-input',
  imports: [ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
  template: `
    <fieldset class="flex flex-col gap-1">
      @if (label()) {
        <label [htmlFor]="id()" class="text-sm text-gray-900 font-semibold">{{ label() }}</label>
      }
      <input
        [id]="id()"
        [attr.type]="type()"
        [attr.placeholder]="placeholder()"
        [attr.class]="customClass()"
        [attr.disabled]="disabled()"
        [attr.aria-label]="ariaLabel()"
        [name]="name()"
        [required]="required()"
        [formControl]="formControl"
      />
    </fieldset>
  `,
})
export class InputComponent implements OnInit, ControlValueAccessor {
  id = input<string | null>(null)
  label = input<string | null>(null)
  type = input('text');
  name = input('');
  placeholder = input('');
  disabled = input<boolean | null>(null);
  class = input('');
  ariaLabel = input('');
  required = input<boolean>(false);

  formControl!: FormControl;
  onTouched: any;
  onChange: any;

  customClass = computed(() => cn('py-2.5 sm:py-3 px-4 block w-full bg-gray-100 border-transparent rounded-lg sm:text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none', this.class()));

  ngOnInit(): void {
    const validators: ValidatorFn[] = [];

    if (this.required()) {
      validators.push(Validators.required);
    }

    this.formControl = new FormControl('', validators);
  }

  writeValue(value: any): void {
    this.formControl.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.formControl.valueChanges.subscribe(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.formControl.disable() : this.formControl.enable();
  }
}
