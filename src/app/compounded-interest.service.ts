import { Injectable, signal } from '@angular/core';
import { CompoundedInterestFormFields, CompoundedInterestResult, Frequency } from '@/app/models/compounded-interest';

@Injectable({
  providedIn: 'root'
})
export class CompoundedInterestService {
  interests = signal<CompoundedInterestResult[]>([]);

  private readonly frequencyMultipliers = {
    [Frequency.DIARY]: 1,
    [Frequency.WEEKLY]: 7,
    [Frequency.MONTHLY]: 30,
    [Frequency.YEARLY]: 365
  };

  calculate(fields: CompoundedInterestFormFields) {
    const { initialCapital, contribution, frequencyContribution, rate, time, frequencyValue, frequencyUnit } = fields;
    const rateDecimal = rate / 100;

    const compoundingIntervalDays = Math.max(1, Math.round(this.frequencyMultipliers[frequencyUnit] / frequencyValue))
    const periodicRate = Math.pow(1 + rateDecimal, compoundingIntervalDays / 365) - 1
    //const periodicRate = rateDecimal * (compoundingInterval / 365);
    const contributionIntervalDays = this.frequencyMultipliers[frequencyContribution]; //7 * 

    let accumulatedAmount = initialCapital;
    const totalDays = time * 365;
    const results: CompoundedInterestResult[] = [];

    const monthInterval = 30;
    let currentMonth = 1;
    let nextMonthDay = monthInterval;
    let nextCompoundingDay = compoundingIntervalDays;
    let nextContributionDay = contributionIntervalDays;
    let date = new Date();

    for (let day = 1; day <= totalDays; day++) {
      if (day >= nextContributionDay) {
        accumulatedAmount += Number(contribution);
        nextContributionDay += contributionIntervalDays;
      }

      if (day >= nextCompoundingDay) {
        accumulatedAmount *= (1 + periodicRate);
        nextCompoundingDay += compoundingIntervalDays;
      }

      if (day >= nextMonthDay) {
        date = new Date(`${date.getFullYear()}-${currentMonth}-01`);

        results.push({
          date,
          amount: Math.round(accumulatedAmount * 100) / 100,
        });

        currentMonth++;
        nextMonthDay += monthInterval;
      }

      if (currentMonth > 12) {
        currentMonth = 1;
        date.setFullYear(date.getFullYear() + 1);
      }
    }
    this.interests.set(results);

    /* const frequencyPerYear = this.getFrequencyMultiplier(frequencyUnit) * frequencyValue;
    const contributionFrequency = this.getFrequencyMultiplier(frequencyContribution);
    let accumulatedAmount = initialCapital;
    let runningInterest = 0;
    const results: CompoundedInterestResult[] = [];

    const interestPerDay = rateDecimal / 365;
    const totalDays = time * 365;

    for (let day = 1; day <= totalDays; day++) {
      runningInterest += accumulatedAmount * interestPerDay;

      if (day % (7 * contributionFrequency) === 0) {
        accumulatedAmount += contribution;
      }

      if (day % 30 === 0) {
        accumulatedAmount += runningInterest;
        runningInterest = 0;
      }

      if (day % 365 === 0) {
        results.push({
          month: 12,
          year: Math.floor(day / 365),
          amount: Math.round(accumulatedAmount)
        });
      }
    }

    accumulatedAmount += runningInterest;
    console.log(accumulatedAmount)

    this.interests.set(results);
 */  }

  calculate2(fields: CompoundedInterestFormFields) {
    const { initialCapital, contribution, frequencyContribution, rate, time, frequencyValue, frequencyUnit } = fields;

    const rateDecimal = rate / 100;
    const frequencyPerYear = this.getFrequencyMultiplier(frequencyUnit);
    const contributionFrequency = this.getFrequencyMultiplier(frequencyContribution);
    let accumulatedAmount = initialCapital;
    //const periodRate = rateDecimal / frequencyPerYear
    const periodRate = frequencyUnit === 'y' ? rateDecimal : Math.pow(1 + rateDecimal, 1 / frequencyPerYear) - 1
    //const periodRate = Math.exp(Math.log(1 + rateDecimal) / frequencyPerYear) - 1;
    const results: any[] = [];

    for (let month = 1; month <= time * 12; month++) {
      const periodsInMonth = Math.floor(frequencyPerYear * frequencyValue / 12);

      for (let period = 0; period < periodsInMonth; period++) {
        /* if ((month - 1) % (12 / contributionFrequency) === 0 && period === periodsInMonth - 1) {
         accumulatedAmount += contribution;
       } */
        accumulatedAmount *= (1 + periodRate);
        console.log(accumulatedAmount)
      }

      results.push({
        month: (month - 1) % 12 + 1,
        year: Math.floor((month - 1) / 12) + 1,
        amount: Math.round(accumulatedAmount * 100) / 100
      });
    }

    this.interests.set(results);
  }

  private getFrequencyMultiplier(unit: string): number {
    //const multipliers: { [key: string]: number } = { d: 365, w: 52, m: 12, y: 1 };
    const multipliers: { [key: string]: number } = { d: 1, w: 7, m: 30, y: 365 };

    return multipliers[unit] || 1;
  }
}
