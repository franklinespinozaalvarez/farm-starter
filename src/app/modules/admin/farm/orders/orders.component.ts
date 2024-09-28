import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UrpiCardComponent } from '../../../../../@urpi/components/card/card.component';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ProductTypeService } from '../product-type/product-type.service';
import { CurrencyPipe, DatePipe, NgClass, NgFor } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { OrdersDetailsComponent } from './orders-details/orders-details.component';
import { StageService } from '../settings/stage/stage.service';
import { debounceTime, map, merge, switchMap, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FarmService } from '../settings/farm/farm.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxInputCounterModule } from 'ngx-input-counter';
import Swal from 'sweetalert2';
import { OrderService } from '../order/order.service';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { TablePagination } from '../../security/security.types';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatSort, Sort } from '@angular/material/sort';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';
import { UrpiLoadingService } from '../../../../../@urpi/services/loading/loading.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
      MatMenuModule,MatIconModule,MatDividerModule,MatButtonModule,UrpiCardComponent,MatSelectModule,
      ReactiveFormsModule,FormsModule,MatTooltipModule,MatFormFieldModule,MatInputModule,NgClass,
      CurrencyPipe,NgFor,MatTooltipModule,MatAutocompleteModule,NgxInputCounterModule,MatTableModule,
      MatPaginatorModule,MatTableExporterModule,DatePipe,MatSidenavModule,RouterModule,RouterOutlet
  ],
  templateUrl: './orders.component.html'
})
export class OrdersComponent implements OnInit{


    public formProduct: UntypedFormGroup;
    public types: any = [];
    public stages: any = [];
    public orders: any = [];
    public farms: any = [];
    public switch: any=true;

    private images: any = ['images/stage/pre_inicio.jpg','images/stage/inicio.jpg','images/stage/engorde.jpg','images/stage/final.jpg'];

    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    public quantity: number = 1;

    public orderList: any = [];
    public orderListFilter: any = [];
    public pagination: TablePagination;
    public isLoading: boolean = false;

    public label: any = 'PENDIENTE';

    public cols = [
        { field: 'farm', header: 'Granja', width: 'min-w-36'},
        { field: 'stage', header: 'Estapa', width: 'min-w-28'},
        { field: 'date', header: 'Fecha', width: 'min-w-36'},
        { field: 'quantity', header: 'Cantidad (Tn)', width: 'min-w-20'},
        { field: 'code', header: 'Codigo Pedido', width: 'min-w-12'},
        { field: 'status', header: 'Estado', width: 'min-w-32'},
    ];
    public displayedColumns = ['accion','code','farm','stage','date','quantity','status'];

    public drawerMode: 'side' | 'over';
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;

    public selected: any;
    public action = '';
    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    //public sort: string = 'date';
    //public order: string = 'desc';

    public showInterval: string = 'Del dia';
    private interval:number = 0;
    constructor(
        private _builder: UntypedFormBuilder,
        private _type: ProductTypeService,
        private _change: ChangeDetectorRef,
        private _dialog: MatDialog,
        private _stage: StageService,
        private _farm: FarmService,
        private _order: OrderService,
        private _router: Router,
        private _activated: ActivatedRoute,
        private _confirmation: UrpiConfirmationService,
        private _loading: UrpiLoadingService
    ) {}

    ngOnInit(): void {
        this.formProduct = this._builder.group({
           search: [''],
           type: ['']
        });

        this._type.getProductType().subscribe((data:any)=>{
            this.types = data.productsType;
            // Mark for check
            this._change.markForCheck();
        });

        this._stage.getStages().subscribe((data:any)=>{
            this.stages = data.stages;
            this.stages.map((item, index) => item.image = this.images[index]);
            // Mark for check
            this._change.markForCheck();
        });

        this._farm.get().subscribe((data:any)=>{
            this.farms = data.farms;
            // Mark for check
            this._change.markForCheck();
        });

        // Subscribe to search input field value changes
        this.searchInputControl.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(2000)
            ).subscribe(query => {
                console.warn('query',query);
                /*this._adminService.postContentsTemplate(query)
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe((response: any) => {

                    });*/
            });


        this._order.get().subscribe((data:any)=>{
            this.orderList = this.orderListFilter = data.orders;
            //console.log(' this.orderList', this.orderList);
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * On backdrop clicked
     */
    onBackdropClicked(): void {
        // Go back to the list
        this._router.navigate(['./'], { relativeTo: this._activated });

        // Mark for check
        this._change.markForCheck();
    }


    /**
     * After view init
     */
    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
            });

            // Mark for check
            this._change.markForCheck();

            // If the role changes the sort order...
            this._sort.sortChange
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe(() => {
                    // Reset back to the first page
                    this._paginator.pageIndex = 0;

                    // Close the details

                });

            this._order.get(
                this._paginator.pageIndex,
                this._paginator.pageSize,
                this._sort.active,
                this._sort.direction
            ).subscribe((data:any)=>{
                this.orderListFilter = data.orders;
                // Update the pagination
                this.pagination = data.pagination;
                // Mark for check
                this._change.markForCheck();
            });

            /*merge(this._sort.sortChange, this._paginator.page).pipe(
                switchMap(() => {
                    this.isLoading = true;
                    this._router.navigate(['./'], {relativeTo: this._activated});
                    return this._order.get(
                        this._paginator.pageIndex,
                        this._paginator.pageSize,
                        this._sort.active,
                        this._sort.direction
                    ).subscribe((data:any)=>{
                        this.orderList = data.orders;
                        // Update the pagination
                        this.pagination = data.pagination;
                        // Mark for check
                        this._change.markForCheck();
                    });
                }),
                map(() => {
                    this.isLoading = false;
                })
            ).subscribe();*/

            // Get products if sort or page changes

        }
    }

    /*sortData(sort: Sort) {
        this.sort = sort.active;
        this.order = sort.direction;
        this._order.get(this.selectedState, this.selectedYear.id_gestion,this.currentPage*this.pageSize,this.pageSize,this.sort,this.dir,this.query).subscribe(
            (response:any) => {
                //const resp = JSON.parse(response.datos[0].listclaims);
                this.reclamos = this.filteredReclamos = response.claims;
                this._changeDetectorRef.markForCheck();

            }
        );
    }*/

    onChange(ev) {
        console.warn();
    }


    post(){

    }

    /**
     * view order data
     */

    view(row): void{
        this.action = 'view';
        this.selected = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * edit order data
     */

    edit(row): void{
        this.action = 'edit';
        this.selected = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * delete order data
     */

    delete(row): void{
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

                // Delete the role on the server
                this._order.delete(row.id).subscribe(() => {
                    Swal.fire({
                        title: "Registro eliminado exitosamente !",
                        icon: "success"
                    });
                    this.reload();

                });
            }
        });
    }

    reload(){
        this._order.get().subscribe((data:any)=>{
            this.orderListFilter = data.orders;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }

    exchange(value){
        this.switch = value;
    }

    add(stage){
        console.warn('add',stage);

        const order = this.orders.find(item => item.stage.id == stage.id);

        console.warn('order',order);

        if (!order) {
            if (this.orders.length == 0) {
                this.orders.unshift(
                    {
                        quantity: this.quantity,
                        stage,
                        price: 0,
                        subtotal: this.quantity * 0
                    }
                );
            }
        }else{
            this.quantity++;
            const orders = this.orders.map((order) => {
                return { ...order, quantity: this.quantity };
            });
        }
        console.warn('this.orders',this.orders);
    }

    /**
     * Get farm
     */
    getFarm(id: any) {
        if (id !== null && id !== undefined && id !== '')
            return this.farms.find(item => item.id === id).name;
    }

    order(){
        const order = {
            date: new Date(),
            farmId: this.searchInputControl.value,
            quantity: this.quantity,
            stageId: this.orders[0].stage.id
        };

        this._order.post(order).subscribe((resp: any) => {
            Swal.fire({
                title: "Pedido guardado exitosamente !!!",
                icon: "success"
            });
            this.searchInputControl.reset();
            this.orders = [];

            /*this._order.get().subscribe((data:any)=>{
                this.orderListFilter = data.orders;
                // Update the pagination
                this.pagination = data.pagination;
                // Mark for check
                this._change.markForCheck();
            });*/
            this.reload();
            this._change.markForCheck();
            this._router.navigate(['./'], { relativeTo: this._activated });
        });

    }

    cancel() {

        Swal.fire({
            title: "Pedido cancelado !!!",
            icon: "warning"
        });
        this.searchInputControl.reset();
        this.orders = [];
        this.quantity = 1;
    }

    changeIterval(value,day){
        this.showInterval = value;
        this.interval = day;
    }

    changeStatus(row){
        console.warn('changeStatus',row);

        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
                message: 'Estás seguro de querer enviar  el pedido a proceso Molienda?',
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

                // Delete the role on the server
                this._order.changeStatus(row.id,'MOLIENDA').subscribe(() => {
                    Swal.fire({
                        title: "Registro enviado a MOLIENDA exitosamente !",
                        icon: "success"
                    });
                    this.reload();

                });
            }
        });
    }

    mouseEnter(value){
        switch (value) {
            case 'PENDIENTE': this.label = 'MOLIENDA'; break;
            case 'MOLIENDA': this.label = 'DESPACHADO'; break;
        }
    }

    pendingCount(){
        return this.orderListFilter
            .map((t) => t.status == 'PENDIENTE')
            .reduce((acc, value) => acc + value, 0);
    }

    millingCount(){
        return this.orderListFilter
            .map((t) => t.status == 'MOLIENDA')
            .reduce((acc, value) => acc + value, 0);
    }

    dispatchedToCount(){
        return this.orderListFilter
            .map((t) => t.status == 'PARADESPACHAR')
            .reduce((acc, value) => acc + value, 0);
    }

    dispatchedCount(){
        return this.orderListFilter
            .map((t) => t.status == 'DESPACHADO')
            .reduce((acc, value) => acc + value, 0);
    }
}
