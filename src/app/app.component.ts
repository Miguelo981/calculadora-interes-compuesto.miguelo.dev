import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculatorComponent } from "@/app/calculator/calculator.component";
import { CompoundedInterestFormFields } from '@/app/models/compounded-interest';
import { CompoundedInterestService } from '@/app/compounded-interest.service';
import { TVLineChartDirective } from 'ngx-lightweight-charts';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CalculatorComponent, TVLineChartDirective],
  template: `
    <main class="mx-auto md:max-w-[25rem] px-5 lg:px-0 grid items-center h-screen">
      <app-calculator-form (submit)="handleSubmit($event)" />
      @if (interests().length > 0) {
        <tv-line-chart [data]="chartData()"></tv-line-chart>
      }
    </main>
    <router-outlet />
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  private readonly _interestService = inject(CompoundedInterestService);
  
  interests = computed(() => {
    console.log(this._interestService.interests())
    return this._interestService.interests()
  });
  chartData = computed(() =>
    this.interests().map(entry => ({
      time: entry.date.toISOString().split('T')[0],
      value: entry.amount
    }))
    .toSorted((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
  );

  handleSubmit(values: CompoundedInterestFormFields) {
    this._interestService.calculate(values);
  }
}
