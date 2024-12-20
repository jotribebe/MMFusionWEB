import { Component, ElementRef, ViewChild } from '@angular/core';
import { IDateParams } from 'ag-grid-community';
import { IDateAngularComp } from 'ag-grid-angular';
import { Instance } from 'flatpickr/dist/types/instance';
import flatpickr from 'flatpickr';

@Component({
  selector: 'app-custom-date-ag-grid',
  templateUrl: './custom-date-ag-grid.component.html',
  styleUrls: ['./custom-date-ag-grid.component.scss'],
})
export class CustomDateAgGridComponent implements IDateAngularComp {
  @ViewChild('flatpickrEl', { read: ElementRef })
  flatpickrEl!: ElementRef<HTMLElement>;
  @ViewChild('eInput', { read: ElementRef })
  eInput!: ElementRef<HTMLInputElement>;
  private date!: Date | null;
  private params!: IDateParams;
  private picker!: Instance;

  agInit(params: IDateParams): void {
    this.params = params;
  }
  constructor() {}

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnInit(): void {
    //console.log('init my ag date filter', new Date().getTimezoneOffset() / 60);
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    console.log(`Destroying DateComponent`);
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.picker = flatpickr(this.flatpickrEl.nativeElement, {
      onChange: this.onDateChanged.bind(this),
      dateFormat: 'd/m/Y H:i:S',
      enableTime: true,
      time_24hr: true,
      enableSeconds: true,
      wrap: true,
    });

    console.log('this.picker', this.picker);

    this.picker.calendarContainer.classList.add('ag-custom-component-popup');
  }

  onDateChanged(selectedDates: Date[]): void {
    this.date = selectedDates.length > 0 ? selectedDates[0] : null;
    this.params.onDateChanged();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    //  const dateFilterComponent = this.params.api.getFilterInstance('dateTime');
    //   console.log('dateFilterComponent', dateFilterComponent);
    //   console.log('this.params.filterParams', this.params.filterParams);
    //   if (this.date === null) {
    //     dateFilterComponent!.setModel(null);
    //   } else {
    //     dateFilterComponent!.setModel({
    //       type: 'lessThanOrEqual',
    //       dateFrom: this.date.toISOString(),
    //       dateTo: null,
    //     });
    //   }
    // this.params.api.onFilterChanged();
  }

  public getDate(): Date | null {
    console.log('getDate', this.date);
    return this.date;
  }

  public showB(): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    //(this.eInput.nativeElement as any).showPicker();
  }

  setDate(date: Date): void {
    this.date = date || null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
    this.picker.setDate(date);
    /*this.test = this.date ? this.date.toISOString() : '';
    if (this.date) {
      this.eInput.nativeElement.value = this.date
        .toISOString()
        .replace('Z', '');
    } else {
      this.eInput.nativeElement.value = '';
    }*/
    // console.log('setDate toLocaleDateString', this.date?.toLocaleDateString());
    // console.log('setDate ISO', this.date?.toISOString());
    // console.log('setDate toUTCString', this.date?.toUTCString());
    // console.log('setDate toTimeString', this.date?.toTimeString());
    // this.eInput.nativeElement.valueAsNumber = this.date ? date.getTime() : NaN;
    //this.picker.setDate(date);
  }

  setInputPlaceholder(placeholder: string): void {
    this.eInput.nativeElement.setAttribute('placeholder', placeholder);
  }

  setInputAriaLabel(label: string): void {
    this.eInput.nativeElement.setAttribute('aria-label', label);
  }
}
