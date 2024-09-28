import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { MatInputModule } from '@angular/material/input';
import { DatePipe, NgClass, NgFor } from '@angular/common';

@Component({
  selector: 'app-view-dispatch',
  standalone: true,
  imports: [
      MatIconModule,MatDialogModule,MatTableModule,MatTableExporterModule,MatInputModule,NgFor,DatePipe,NgClass
  ],
  templateUrl: './view-dispatch.component.html',
  styleUrl: './view-dispatch.component.scss'
})
export class ViewDispatchComponent {
    public selected : any;
    public selectedRow : any;
    public detail : any = [];

    public cols = [
        { field: 'quantity', header: 'Cantidad', width: 'min-w-28'},
        { field: 'unitMeasurement', header: 'Unidad', width: 'min-w-28'},
        { field: 'stage', header: 'Fase Alimento', width: 'min-w-32'},
        { field: 'unitPrice', header: 'Precio Unitario', width: 'min-w-36'},
        { field: 'subTotal', header: 'Total Precio', width: 'min-w-32'},
    ];

    public displayedColumns = ['quantity','unitMeasurement','stage','unitPrice','subTotal'];

    constructor(
        @Inject(MAT_DIALOG_DATA) public _data: any,
        private _change: ChangeDetectorRef,
        public matDialogRef: MatDialogRef<ViewDispatchComponent>,
    ) {}

    ngOnInit(): void {
        this.selected = this._data.selected;

        console.warn('ViewComponent',this.selected);
        this.detail = this.selected.detailDispatchList;
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
