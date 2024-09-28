import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule, MatDateRangeInput } from '@angular/material/datepicker';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,MatInputModule,MatDatepickerModule],
  templateUrl: './reports.component.html'
})
export class ReportsComponent implements OnInit{

    public filterForm: UntypedFormGroup;

    constructor(
        private _builder: UntypedFormBuilder
    ) {
    }

    ngOnInit(): void {
        this.filterForm = this._builder.group({
            start   : [''],
            end     : [''],
        });
    }

}
