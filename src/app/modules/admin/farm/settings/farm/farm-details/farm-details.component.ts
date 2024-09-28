import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StageService } from '../../stage/stage.service';
import { UrpiConfirmationService } from '../../../../../../../@urpi/services/confirmation/confirmation.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FarmComponent } from '../farm.component';
import { FarmService } from '../farm.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-farm-details',
  standalone: true,
  imports: [
      NgIf,NgFor,MatButtonModule,MatTooltipModule,RouterModule,MatSelectModule,MatIconModule,
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,UpperCasePipe,MatDividerModule
  ],
  templateUrl: './farm-details.component.html'
})
export class FarmDetailsComponent {
    public farmForm: UntypedFormGroup;
    public editMode: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _tagsPanelOverlayRef: OverlayRef;
    public selected:any;
    public cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];
    constructor(
        private farm: FarmComponent,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef,
        private _form: UntypedFormBuilder,
        private _farm: FarmService,
        private _confirmation: UrpiConfirmationService,
        private _router: Router
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this.farm.matDrawer.open();

        this.selected = this.farm.selected;

        if( ['new','edit'].includes(this.farm.action) )
            this.toggleEditMode(true);
        else
            this.toggleEditMode(false);


        // Create the farm form
        this.farmForm = this._form.group({
            id: [''],
            name: ['',[Validators.required]],
            province: ['',],
            phone: ['',[Validators.required]],
            address: ['',[Validators.required]],
            city: ['',[Validators.required]],
        });

        this.farmForm.patchValue(this.farm.selected);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this.farm.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._change.markForCheck();
    }


    save(): void{
        if( this.farm.action === 'new'){ console.warn('NUEVO');

            const farm = this.farmForm.getRawValue();
            this._farm.post(farm).subscribe((resp: any) => {
                Swal.fire({
                    title: "Granja guardado exitosamente !!!",
                    icon: "success"
                });
                this.farm.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });
        }else{ console.warn('EDITAR');

            const farm = this.farmForm.getRawValue();
            this._farm.update(farm.id, farm).subscribe((resp: any) => {
                Swal.fire({
                    title: "Granja actualizado exitosamente !!!",
                    icon: "success"
                });
                this.farm.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });

        }
    }
}
