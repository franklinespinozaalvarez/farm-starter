import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
      MatIconModule,MatDialogModule,MatTableModule,MatTableExporterModule,MatInputModule,NgFor,DatePipe,NgClass
  ],
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent implements OnInit{
    public selected : any;
    public selectedRow : any;
    public detail : any = [];

    public cols = [
        { field: 'product', header: 'Producto', width: 'min-w-32'},
        { field: 'description', header: 'Descripcion', width: 'min-w-40'},
        { field: 'unitMeasurement', header: 'Unidad', width: 'min-w-28'},
        { field: 'grossWeight', header: 'Peso Bruto', width: 'min-w-28'},
        { field: 'taraWeight', header: 'Peso Tara', width: 'min-w-28'},
        { field: 'netWeight', header: 'Peso Neto', width: 'min-w-28'},
        { field: 'quantity', header: 'Cantidad', width: 'min-w-28'},
        { field: 'unitPrice', header: 'Precio Unitario', width: 'min-w-36'},
        { field: 'totalPrice', header: 'Total Precio', width: 'min-w-32'},
    ];

    public displayedColumns = ['product','description','unitMeasurement','grossWeight','taraWeight','netWeight','quantity','unitPrice','totalPrice'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: any,
        private _change: ChangeDetectorRef,
        public matDialogRef: MatDialogRef<ViewComponent>,
    ) {}

    ngOnInit(): void {
        this.selected = this._data.selected;

        console.warn('ViewComponent',this.selected);
        this.detail = this._data.selected.detailList;
    }

    /**
     * Close dialog
     */
    close(): void
    {
        // Close the dialog
        this.matDialogRef.close();
    }

    selectRow(row){ console.warn('row',row);
        this.selectedRow = row;
    }

}
