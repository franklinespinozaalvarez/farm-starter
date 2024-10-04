import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { StageService } from '../../settings/stage/stage.service';
import { FarmService } from '../../settings/farm/farm.service';
import { DispatchService } from '../dispatch.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrderService } from '../../order/order.service';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrencyPipe, DatePipe, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-edit-dispatch',
  standalone: true,
  imports: [
      DatePipe,CurrencyPipe,MatTableModule,MatTableExporterModule,NgFor,NgIf,MatPaginatorModule,JsonPipe,NgClass,
      ReactiveFormsModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatTooltipModule,MatIconModule,
      MatDatepickerModule,NgxMatMomentModule,MatSelectModule,RouterModule
  ],
  templateUrl: './edit-dispatch.component.html',
  styleUrl: './edit-dispatch.component.scss'
})
export class EditDispatchComponent {
    public dispatchForm: UntypedFormGroup;

    params = {
        fecha_salida:'',
        fecha_recepcion:'',
    };
    public stages: any=[];
    public providers: any=[];

    dataSource: any;

    public cols = [
        { field: 'quantity', header: 'Cantidad', width: 'min-w-28'},
        { field: 'unitMeasurement', header: 'Unidad', width: 'min-w-28'},
        { field: 'stageId', header: 'Fase Alimento', width: 'min-w-32'},
        { field: 'unitPrice', header: 'Precio Unitario', width: 'min-w-36'},
        { field: 'subTotal', header: 'Sub Total', width: 'min-w-32'},
    ];

    public displayedColumns = ['accion','quantity','unitMeasurement','stageId','unitPrice','subTotal'];
    selectedDetails: any;

    public farms: any = [];
    public orders: any = [];

    private dispatches: any;

    @ViewChild(MatTable) table: MatTable<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;


    public details: any;
    public units: any = ['Kilogramo','Quintal','Tonelada'];
    constructor(
        private _form: FormBuilder,
        private _stage: StageService,
        private _farm: FarmService,
        private _change: ChangeDetectorRef,
        private _dispatch: DispatchService,
        private _router: Router,
        private _activated: ActivatedRoute,
        private _order: OrderService
    ) {}

    ngOnInit(): void {

        this._dispatch.dispatch$.subscribe((data)=>{
            console.warn('data',data);
            this.dispatches = data;
            this.dispatches.orderId = data.order.id;
            this.dispatches.date = new Date(data.date);
        });

        this.dispatchForm = this._form.group(
            {
                date:['', [Validators.required]],
                documentNumber:['', [Validators.required]],
                farms:[''],
                galponero:['', [Validators.required]],
                driver:['', [Validators.required]],
                vehicle:['', [Validators.required]],
                observation:[''],
                orderId:['', [Validators.required]],
                total:[''],
                detailDispatchList: this._form.array([]),
            }
        );



        this.details = [];
        //console.warn('INIT COMPONENT',this.dispatchForm.getRawValue());
        if ( this.dispatches?.detailDispatchList?.length > 0 ) {

            this.dispatchForm.patchValue(this.dispatches);

            // Iterate through them
            this.dispatches?.detailDispatchList?.forEach((detail) => {
                console.warn('detail',detail)
                // Create an detail form group
                this.details.push(
                    this._form.group({
                        detailDispatchId: [detail.id],
                        stageId: [detail.stage.id],
                        stage: [detail.stage.name],
                        quantity: [detail.quantity],
                        unitMeasurement: [detail.unitMeasurement],
                        unitPrice: [detail.unitPrice],
                        subTotal: [detail.subTotal],
                        action: ['existingRecord'],
                        isEditable: [true],
                        isNewRow: [false]
                    })
                );
            });

            // Add the details form groups to the details form array
            this.details.forEach((detail) => {
                (this.dispatchForm.get('detailDispatchList') as UntypedFormArray).push(detail);
            });
        }
        this.dataSource = new MatTableDataSource((this.dispatchForm.get('detailDispatchList') as UntypedFormArray).controls);

        this._stage.getStages().subscribe((data)=>{
            this.stages = data.stages;
        });

        this._farm.get().subscribe((data)=>{
            this.farms = data.farms;
        });

        this._order.get(0,10,'date','desc','PARADESPACHAR').subscribe((data)=>{
            this.orders = data.orders;
            console.warn('this.orders',this.orders);
        });

    }

    save(){

        const dispatch = this.dispatchForm.getRawValue();

        Object.keys(this.dispatchForm.getRawValue()).forEach(key => {
            if(key == 'total')
                dispatch[key] = this.getTotalPrice();

            if(key == 'farms') {
                let farms = [];
                dispatch[key].forEach(id => {
                    farms.push({farmId:id});
                });
                dispatch[key] = farms;
            }

        });
        console.warn('dispatch',this._activated.snapshot.queryParamMap.get('id'),dispatch);
        this._dispatch.put(this._activated.snapshot.queryParamMap.get('id'),dispatch).subscribe((resp: any) => {
            console.warn('resp DISPATCH',resp);
            Swal.fire({
                title: "Despacho actualizado exitosamente !!!",
                icon: "success"
            });
            this._router.navigate(['../'], { relativeTo: this._activated });
        });
    }

    displayStage(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }


    displayOrder(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    displayFarms(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**this function will enabled the select field for editd*/
    editDetail(row, i) { console.warn('editDetail',i,row);
        row.get('isEditable').patchValue(false);
    }

    /** On click of correct button in table (after click on edit) this method will call*/
    saveDetail(row, i) {
        row.get('isEditable').patchValue(true);
        /*const detail = this.dispatchForm.getRawValue();
        this._dispatch.put(detail.buyId,detail).subscribe((data: any) =>{
            Swal.fire({
                title: "Registro actualizado exitosamente !",
                icon: "success"
            });
            this._change.markForCheck();
        });*/
    }

    // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    cancelDetail(row, i) {
        row.get('isEditable').patchValue(true);
    }

    addRow(){
        // Create an empty detail form group
        const detail = this._form.group({
            detailDispatchId:[null, [Validators.required]],
            stageId: ['', [Validators.required]],
            quantity: ['', [Validators.required]],
            unitMeasurement: ['', [Validators.required]],
            unitPrice: ['', [Validators.required]],
            subTotal: ['', [Validators.required]],
            action: ['newRecord'],
            isEditable: [false],
            isNewRow: [true]
        });
        // Add the detail form group to the details form array
        const control = this.dispatchForm.get('detailDispatchList') as UntypedFormArray;
        control.insert(0,detail);
        this.dataSource = new MatTableDataSource(control.controls);
        // Mark for check
        this._change.markForCheck();
    }

    edit(row) {

    }

    delete(index){
        const control = this.dispatchForm.get('detailDispatchList') as UntypedFormArray;
        // Remove the detail field
        control.removeAt(index);
        this.dataSource = new MatTableDataSource(control.controls);
        // Mark for check
        this._change.markForCheck();
    }

    selected(row){
        this.selectedDetails = row;
        // Mark for check
        this._change.markForCheck();
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    /** Gets the total price of all transactions. */
    getGrossWeight() {
        return this.dispatchForm.get('detailDispatchList').getRawValue()
            .map((t) => t.grossWeight)
            .reduce((acc, value) => acc + value, 0);
    }

    /** Gets the total price of all transactions. */
    getTaraWeight() {
        return this.dispatchForm.get('detailDispatchList').getRawValue()
            .map((t) => t.taraWeight)
            .reduce((acc, value) => acc + value, 0);
    }

    /** Gets the total price of all transactions. */
    getNetWeight() {
        return this.dispatchForm.get('detailDispatchList').getRawValue()
            .map((t) => t.netWeight)
            .reduce((acc, value) => acc + value, 0);
    }

    /** Gets the total price of all transactions. */
    getQuantity() {
        return this.dispatchForm.get('detailDispatchList').getRawValue()
            .map((t) => t.quantity)
            .reduce((acc, value) => acc + value, 0);
    }

    /** Gets the total price of all transactions. */
    getUnitPrice() {
        return this.dispatchForm.get('detailDispatchList').getRawValue()
            .map((t) => t.unitPrice)
            .reduce((acc, value) => acc + value, 0);
    }

    /** Gets the total price of all transactions. */
    getTotalPrice() {
        return this.dispatchForm.get('detailDispatchList').getRawValue()
            .map((t) => +t.subTotal)
            .reduce((acc, value) => acc + value, 0);
    }
    approved(){

        this._dispatch.approved(this._activated.snapshot.queryParamMap.get('id')).subscribe((resp: any) => {

            console.warn('APPROVED',resp);
            Swal.fire({
                title: "Despacho aprobada exitosamente !!!",
                icon: "success"
            });
            this._router.navigate(['../'], { relativeTo: this._activated });
        });
    }

    onSearchChange(row,form){
        const total = row.value.quantity * row.value.unitPrice;
        form.setValue(total);
    }
}
