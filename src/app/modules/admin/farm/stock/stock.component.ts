import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TablePagination } from '../../security/security.types';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ProductService } from '../product/product.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stock',
  standalone: true,
  imports: [MatTableModule,MatTableExporterModule,MatPaginatorModule,NgClass,MatInputModule,MatFormFieldModule,NgFor,NgIf,DatePipe,MatIconModule],
  templateUrl: './stock.component.html',
  styleUrl: './stock.component.scss'
})
export class StockComponent implements OnInit{

    public cols = [
        { field: 'name', header: 'Producto', width: 'min-w-36'},
        { field: 'unit', header: 'Unidad Medida', width: 'min-w-36'},

        { field: 'input', header: 'Entradas', width: 'min-w-28'},
        { field: 'output', header: 'Salidas', width: 'min-w-28'},
        { field: 'balance', header: 'Stock', width: 'min-w-28'}
    ];

    public displayedColumns = ['name','unit','input','output','balance','status'];

    @ViewChild(MatPaginator) private _paginator: MatPaginator;
    @ViewChild(MatSort) private _sort: MatSort;

    public stocks: any = [];
    public pagination: TablePagination;

    public isLoading: boolean = false;
    public selected: any;
    constructor(
        private _product: ProductService,
        private _change: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this._product.getProduct().subscribe((data:any)=>{
            console.warn('data',data);
            this.stocks = data.products;

            // Update the pagination
            this.pagination = data.pagination;
            // Mark for check
            this._change.markForCheck();
        });
    }
}
