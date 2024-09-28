import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UrpiConfirmationService } from '../../../../../../@urpi/services/confirmation/confirmation.service';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { ProductComponent } from '../product.component';
import { ProductService } from '../product.service';
import { NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductTypeService } from '../../product-type/product-type.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
      NgIf,NgFor,MatButtonModule,MatTooltipModule,RouterModule,MatSelectModule,
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,UpperCasePipe
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {
    public productForm: UntypedFormGroup;
    public editMode: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _tagsPanelOverlayRef: OverlayRef;
    public selected:any;
    public cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];
    public units: any = ['Kilogramo','Quintal','Tonelada','Bolsa'];
    public types: any = [];
    constructor(
        private product: ProductComponent,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef,
        private _form: UntypedFormBuilder,
        private _product: ProductService,
        private _confirmation: UrpiConfirmationService,
        private _router: Router,
        private _type: ProductTypeService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this.product.matDrawer.open();

        this.selected = this.product.selectedProduct;

        if( ['new','edit'].includes(this.product.action) )
            this.toggleEditMode(true);
        else
            this.toggleEditMode(false);

        this._type.getProductType().subscribe((data:any)=>{
            this.types =  data.productsType;
        });

        // Create the product form
        this.productForm = this._form.group({
            id: [''],
            kindProductId: ['',[Validators.required]],
            name: ['',[Validators.required]],
            unit: ['',[Validators.required]],
            description: [''],
            purchasePrice: [''],
            salePrice: [''],
            unitBase: [''],
            equivalentQQ: [''],
            equivalentKg: [''],
        });

        this.product.selectedProduct.kindProductId = this.product.selectedProduct.kindProductResponse.id;
        this.productForm.patchValue(this.product.selectedProduct);
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
        return this.product.matDrawer.close();
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

    saveProduct(): void{
        if( this.product.action === 'new'){ console.warn('NUEVO');

            const product = this.productForm.getRawValue();
            this._product.postProduct(product).subscribe((resp: any) => {
                Swal.fire({
                    title: "Registro guardado exitosamente !!!",
                    icon: "success"
                });
                this.product.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });
        }else{ console.warn('EDITAR');

            const product = this.productForm.getRawValue();
            this._product.updateProduct(product.id, product).subscribe((resp: any) => {
                Swal.fire({
                    title: "Registro actualizado exitosamente !!!",
                    icon: "success"
                });
                this.product.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });

        }
    }

    displayType(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }
}
