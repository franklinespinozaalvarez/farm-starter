import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ProductService } from '../../product/product.service';
import { UrpiConfirmationService } from '../../../../../../@urpi/services/confirmation/confirmation.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import Swal from 'sweetalert2';
import { ProductTypeComponent } from '../product-type.component';
import { Subject } from 'rxjs';
import { ProductTypeService } from '../product-type.service';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-product-type-details',
  standalone: true,
  imports: [
      NgIf,NgFor,MatButtonModule,MatTooltipModule,RouterModule,MatSelectModule,
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,UpperCasePipe
  ],
  templateUrl: './product-type-details.component.html'
})
export class ProductTypeDetailsComponent {
    public productTypeForm: UntypedFormGroup;
    public editMode: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _tagsPanelOverlayRef: OverlayRef;
    public selected:any;
    public cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];
    public units: any = ['Kilogramo','Quintal','Tonelada'];
    constructor(
        private productType: ProductTypeComponent,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef,
        private _form: UntypedFormBuilder,
        private _productType: ProductTypeService,
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
        this.productType.matDrawer.open();

        this.selected = this.productType.selectedProductType;

        if( ['new','edit'].includes(this.productType.action) )
            this.toggleEditMode(true);
        else
            this.toggleEditMode(false);


        // Create the product form
        this.productTypeForm = this._form.group({
            id: [''],
            name: ['',[Validators.required]]
        });

        this.productTypeForm.patchValue(this.productType.selectedProductType);
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
        return this.productType.matDrawer.close();
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


    saveProductType(): void{
        if( this.productType.action === 'new'){

            const productType = this.productTypeForm.getRawValue();
            this._productType.postProductType(productType).subscribe((resp: any) => {
                Swal.fire({
                    title: "Tipo de producto guardado exitosamente !!!",
                    icon: "success"
                });
                this.productType.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });
        }else{

            const productType = this.productTypeForm.getRawValue();
            this._productType.updateProductType(productType.id, productType).subscribe((resp: any) => {
                Swal.fire({
                    title: "Tipo de producto actualizado exitosamente !!!",
                    icon: "success"
                });
                this.productType.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });

        }
    }
}
