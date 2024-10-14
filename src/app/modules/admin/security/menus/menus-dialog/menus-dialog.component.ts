import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MenusService } from '../menus.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-menus-dialog',
  standalone: true,
  imports: [
      FormsModule,ReactiveFormsModule,MatInputModule,MatFormFieldModule,MatDialogModule,MatTooltipModule,MatIconModule,MatButtonModule,
      MatSelectModule
  ],
  templateUrl: './menus-dialog.component.html',
  styleUrl: './menus-dialog.component.scss'
})
export class MenusDialogComponent implements OnInit{

    valuesForm: UntypedFormGroup;

    public roles: any = [];

    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: any,
        private _builder: UntypedFormBuilder,
        private _change: ChangeDetectorRef,
        public matDialogRef: MatDialogRef<MenusDialogComponent>,
        private _menus: MenusService
    ) {}

    ngOnInit(): void {
        this.valuesForm = this._builder.group({
            code: [''],
            title: [''],
            type: [''],
            link: [''],
            icon: [''],
            /*role: [''],*/
        });

        this.roles = this._data.roles;
    }

    /**
     * Close dialog
     */
    close(): void
    {
        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Add a value
     */
    add(): void {

        this._menus.post(this.valuesForm.getRawValue()).subscribe((response)=>{
            this.matDialogRef.close(response);
        });
    }

    displayRol(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }
}
