import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormsModule,
    ReactiveFormsModule, UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MenusDialogComponent } from './menus-dialog/menus-dialog.component';
import Swal from 'sweetalert2';
import { MenusService } from './menus.service';
import { NgFor } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';

@Component({
  selector: 'app-menus',
  standalone: true,
  imports: [
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatIconModule,MatButtonModule,MatTooltipModule,MatInputModule,
      NgFor,MatSelectModule
  ],
  templateUrl: './menus.component.html',
  styleUrl: './menus.component.scss'
})
export class MenusComponent implements OnInit{


    searchInputControl: UntypedFormControl = new UntypedFormControl();
    public valuesForm: UntypedFormGroup;
    constructor(
        private _dialog: MatDialog,
        private _menus: MenusService,
        private _builder: UntypedFormBuilder,
        private _change: ChangeDetectorRef,
        private _confirmation: UrpiConfirmationService,
    ) {}

    ngOnInit(): void {

        this.valuesForm = this._builder.group({
            values  : this._builder.array([])
        });

        this._menus.get().subscribe((resp)=>{

            /** load cards **/
            (this.valuesForm.get('values') as FormArray).clear();
            const cards = [];
            // Iterate through them
            resp.data.forEach((card) => {
                // Create an user form group
                cards.push(
                    this._builder.group({
                        id: [card.id],
                        code: [card.code],
                        title: [card.title],
                        type: [card.type],
                        link: [card.link],
                        icon: [card.icon]
                    })
                );
            });

            // Add the user form groups to the users form array
            cards.forEach((paramFormGroup) => {
                (this.valuesForm.get('values') as FormArray).push(paramFormGroup);
            });
            console.warn('controls',this.valuesForm.get('values')['controls']);
            this._change.markForCheck();
            /** load cards **/

        });
    }

    /**
     * Create record
     */
    create(): void {

        const dialogRef = this._dialog.open(MenusDialogComponent,{
            height: '60%',
            width: '60%',
            data: {
                action: 'new'
            }
        });

        dialogRef.afterClosed().subscribe((response) => {
            console.warn('response',response);
            Swal.fire({
                title: "Opcion de menu creado exitosamente !!!",
                icon: "success"
            });

            this.reload();

        });

    }

    /**
     * delete record
     */

    delete(id): void{
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro, que deseas eliminar el registro seleccionado?',
            actions: {
                confirm: {
                    label: 'Eliminar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                // Delete the role on the server
                this._menus.delete(id).subscribe(() => {

                    Swal.fire({
                        title: "Registro eliminado exitosamente !!!",
                        icon: "success"
                    });

                    this.reload();
                });
            }
        });
    }

    /**
     * put record
     */

    put(index): void{

        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro, que deseas actualizar el registro seleccionado?',
            icon: {
                show: true,
                name: 'mat_outline:edit',
                color: 'success'
            },
            actions: {
                confirm: {
                    label: 'Actualizar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                const control = (this.valuesForm.get('values') as UntypedFormArray).at(index).value;

                this._menus.put(control.id, control).subscribe((resp: any) => {

                    console.warn('UPDATE',resp)
                    Swal.fire({
                        title: "Registro actualizado exitosamente !!!",
                        icon: "success"
                    });
                    //this.reload();
                });

            }
        });

    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any
    {
        return item.id || index;
    }

    /**
     * reload records
     */
    reload(){
        this._menus.get().subscribe((resp)=>{

            /** load cards **/
            (this.valuesForm.get('values') as FormArray).clear();
            const cards = [];
            // Iterate through them
            resp.data.forEach((card) => {
                console.warn('card',card)
                // Create an user form group
                cards.push(
                    this._builder.group({
                        id: [card.id],
                        code: [card.code],
                        title: [card.title],
                        type: [card.type],
                        link: [card.link],
                        icon: [card.icon]
                    })
                );
            });

            // Add the user form groups to the users form array
            cards.forEach((paramFormGroup) => {
                (this.valuesForm.get('values') as FormArray).push(paramFormGroup);
            });
            console.warn('controls',this.valuesForm.get('values')['controls']);
            this._change.markForCheck();
            /** load cards **/

        });
    }

}
