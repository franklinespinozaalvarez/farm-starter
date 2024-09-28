import { ChangeDetectorRef, Component } from '@angular/core';
import {
    FormArray,
    FormsModule,
    ReactiveFormsModule, UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup, Validators,
} from '@angular/forms';
import { StageService } from '../settings/stage/stage.service';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../product/product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { FormulaService } from './formula.service';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [
      FormsModule,ReactiveFormsModule,MatRadioModule,MatOptionModule,MatFormFieldModule,MatInputModule,
      MatButtonModule,MatIconModule,MatTooltipModule,MatSelectModule,NgIf,NgFor,MatTableExporterModule,
      MatTableModule
  ],
  templateUrl: './formula.component.html'
})
export class FormulaComponent {

    public formulaForm: UntypedFormGroup;
    public detailForm: UntypedFormGroup;
    public stages: any;
    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    public action: any = 'close';
    public actionEdit: any = 'close';

    selected: any;

    public dataSource: any;
    public dataSourceEdit: any;

    public cols = [
        { field: 'productId', header: 'Producto', width: 'min-w-32'},
        { field: 'quantityUnit', header: 'Unidad', width: 'min-w-28'},
        { field: 'quantityRequired', header: 'Cantidad', width: 'min-w-28'},
    ];

    public displayedColumns = ['accion','productId','quantityUnit','quantityRequired'];

    public units: any = ['Kilogramo'/*,'Quintal','Tonelada'*/];

    public products: any=[];
    public formulas: any=[];
    public selectedFormula:any;
    public details: any;
    public registeredFormula: any = [];
    private stageId: any;
    /**
     * Constructor
     */
    constructor(
        private _form: UntypedFormBuilder,
        private _stage: StageService,
        private _change: ChangeDetectorRef,
        private _product: ProductService,
        private _formula: FormulaService,
        private _confirmation: UrpiConfirmationService,
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.formulaForm = this._form.group({

            stageId: [''],
            details: this._form.array([]),
            /*newValue: this._form.group({
                stage: [''],
                detail: this._form.array([]),
            }),

            values  : this._form.array([]),*/

        });

        // Create the form
        this.detailForm = this._form.group({

            stageId: [''],
            details: this._form.array([]),
        });

        this.formulaForm.patchValue(this.formulas);

        this.details = [];

        if ( this.formulas?.length > 0 ) {
            // Iterate through them
            this.formulas?.forEach((detail) => {
                // Create an detail form group
                this.details.push(
                    this._form.group({
                        id: [detail.id],
                        productId: [detail.productId],
                        quantityUnit: [detail.quantityUnit],
                        quantityRequired: [detail.quantityRequired],
                        action: ['existingRecord'],
                        isEditable: [true],
                        isNewRow: [false]
                    })
                );
            });

            // Add the details form groups to the details form array
            this.details.forEach((detail) => {
                (this.formulaForm.get('details') as UntypedFormArray).push(detail);
            });
        }

        this.dataSource = new MatTableDataSource((this.formulaForm.get('details') as UntypedFormArray).controls);

        this._stage.getStages().subscribe((data: any) =>{
            this.stages = data.stages;//console.warn('this.stages',this.stages);
        });

        this._product.getProduct().subscribe((data)=>{
            this.products = data.products;
        });

        this._formula.get().subscribe((data)=>{
            console.warn('formulas',data)
            this.formulas = data;
            data.forEach(item =>{
                if(item.details.length > 0)
                    this.registeredFormula.push(item.stage.id);
            });

        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    addRow(){
        // Create an empty detail form group
        const detail = this._form.group({
            productId: ['', [Validators.required]],
            quantityUnit: ['', [Validators.required]],
            quantityRequired: ['', [Validators.required]],
            action: ['newRecord'],
            isEditable: [false],
            isNewRow: [true]
        });
        // Add the detail form group to the details form array
        const control = this.formulaForm.get('details') as UntypedFormArray;
        control.insert(0,detail);
        this.dataSource = new MatTableDataSource(control.controls);
        // Mark for check
        this._change.markForCheck();
    }

    addRowEdit(){
        // Create an empty detail form group
        const detail = this._form.group({
            productId: ['', [Validators.required]],
            quantityUnit: ['', [Validators.required]],
            quantityRequired: ['', [Validators.required]],
            action: ['newRecord'],
            isEditable: [false],
            isNewRow: [true]
        });
        // Add the detail form group to the details form array
        const control = this.detailForm.get('details') as UntypedFormArray;
        control.insert(0,detail);
        this.dataSourceEdit = new MatTableDataSource(control.controls);
        // Mark for check
        this._change.markForCheck();
    }

    displayProduct(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    displayProductEdit(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    create(){
        this.action = 'new';
    }

    close(){
        this.action = 'close';
        this.formulaForm.get('details').reset();
        this.formulaForm.reset();
        this.dataSource = new MatTableDataSource([]);
        (this.formulaForm.get('details') as UntypedFormArray).clear();
    }

    reload(){
        this._formula.get().subscribe((data)=>{
            this.formulas = data;
            data.forEach(item =>{
                if(item.details.length > 0)
                    this.registeredFormula.push(item.stage.id);
            });
        });
    }

    delete(id){

    }

    deleteEdit(row,id){

        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro, que quieres eliminar el registro seleccionado?',
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

                // Delete the formular on the server
                this._formula.delete(row.value.formulaId).subscribe((data: any) =>{

                    Swal.fire({
                        title: "Registro eliminado exitosamente !",
                        icon: "success"
                    });

                    this.reload();
                    const control = this.detailForm.get('details') as UntypedFormArray;
                    // Remove the detail field
                    control.removeAt(id);
                    this.dataSourceEdit = new MatTableDataSource(control.controls);
                    this._change.markForCheck();
                });
            }
        });

    }

    add(){
        console.warn('formulaForm',this.formulaForm.getRawValue())
        this._formula.post(this.formulaForm.getRawValue()).subscribe((data: any) =>{

            Swal.fire({
                title: "Registro guardado exitosamente !",
                icon: "success"
            });

            this.formulaForm.get('details').reset();
            this.formulaForm.reset();
            this.dataSource = new MatTableDataSource([]);

            this.reload();
            /*this._formula.get().subscribe((data)=>{
                data.forEach(item =>{
                    if(item.details.length > 0)
                        this.registeredFormula.push(item.stage.id);
                });

            });*/

            this._change.markForCheck();
        });

    }

    displayStage(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    displayStageEdit(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    redirect(row){
        this.selected = row;
        // Mark for check
        this._change.markForCheck();
    }

    /**this function will enabled the select field for editd*/
    editDetail(row, i) { console.warn('editDetail',i,row);
        row.get('isEditable').patchValue(false);
    }

    /** On click of correct button in table (after click on edit) this method will call*/
    saveDetail(row, i,action) {
        console.warn('row',row,this.stageId,action)
        if(action == 'new') {
            row.get('isEditable').patchValue(true);
            //stageId details
        }else {
            row.get('isEditable').patchValue(true);
            if (row.value.formulaId) {
                this._formula.put(row.value.formulaId, {
                    ...row.value,
                    stageId: this.stageId
                }).subscribe((data: any) => {
                    Swal.fire({
                        title: "Registro actualizado exitosamente !",
                        icon: "success"
                    });
                    this._change.markForCheck();
                });
            }else{
                const item = {
                    stageId:  this.stageId,
                    details: [row.value]
                };
                console.warn('item',item);
                this._formula.post(item).subscribe((data: any) =>{

                    Swal.fire({
                        title: "Registro guardado exitosamente !",
                        icon: "success"
                    });


                    this._change.markForCheck();
                });
            }
        }

    }

    // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    cancelDetail(row, i) {
        row.get('isEditable').patchValue(true);
    }

    /** Gets the total quantity of all transactions. */
    getTotalQuantity() {
        return this.formulaForm.get('details').getRawValue()
            .map((t) => +t.quantityRequired)
            .reduce((acc, value) => acc + value, 0);
    }

    /** Gets the total quantity of all transactions. */
    getTotalQuantityEdit() {
        return this.detailForm.get('details').getRawValue()
            .map((t) => +t.quantityRequired)
            .reduce((acc, value) => acc + value, 0);
    }

    selectedStage(stage){

        this.reload();
        this.stageId = stage;

        (this.detailForm.get('details') as FormArray).clear();

        this.selectedFormula = this.formulas.find(item => item.stage.id === stage);

        this.detailForm.get('stageId').patchValue(this.selectedFormula.stage.id);

        if ( this.selectedFormula.details.length > 0 ){
            this.actionEdit = 'edit';
        }else{
            this.actionEdit = 'close';
        }


        const details = [];
        // Iterate through them
        this.selectedFormula.details.forEach((field) => {

            // Create an user form group
            details.push(
                this._form.group({
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

        this.dataSourceEdit = new MatTableDataSource((this.detailForm.get('details') as UntypedFormArray).controls);

        //this.detailForm.patchValue(this.selectedFormula);
        // Mark for check
        this._change.markForCheck();

    }
}
