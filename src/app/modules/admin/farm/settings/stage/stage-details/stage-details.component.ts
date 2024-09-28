import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UrpiConfirmationService } from '../../../../../../../@urpi/services/confirmation/confirmation.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import Swal from 'sweetalert2';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Subject } from 'rxjs';
import { StageComponent } from '../stage.component';
import { StageService } from '../stage.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-stage-details',
  standalone: true,
  imports: [
      NgIf,NgFor,MatButtonModule,MatTooltipModule,RouterModule,MatSelectModule,MatMenuModule,
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,UpperCasePipe,MatIconModule,
      MatDividerModule
  ],
  templateUrl: './stage-details.component.html'
})
export class StageDetailsComponent {

    public stageForm: UntypedFormGroup;
    public editMode: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _tagsPanelOverlayRef: OverlayRef;
    public selected:any;
    public cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];
    public units: any = ['Kilogramo','Quintal','Tonelada'];
    constructor(
        private stage: StageComponent,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef,
        private _form: UntypedFormBuilder,
        private _stage: StageService,
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
        console.warn('this.stage',this.stage);
        // Open the drawer
        this.stage.matDrawer.open();

        this.selected = this.stage.selectedStage ?? {};

        if( ['new','edit'].includes(this.stage.action) )
            this.toggleEditMode(true);
        else
            this.toggleEditMode(false);


        // Create the product form
        this.stageForm = this._form.group({
            id: [''],
            name: ['',[Validators.required]]
        });

        this.stageForm.patchValue(this.stage.selectedStage);
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
        return this.stage.matDrawer.close();
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


    saveStage(): void{
        if( this.stage.action === 'new'){

            const stage = this.stageForm.getRawValue();
            this._stage.postStage(stage).subscribe((resp: any) => {
                Swal.fire({
                    title: "Tipo de producto guardado exitosamente !!!",
                    icon: "success"
                });
                this.stage.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });
        }else{

            const stage = this.stageForm.getRawValue();
            this._stage.updateStage(stage.id, stage).subscribe((resp: any) => {
                Swal.fire({
                    title: "Tipo de producto actualizado exitosamente !!!",
                    icon: "success"
                });
                this.stage.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });

        }
    }
}
