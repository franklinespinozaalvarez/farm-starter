import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { TablePagination } from '../../../security/security.types';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ProductTypeService } from '../../product-type/product-type.service';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { UrpiConfirmationService } from '../../../../../../@urpi/services/confirmation/confirmation.service';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Subject } from 'rxjs';
import { MatInputModule } from '@angular/material/input';
import { StageService } from './stage.service';

@Component({
  selector: 'app-stage',
  standalone: true,
  imports: [
      NgFor,DatePipe,MatFormFieldModule,FormsModule,ReactiveFormsModule,MatButtonModule,
      RouterOutlet,MatSidenavModule,MatTableModule,MatIconModule,MatTableExporterModule,
      MatTooltipModule,MatInputModule,MatPaginatorModule,NgClass
  ],
  templateUrl: './stage.component.html'
})
export class StageComponent {
    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public drawerMode: 'side' | 'over';
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public selectedStage: any;

    public cols = [
        { field: 'name', header: 'Nombre', width: 'min-w-72'},
    ];

    public displayedColumns = ['accion','name'];


    public action;
    public stages: any = [];
    public pagination: TablePagination;

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    public isLoading: boolean = false;
    /**
     * Constructor
     */
    constructor(
        private _stage: StageService,
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
        this._stage.getStages().subscribe((data:any)=>{
            this.stages = data.stages;
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

            this._stage.getStages(
                this._paginator.pageIndex,
                this._paginator.pageSize,
                this._sort.active,
                this._sort.direction
            ).subscribe((data:any)=>{
                this.stages = data.stages;
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
     * Create stage
     */
    post(): void{

        this.action = 'new';
        // Create the product
        let newProductType = {id:0,name: ''};
        this.selectedStage = newProductType;
        // Go to the new stage
        this._router.navigate(['./', newProductType.id], {relativeTo: this._activated});
        // Mark for check
        this._change.markForCheck();
    }

    /**
     * view stage data
     */

    view(row): void{
        this.action = 'view';
        this.selectedStage = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * edit stage data
     */

    edit(row): void{
        this.action = 'edit';
        this.selectedStage = row;
        this._router.navigate(['./', row.id], { relativeTo: this._activated });
    }

    /**
     * delete stage data
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
                this._stage.deleteStage(row.id).subscribe(() => {

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
        this._stage.getStages().subscribe((data:any)=>{
            this.stages = data.stages;
            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }
}
