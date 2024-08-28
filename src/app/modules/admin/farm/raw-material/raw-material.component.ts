import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-raw-material',
  standalone: true,
  imports: [
      NgFor,NgIf,DatePipe,
      FormsModule,ReactiveFormsModule,MatFormFieldModule, MatIconModule,MatTableModule,
      MatTooltipModule,MatButtonModule,MatInputModule,MatTableExporterModule
  ],
  templateUrl: './raw-material.component.html',
  styleUrl: './raw-material.component.scss'
})
export class RawMaterialComponent {

    public searchInputControl: UntypedFormControl = new UntypedFormControl();
    public selectedRawMaterial: any;

    public cols = [
        { field: 'proveedor', header: 'Proveedor', width: 'min-w-72'},
        { field: 'producto', header: 'Producto', width: 'min-w-72'},
        { field: 'fecha_salida', header: 'Fecha Salida', width: 'min-w-40'},
        { field: 'peso_salida', header: 'Peso Salida', width: 'min-w-40'},
        { field: 'fecha_recepcion', header: 'Fecha Recepción', width: 'min-w-40'},
        { field: 'peso_neto', header: 'Peso Neto', width: 'min-w-40'},
        { field: 'origen', header: 'Origen', width: 'min-w-40'},
        { field: 'destino', header: 'Destino', width: 'min-w-40'},
        { field: 'chofer', header: 'Chofer', width: 'min-w-40'},
        { field: 'documento', header: 'Nro. documento', width: 'min-w-32'},
        { field: 'placa', header: 'Placa', width: 'min-w-32'},
        { field: 'marca', header: 'Marca', width: 'min-w-32'},
    ];
    public displayedColumns = [
        'accion','proveedor','producto','fecha_salida','peso_salida','fecha_recepcion','peso_neto','origen',
        'destino','chofer','documento','placa','marca'];
    public dataSource = [
        {
            proveedor: 'Industrias de Aceite S.A.',
            producto: 'Harina Integral',
            fecha_salida: '2024-06-01 11:42:11',
            peso_salida: 45290,
            fecha_recepcion: '2024-06-04 08:00:15',
            peso_neto: 29000,
            origen: 'Warnes',
            destino: 'Cochabamba',
            chofer: 'Nelson Arnez',
            documento: '5230534',
            placa: '2668-TYT',
            marca: 'VOLVO',
        },
        {
            proveedor: 'Industrias de Aceite S.A.',
            producto: 'Harina Integral',
            fecha_salida: '2024-06-01 11:42:11',
            peso_salida: 45290,
            fecha_recepcion: '2024-06-04 08:00:15',
            peso_neto: 29000,
            origen: 'Warnes',
            destino: 'Cochabamba',
            chofer: 'Nelson Arnez',
            documento: '5230534',
            placa: '2668-TYT',
            marca: 'VOLVO',
        },
        {
            proveedor: 'Industrias de Aceite S.A.',
            producto: 'Harina Integral',
            fecha_salida: '2024-06-01 11:42:11',
            peso_salida: 45290,
            fecha_recepcion: '2024-06-04 08:00:15',
            peso_neto: 29000,
            origen: 'Warnes',
            destino: 'Cochabamba',
            chofer: 'Nelson Arnez',
            documento: '5230534',
            placa: '2668-TYT',
            marca: 'VOLVO',
        }
    ];
    constructor(
        private _router: Router,
        private _activated: ActivatedRoute
    ) {
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
    }

    redirect(){
        this._router.navigate(['./nuevo'], { relativeTo: this._activated });
    }

    reload(){

    }

    deleteRow(){

    }
}
