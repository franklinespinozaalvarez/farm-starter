import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../order/order.service';
import { Subject } from 'rxjs';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-milling',
  standalone: true,
  imports: [
      FormsModule,ReactiveFormsModule,MatInputModule,MatButtonModule,MatIconModule,MatFormFieldModule,
      NgFor,NgIf,MatTooltipModule,DatePipe,RouterOutlet,MatSidenavModule,NgClass
  ],
  templateUrl: './milling.component.html'
})
export class MillingComponent implements OnInit{

    public orders: any = [];

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public searchInputControl: UntypedFormControl = new UntypedFormControl();

    public drawerMode: 'side' | 'over';
    @ViewChild('matDrawer', { static: true }) matDrawer: MatDrawer;
    public stage: any;
    public order: any;
    constructor(
        private _order: OrderService,
        private _router: Router,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this._order.get(0,10,'date','desc','MOLIENDA').subscribe((data)=>{
            this.orders = data.orders;
            console.warn('data.orders',data.orders);
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


    reload(){
        this._order.get(0,10,'date','desc','MOLIENDA').subscribe((data)=>{
            this.orders = data.orders;
            // Mark for check
            this._change.markForCheck();
        });
    }

    view(order){
        this.stage = order.stage;
        this.order = order;
        this._router.navigate(['./', order.id], { relativeTo: this._activated });
    }
}
