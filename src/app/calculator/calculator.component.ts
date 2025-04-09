import { Component, computed, output } from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import { InputComponent } from '@/app/input/input.component';
import { CompoundedInterestFormFields, Frequency } from '@/app/models/compounded-interest';

@Component({
  selector: 'app-calculator-form',
  imports: [ReactiveFormsModule, InputComponent],
  template: `
    <form [formGroup]="calculatorForm" (submit)="handleSubmit($event)" class="flex flex-col gap-5">
      <app-input type="number" label="Capital inicial" id="initial-capital" placeholder="1000..." formControlName="initialCapital" />

      <div class="flex gap-2 items-end">
        <app-input type="number" label="Contribución" id="contribution" placeholder="250..." formControlName="contribution" class="w-full" />
        <select formControlName="frequencyContribution" class="py-2.5 sm:py-3 px-4 bg-gray-100 border-transparent rounded-lg sm:text-sm">
          <option value="d">Día</option>
          <option value="w">Semana</option>
          <option value="m">Mes</option>
          <!-- <option value="y">Año</option> -->
        </select>
      </div>
      
      <app-input type="number" label="Tasa de interés (%)" id="rate" placeholder="7..." formControlName="rate" symbol="%" />
      <app-input type="number" label="Tiempo (años)" id="time" placeholder="1..." formControlName="time" />

      <div class="flex gap-2 items-end">
        <app-input type="number" label="Frecuencia" id="frequency" placeholder="1..." formControlName="frequencyValue" class="w-full" />
        <select formControlName="frequencyUnit" class="py-2.5 sm:py-3 px-4 bg-gray-100 border-transparent rounded-lg sm:text-sm">
          <option value="d">Día</option>
          <option value="w">Semana</option>
          <option value="m">Mes</option>
          <!-- <option value="y">Año</option> -->
        </select>
      </div>

      <button type="submit" [disabled]="!calculatorForm.valid" class="px-4 py-2 bg-sky-500 text-white rounded w-full disabled:cursor-not-allowed disabled:bg-gray-300 font-bold">Calcular</button>
    </form>
  `,
})
export class CalculatorComponent {
  calculatorForm = new FormGroup({
    initialCapital: new FormControl<number | null>(null, Validators.required),
    contribution: new FormControl<number | null>(null, Validators.required),
    frequencyContribution: new FormControl<Frequency | null>(Frequency.MONTHLY),
    rate: new FormControl<number | null>(null, Validators.required),
    time: new FormControl<number | null>(null, Validators.required),
    frequencyValue: new FormControl<number | null>(null, Validators.required),
    frequencyUnit: new FormControl<Frequency | null>(Frequency.MONTHLY),
  });
  submit = output<CompoundedInterestFormFields>()

  constructor() {
    this.calculatorForm.setValue({
      initialCapital: 1000,
      contribution: 0,
      frequencyContribution: Frequency.MONTHLY,
      rate: 5,
      time: 1,
      frequencyValue: 1,
      frequencyUnit: Frequency.MONTHLY,
    })
  }

  handleSubmit(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    if (!this.calculatorForm.valid) {
      return;
    }

    this.submit.emit(this.calculatorForm.value as unknown as CompoundedInterestFormFields);
  }
}
