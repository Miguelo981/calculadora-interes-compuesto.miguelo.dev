export enum Frequency {
    DIARY = 'd',
    WEEKLY = 'w',
    MONTHLY = 'm',
    YEARLY = 'y'
}

export interface CompoundedInterestFormFields {
    initialCapital: number;
    contribution: number;
    frequencyContribution: Frequency;
    rate: number;
    time: number;
    frequencyValue: number;
    frequencyUnit: Frequency;
}

export interface CompoundedInterestResult { 
    //month: number;
    //year: number;
    date: Date
    amount: number
}