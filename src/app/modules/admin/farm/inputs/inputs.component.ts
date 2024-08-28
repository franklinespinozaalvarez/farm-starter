import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule,UntypedFormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatButtonModule,MatIconModule,MatInputModule,
      MatTooltipModule,
  ],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss'
})
export class InputsComponent {
    searchInputControl: UntypedFormControl = new UntypedFormControl();
    constructor() {
    }

    openDialog(){

    }

    reload(){

    }
}
