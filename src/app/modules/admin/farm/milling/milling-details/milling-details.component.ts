import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MillingComponent } from '../milling.component';
import { MatDrawerToggleResult } from '@angular/material/sidenav';
import { FormulaService } from '../../formula/formula.service';
import {
    FormArray,
    FormsModule, ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableExporterModule } from 'mat-table-exporter';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { ProductService } from '../../product/product.service';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';
import { UrpiConfirmationService } from '../../../../../../@urpi/services/confirmation/confirmation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DispatchService } from '../../dispatch/dispatch.service';

@Component({
  selector: 'app-milling-details',
  standalone: true,
  imports: [
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatIconModule,MatButtonModule,MatTableModule,MatInputModule,
      MatTableExporterModule,NgFor,NgIf,NgClass,MatSelectModule,MatTooltipModule
  ],
  templateUrl: './milling-details.component.html'
})
export class MillingDetailsComponent implements OnInit{

    public editMode: boolean = true;
    public formulas: any = [];

    public selectedFormula:any;
    public dataSource: any;
    public detailForm: UntypedFormGroup;
    public selected: any;
    public cols = [
        { field: 'product', header: 'Producto', width: 'min-w-32'},
        { field: 'quantityUnit', header: 'Unidad', width: 'min-w-28'},
        { field: 'quantityRequired', header: 'Cantidad', width: 'min-w-28'},
    ];

    public displayedColumns = [/*'accion',*/'product','quantityUnit','quantityRequired'];

    public units: any = ['Kilogramo'/*,'Quintal','Tonelada'*/];
    public products: any=[];

    public order : any;
    constructor(
        private milling: MillingComponent,
        private _change: ChangeDetectorRef,
        private _formula: FormulaService,
        private _builder: UntypedFormBuilder,
        private _product: ProductService,
        private _confirmation: UrpiConfirmationService,
        private _activated: ActivatedRoute,
        private _router: Router,
        private _dispatch: DispatchService
    ) {}

    ngOnInit(): void {
        // Open the drawer
        this.milling.matDrawer.open();
        this.order = this.milling.order;
        this.detailForm = this._builder.group({
            details: this._builder.array([]),
        });

        this._product.getProduct().subscribe((data)=>{
            this.products = data.products;
        });

        this._formula.get().subscribe((data)=>{
            this.formulas = data;


            console.warn('this.formulas',data);
            this.selectedFormula = this.formulas.find(item => item.stage.id === this.milling.stage.id);

            console.warn('FORMULAS',this.selectedFormula);

            const details = [];
            // Iterate through them
            this.selectedFormula.details.forEach((field) => {

                // Create an user form group
                details.push(
                    this._builder.group({
                        formulaId: [field.formulaId, [Validators.required]],
                        productId: [field.product.id, [Validators.required]],
                        quantityUnit: [field.quantityUnit, [Validators.required]],
                        quantityRequired: [field.quantityRequired, [Validators.required]],
                        action: ['existingRecord'],
                        isEditable: [true],
                        isNewRow: [false]
                    })
                );
            });

            // Add the user form groups to the users form array
            details.forEach((fielFormGroup) => {
                (this.detailForm.get('details') as FormArray).push(fielFormGroup);
            });

            this.dataSource = this.selectedFormula.details//new MatTableDataSource((this.detailForm.get('details') as UntypedFormArray).controls);
            console.warn('this.dataSource',this.dataSource);
            //this.detailForm.patchValue(this.selectedFormula);
            // Mark for check
            this._change.markForCheck();

        });
        console.warn('STAGE',this.milling.stage);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this.milling.matDrawer.close();
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

    redirect(row){
        this.selected = row;
        // Mark for check
        this._change.markForCheck();
    }

    /** Gets the total quantity of all transactions. */
    getTotalQuantityEdit() {
        return this.detailForm.get('details').getRawValue()
            .map((t) => +t.quantityRequired)
            .reduce((acc, value) => acc + value, 0);
    }

    displayProductEdit(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    dispacher(){
        let dispatch = {
            date : new Date(),
            documentNumber : this.order.code,
            farms : [
                {
                    farmId : this.order.farm.id
                }
            ],
            galponero : "",
            driver : "",
            vehicle : "",
            observation : "",
            orderId : this.order.id,
            detailDispatchList : [
                {
                    stageId : this.order.stage.id,
                    quantity : this.order.quantity,
                    unitMeasurement : "Tonelada",
                    unitPrice : 0,
                    subTotal : 0
                }
            ],
            total : 0
        };
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro de enviar para despacho el pedido?',
            actions: {
                confirm: {
                    label: 'Confirmar',
                },
            },
        });

        // Subscribe to the confirmation dialog closed action
        confirmation.afterClosed().subscribe((result) => {
            // If the confirm button pressed...
            if (result === 'confirmed') {

                this._dispatch.post(dispatch).subscribe((resp: any) => {

                    // Delete the role on the server
                    this._formula.changeStatus(this.order.id,'PARADESPACHAR').subscribe(() => {
                        Swal.fire({
                            title: "Pedido esta listo para despachar",
                            icon: "success"
                        });
                        this.reload();
                        this._router.navigate(['../'], { relativeTo: this._activated });
                    });
                });

            }
        });

    }

    reload(){
        this._router.navigate(['../'], { relativeTo: this._activated });
        this.milling.reload();
    }
}
