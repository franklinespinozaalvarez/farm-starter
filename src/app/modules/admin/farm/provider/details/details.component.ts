import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProviderComponent } from '../provider.component';
import { Subject } from 'rxjs';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayRef } from '@angular/cdk/overlay';
import { MatSelectModule } from '@angular/material/select';
import Swal from 'sweetalert2';
import { ProviderService } from '../provider.service';
import { UrpiConfirmationService } from '../../../../../../@urpi/services/confirmation/confirmation.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
      NgIf,NgFor,MatButtonModule,MatTooltipModule,RouterModule,MatSelectModule,
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,UpperCasePipe
  ],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit{

    public providerForm: UntypedFormGroup;
    public editMode: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _tagsPanelOverlayRef: OverlayRef;
    public selected:any;
    public cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];
    constructor(
        private provider: ProviderComponent,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef,
        private _form: UntypedFormBuilder,
        private _provider: ProviderService,
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
        this.provider.matDrawer.open();

        this.selected = this.provider.selectedProvider;

        if( ['new','edit'].includes(this.provider.action) )
            this.toggleEditMode(true);
        else
            this.toggleEditMode(false);


        // Create the provider form
        this.providerForm = this._form.group({
            id: [''],
            name: ['',[Validators.required]],
            email: ['',[Validators.email]],
            phone: ['',[Validators.required]],
            address: ['',[Validators.required]],
            city: ['',[Validators.required]],
        });

        this.providerForm.patchValue(this.provider.selectedProvider);
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
        return this.provider.matDrawer.close();
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

    deleteProvider(): void{

    }

    saveProvider(): void{
        if( this.provider.action === 'new'){ console.warn('NUEVO');

            const provider = this.providerForm.getRawValue();
            this._provider.postProvider(provider).subscribe((resp: any) => {
                Swal.fire({
                    title: "Registro guardado exitosamente !!!",
                    icon: "success"
                });
                this.provider.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });
        }else{ console.warn('EDITAR');

            const provider = this.providerForm.getRawValue();
            this._provider.updateProvider(provider.id, provider).subscribe((resp: any) => {
                Swal.fire({
                    title: "Registro actualizado exitosamente !!!",
                    icon: "success"
                });
                this.provider.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });

        }
    }

}
