import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { RawMaterialService } from './raw-material.service';
import { TablePagination } from '../../security/security.types';
import Swal from 'sweetalert2';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { MatDialog } from '@angular/material/dialog';
import { ViewComponent } from './view/view.component';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-raw-material',
  standalone: true,
  imports: [
      NgFor,NgIf,DatePipe,NgClass,
      FormsModule,ReactiveFormsModule,MatFormFieldModule, MatIconModule,MatTableModule,
      MatTooltipModule,MatButtonModule,MatInputModule,MatTableExporterModule,MatPaginatorModule
  ],
  templateUrl: './raw-material.component.html',
  styleUrl: './raw-material.component.scss'
})
export class RawMaterialComponent implements OnInit{

    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    public selected: any;

    public cols = [
        { field: 'kindProduct', header: 'Tipo Producto', width: 'min-w-72'},
        { field: 'documentNumber', header: 'Numero Documento', width: 'min-w-72'},
        { field: 'provider', header: 'Proveedor', width: 'min-w-40'},
        { field: 'totalBuy', header: 'Total', width: 'min-w-40'},
        { field: 'date', header: 'Fecha', width: 'min-w-40'},
        { field: 'driver', header: 'Conductor', width: 'min-w-40'},
        { field: 'vehicle', header: 'Vehiculo', width: 'min-w-40'}
    ];
    public displayedColumns = ['accion','date','kindProduct','documentNumber','provider','totalBuy','driver','vehicle'];


    public dataSource = [];

    public materials: any = [];
    public pagination: TablePagination;

    private _eventPanelOverlayRef: OverlayRef;
    //@ViewChild('managerPanel') private _managerPanel: TemplateRef<any>;
    public panelMode: any = 'view';
    public eventEditMode: any = 'single';

    public isLoading: boolean = false;
    constructor(
        private _router: Router,
        private _activated: ActivatedRoute,
        private _material: RawMaterialService,
        private _change: ChangeDetectorRef,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _matDialog: MatDialog,
        private _confirmation: UrpiConfirmationService,

    ) {}

    ngOnInit(): void {
        this._material.getRawMaterial().subscribe((data:any) =>{
            this.materials = data.materials;
            this.pagination = data.pagination;
            this._change.markForCheck();
        });
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    redirect(){
        this._router.navigate(['./nuevo'], { relativeTo: this._activated });
    }

    reload(){
        this._material.getRawMaterial().subscribe((data:any) =>{
            this.materials = data.materials;
            this.pagination = data.pagination;
            this._change.markForCheck();
        });
    }

    deleteRow(row){
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
                this._material.delete(row.buyId).subscribe((resp: any) => {

                    console.warn('DELETE',resp);
                    Swal.fire({
                        title: "Compra eliminada exitosamente !!!",
                        icon: "success"
                    });
                    this.reload();
                });
            }
        });
    }

    edit(row: any){
        this._material.material = row;
        //console.warn('row',row);
        this._router.navigate(['./editar'], { relativeTo: this._activated, queryParams: {id:row.buyId}});
    }

    view(row: any){
        const dialogRef = this._matDialog.open(ViewComponent,{
            height: '80%',
            width: '80%',
            data: {
                selected: row
            }
        });

        dialogRef.afterClosed().subscribe((result) => {

        });
    }

}
