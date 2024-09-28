import { ChangeDetectorRef, Component, ViewContainerRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { TablePagination } from '../../security/security.types';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import Swal from 'sweetalert2';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { DispatchService } from './dispatch.service';
import { map } from 'lodash-es';
import { UrpiConfirmationService } from '../../../../../@urpi/services/confirmation/confirmation.service';
import { ViewDispatchComponent } from './view-dispatch/view-dispatch.component';

@Component({
  selector: 'app-dispatch',
  standalone: true,
  imports: [
      ReactiveFormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatIconModule,MatTableModule,MatTooltipModule,
      MatTableExporterModule,NgFor,NgClass,NgIf,DatePipe,FormsModule

  ],
  templateUrl: './dispatch.component.html',
  styleUrl: './dispatch.component.scss'
})
export class DispatchComponent {
    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    public selected: any;

    public cols = [
        { field: 'date', header: 'Fecha', width: 'min-w-40'},
        { field: 'documentNumber', header: 'Numero Documento', width: 'min-w-72'},
        { field: 'total', header: 'Total Compra', width: 'min-w-36'},
        { field: 'farms', header: 'Granjas', width: 'min-w-40'},
        { field: 'galponero', header: 'Galponero', width: 'min-w-40'},
        { field: 'driver', header: 'Conductor', width: 'min-w-40'},
        { field: 'vehicle', header: 'Vehiculo', width: 'min-w-40'},
        { field: 'observation', header: 'Observacion', width: 'min-w-40'},
        { field: 'approved', header: 'Aprobado', width: 'min-w-40'},
    ];
    public displayedColumns = ['accion','order','satus','date','documentNumber','farms','galponero','driver','vehicle','observation','approved','total'];


    public dataSource = [];

    public dispatches: any = [];
    public pagination: TablePagination;

    constructor(
        private _router: Router,
        private _activated: ActivatedRoute,
        private _dispatch: DispatchService,
        private _change: ChangeDetectorRef,
        private _overlay: Overlay,
        private _viewContainerRef: ViewContainerRef,
        private _matDialog: MatDialog,
        private _confirmation: UrpiConfirmationService,

    ) {}

    ngOnInit(): void {
        this._dispatch.get().subscribe((data:any) =>{
            console.warn('data.dispatches',data.dispatches);
            this.dispatches = data.dispatches;
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
        this._dispatch.get().subscribe((data:any) =>{
            this.dispatches = data.dispatches;
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
                this._dispatch.delete(row.id).subscribe((resp: any) => {
                    Swal.fire({
                        title: "Despacho eliminada exitosamente !!!",
                        icon: "success"
                    });
                    this.reload();
                });
            }
        });
    }

    edit(row: any){
        row.farms= map(row.farms,'id');
        console.warn('CRISTO',row);
        this._dispatch.dispatch = row;
        //console.warn('row',row);
        this._router.navigate(['./editar'], { relativeTo: this._activated, queryParams: {id:row.id}});
    }

    view(row: any){
        const dialogRef = this._matDialog.open(ViewDispatchComponent,{
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
