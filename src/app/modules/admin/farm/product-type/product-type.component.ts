import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { TablePagination } from '../../security/security.types';
import { MatSort } from '@angular/material/sort';
import { takeUntil } from 'rxjs/operators';
import { ProductTypeService } from './product-type.service';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-product-type',
  standalone: true,
  imports: [
      NgFor,DatePipe,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatButtonModule,
      RouterOutlet,MatSidenavModule,MatTableModule,MatIconModule,MatTableExporterModule,
      MatTooltipModule,MatInputModule,MatPaginatorModule,NgClass
  ],
  templateUrl: './product-type.component.html'
})
export class ProductTypeComponent {

    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public drawerMode: 'side' | 'over';
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public selectedProductType: any;

    public cols = [
        { field: 'name', header: 'Nombre', width: 'min-w-72'},
    ];

    public displayedColumns = ['accion','name'];

    public action;
    public productsType: any = [];
    public pagination: TablePagination;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    public isLoading: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _type: ProductTypeService,
        private _activated: ActivatedRoute,
        private _router: Router,
        private _change: ChangeDetectorRef,
        private _confirmation: UrpiConfirmationService

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        this._type.getProductType().subscribe((data:any)=>{
            this.productsType = data.productsType;
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

            this._type.getProductType(
                this._paginator.pageIndex,
                this._paginator.pageSize,
                this._sort.active,
                this._sort.direction
            ).subscribe((data:any)=>{
                this.productsType = data.productsType;
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
    createProductType(): void{

        this.action = 'new';
        // Create the product
        let newProductType = {id:0,name: ''};
        this.selectedProductType = newProductType;
        // Go to the new provider
        this._router.navigate(['./', newProductType.id], {relativeTo: this._activated});
        // Mark for check
        this._change.markForCheck();
    }

    /**
     * view provider data
     */

    view(row): void{
        this.action = 'view';
        this.selectedProductType = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * edit provider data
     */

    edit(row): void{
        this.action = 'edit';
        this.selectedProductType = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * delete provider data
     */

    delete(row): void{
        // Open the confirmation dialog
        const confirmation = this._confirmation.open({
            title: 'Estimado Usuario',
            message: 'Estás seguro, que deseas eliminar el registro seleccionado?',
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
                this._type.deleteProductType(row.id).subscribe(() => {

                    Swal.fire({
                        title: "Registro eliminado exitosamente !!!",
                        icon: "success"
                    });

                    this.reload();
                });
            }
        });
    }

    reload(){
        this._type.getProductType().subscribe((data:any)=>{
            this.productsType = data.productsType;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }

}
