import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from './product.service';
import { TablePagination } from '../../security/security.types';
import { takeUntil } from 'rxjs/operators';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
      NgFor,DatePipe,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatButtonModule,
      RouterOutlet,MatSidenavModule,MatTableModule,MatIconModule,MatTableExporterModule,
      MatTooltipModule,MatInputModule,MatPaginatorModule,NgClass
  ],
  templateUrl: './product.component.html'
})
export class ProductComponent {

    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public drawerMode: 'side' | 'over';
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public selectedProduct: any;

    public cols = [
        { field: 'name', header: 'Nombre', width: 'min-w-72'},
        { field: 'unit', header: 'Unidad Medida', width: 'min-w-72'}/*,
        { field: 'status', header: 'Estado', width: 'min-w-72'}*/
    ];

    public displayedColumns = ['accion','name','unit','status'];

    public dataSource = [
        {
            id: 1,
            name: 'Fosfito',
            unit: 'Kilo',
            status:true
        },
        {
            id: 2,
            name: 'Metionina',
            unit: 'Kilo',
            status:true
        },
    ];

    public units: any = ['Kilogramo','Quintal','Tonelada'];

    public action;
    public products: any = [];
    public pagination: TablePagination;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    public isLoading: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _activated: ActivatedRoute,
        private _router: Router,
        private _change: ChangeDetectorRef,
        private _product: ProductService,
        private _confirmation: UrpiConfirmationService,
    ){}

    /**
     * On init
     */
    ngOnInit(): void {
        this._product.getProduct().subscribe((data:any)=>{
            this.products = data.products;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
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

            this._product.getProduct(
                this._paginator.pageIndex,
                this._paginator.pageSize,
                this._sort.active,
                this._sort.direction
            ).subscribe((data:any)=>{
                this.products = data.products;
                // Update the pagination
                this.pagination = data.pagination;
                // Mark for check
                this._change.markForCheck();
            });

        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
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
     * Create provider
     */
    createProduct(): void{

        this.action = 'new';
        // Create the product
        let newProduct = {id:0,name: '',unit: '',status: true};
        this.selectedProduct = newProduct;
        // Go to the new provider
        this._router.navigate(['./', newProduct.id], {relativeTo: this._activated});
        // Mark for check
        this._change.markForCheck();
    }

    /**
     * view provider data
     */

    view(row): void{
        this.action = 'view';
        this.selectedProduct = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * edit provider data
     */

    edit(row): void{
        this.action = 'edit';
        this.selectedProduct = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * delete provider data
     */

    delete(row): void{
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro, que deseas eliminar el producto seleccionado?',
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
                this._product.deleteProduct(row.id).subscribe(() => {

                    Swal.fire({
                        title: "Producto eliminado exitosamente !!!",
                        icon: "success"
                    });

                    this.reload();
                });
            }
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    reload(){
        this._product.getProduct().subscribe((data:any)=>{
            this.products = data.products;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }

}
