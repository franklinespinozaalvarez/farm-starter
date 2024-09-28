import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RawMaterialService } from '../raw-material.service';
import {
    FormBuilder,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import moment from 'moment';
import { ThemePalette } from '@angular/material/core';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ProductService } from '../../product/product.service';
import { ProviderService } from '../../provider/provider.service';
import { ProductTypeService } from '../../product-type/product-type.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CurrencyPipe, DatePipe, JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
      DatePipe,CurrencyPipe,MatTableModule,MatTableExporterModule,NgFor,NgIf,MatPaginatorModule,JsonPipe,NgClass,
      ReactiveFormsModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatTooltipModule,MatIconModule,
      NgxMatTimepickerModule,NgxMatDatetimePickerModule,MatDatepickerModule,NgxMatMomentModule,MatSelectModule,RouterModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit{

    public materialForm: UntypedFormGroup;

    /************** DATE TIME PICKER ******************/
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = true;
    public touchUi = false;
    public enableMeridian = false;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';
    public defaultTime = [0,0,0];
    /************** DATE TIME PICKER ******************/

    params = {
        fecha_salida:'',
        fecha_recepcion:'',
    };
    public products: any=[];
    public providers: any=[];

    dataSource: any;

    public cols = [
        { field: 'productId', header: 'Producto', width: 'min-w-32'},
        { field: 'description', header: 'Descripcion', width: 'min-w-40'},
        { field: 'unitMeasurement', header: 'Unidad', width: 'min-w-28'},
        /*{ field: 'grossWeight', header: 'Peso Bruto', width: 'min-w-28'},
        { field: 'taraWeight', header: 'Peso Tara', width: 'min-w-28'},*/
        { field: 'netWeight', header: 'Peso Neto', width: 'min-w-28'},
        { field: 'quantity', header: 'Cantidad', width: 'min-w-28'},
        { field: 'unitPrice', header: 'Precio Unitario', width: 'min-w-36'},
        { field: 'totalPrice', header: 'Total Precio', width: 'min-w-32'},
    ];

    public displayedColumns = ['accion','productId','description','unitMeasurement',/*'grossWeight','taraWeight',*/'netWeight','quantity','unitPrice','totalPrice'];
    selectedDetails: any;

    public productsType: any = [];

    private buys: any;

    @ViewChild(MatTable) table: MatTable<any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    public details: any;
    public units: any = ['Bolsa','Kilogramo'/*,'Quintal','Tonelada'*/];
    constructor(
        private _form: FormBuilder,
        private _product: ProductService,
        private _provider: ProviderService,
        private _change: ChangeDetectorRef,
        private _productType: ProductTypeService,
        private _material: RawMaterialService,
        private _router: Router,
        private _activated: ActivatedRoute
    ) {}

    ngOnInit(): void {

        this._material.material$.subscribe((data)=>{
            console.warn('data',data);
            this.buys = data;
            this.buys.kindProductId = data.kindProduct.id;
            this.buys.providerId = data.provider.id;
            //this.buys.date = moment(data.date).format('LL');
            this.buys.date = new Date(data.date);
            //console.warn('this.buys.date',this.buys.date);//moment(data.date).format('MMMM Do YYYY, h:mm a');
        });

        this.materialForm = this._form.group(
            {
                buyId:['',],
                kindProductId:['', ],
                documentNumber:['',],
                date:['', ],
                providerId:['', ],
                driver:['', ],
                vehicle:['', ],
                totalBuy:[''],
                detailList: this._form.array([]),
            }
        );

        //console.warn('this.buys',this.buys);
        this.materialForm.patchValue(this.buys);

        console.warn('this.materialForm',this.materialForm.getRawValue());
        //this.materialForm.get('date').setValue(moment(this.buys.date).format('dd/MM/yyyy'))

        this.details = [];

        if ( this.buys?.detailList?.length > 0 ) {
            // Iterate through them
            this.buys?.detailList?.forEach((detail) => {
                console.warn('detail',detail);
                // Create an detail form group
                this.details.push(
                    this._form.group({
                        idDetail: [detail.idDetail],
                        productId: [detail.product.id],
                        description: [detail.description],
                        unitMeasurement: [detail.unitMeasurement],
                        /*grossWeight: [detail.grossWeight],
                        taraWeight: [detail.taraWeight],*/
                        netWeight: [detail.netWeight],
                        quantity: [detail.quantity],
                        unitPrice: [detail.unitPrice],
                        totalPrice: [detail.totalPrice],
                        action: ['existingRecord'],
                        isEditable: [true],
                        isNewRow: [false]
                    })
                );
            });

            // Add the details form groups to the details form array
            this.details.forEach((detail) => {
                (this.materialForm.get('detailList') as UntypedFormArray).push(detail);
            });
        }

        this.dataSource = new MatTableDataSource((this.materialForm.get('detailList') as UntypedFormArray).controls);

        this._product.getProduct().subscribe((data)=>{
            this.products = data.products;
        });

        this._provider.getProvider().subscribe((data)=>{
            this.providers = data.providers;
        });

        this._productType.getProductType().subscribe((data: any)=>{
            this.productsType = data.productsType;
        });

    }

    save(){

        const material = this.materialForm.getRawValue();
        Object.keys(this.materialForm.getRawValue()).forEach(key => {
            if(key == 'totalBuy')
                material[key] = this.getTotalPrice();

            /*if(key == 'date')
                material[key] = moment(material[key]).format("YYYY-MM-DD");*/

        });
        console.warn('COMPRA',material);
        this._material.postMaterial(material).subscribe((resp: any) => {
            Swal.fire({
                title: "Compra guardada exitosamente !!!",
                icon: "success"
            });
            this._router.navigate(['../'], { relativeTo: this._activated });
        });
    }

    approved(){

        this._material.approved(this._activated.snapshot.queryParamMap.get('id')).subscribe((resp: any) => {

            console.warn('APPROVED',resp);
            Swal.fire({
                title: "Compra aprobada exitosamente !!!",
                icon: "success"
            });
            this._router.navigate(['../'], { relativeTo: this._activated });
        });
    }

    displayProduct(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }


    displayProvider(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    displayProductType(attribute1,attribute2) {
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
        const detail = this.materialForm.getRawValue();

        console.warn('this.materialForm',detail);
        this._material.put(detail.buyId,detail).subscribe((data: any) =>{
            Swal.fire({
                title: "Registro actualizado exitosamente !",
                icon: "success"
            });
            this._change.markForCheck();
        });
    }

    saveEdit() {
        const detail = this.materialForm.getRawValue();
        this._material.put(detail.buyId,detail).subscribe((data: any) =>{
            Swal.fire({
                title: "Compra actualizado exitosamente !",
                icon: "success"
            });
            this._change.markForCheck();
        });
    }

    // On click of cancel button in the table (after click on edit) this method will call and reset the previous data
    cancelDetail(row, i) {
        row.get('isEditable').patchValue(true);
    }

    addRow(){
        // Create an empty detail form group
        const detail = this._form.group({
            /*id: [''],*/
            productId: ['', [Validators.required]],
            description: [''],
            unitMeasurement: ['', [Validators.required]],
            /*grossWeight: [''],
            taraWeight: [''],*/
            netWeight: [''],
            quantity: ['', [Validators.required]],
            unitPrice: ['', [Validators.required]],
            totalPrice: ['', [Validators.required]],
            action: ['newRecord'],
            isEditable: [false],
            isNewRow: [true]
        });
        // Add the detail form group to the details form array
        const control = this.materialForm.get('detailList') as UntypedFormArray;
        control.insert(0,detail);
        this.dataSource = new MatTableDataSource(control.controls);
        // Mark for check
        this._change.markForCheck();
    }

    edit(row) {

    }

    delete(index){
        const control = this.materialForm.get('detailList') as UntypedFormArray;
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
    getTotalPrice() {
        return this.materialForm.get('detailList').getRawValue()
            .map((t) => +t.totalPrice)
            .reduce((acc, value) => acc + value, 0);
    }
}
