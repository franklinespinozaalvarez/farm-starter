import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup, Validators,
} from '@angular/forms';
import { MatDrawer, MatDrawerToggleResult, MatSidenavModule } from '@angular/material/sidenav';
import { TablePagination } from '../../../security/security.types';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterModule, RouterOutlet } from '@angular/router';
import { FarmService } from '../../settings/farm/farm.service';
import { UrpiConfirmationService } from '../../../../../../@urpi/services/confirmation/confirmation.service';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { DatePipe, NgClass, NgFor, NgIf, UpperCasePipe } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatInputModule } from '@angular/material/input';
import { OverlayRef } from '@angular/cdk/overlay';
import { OrderComponent } from '../../order/order.component';
import { OrderService } from '../../order/order.service';
import { StageService } from '../../settings/stage/stage.service';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { OrdersComponent } from '../orders.component';

@Component({
  selector: 'app-orders-details',
  standalone: true,
  imports: [
      NgIf,NgFor,MatButtonModule,MatTooltipModule,RouterModule,MatSelectModule,MatIconModule,
      FormsModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,UpperCasePipe,MatDividerModule,
      MatDatepickerModule,DatePipe
  ],
  templateUrl: './orders-details.component.html',
  styleUrl: './orders-details.component.scss'
})
export class OrdersDetailsComponent implements OnInit{

    public orderForm: UntypedFormGroup;
    public editMode: boolean = true;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    private _tagsPanelOverlayRef: OverlayRef;
    public selected:any;
    public cities = ['Pando','Beni','La Paz','Cochabamba','Santa Cruz','Potosi','Oruro','Tarija','Sucre'];

    public farms: any;
    public stages: any;
    constructor(
        private order: OrdersComponent,
        private _activated: ActivatedRoute,
        private _change: ChangeDetectorRef,
        private _form: UntypedFormBuilder,
        private _order: OrderService,
        private _confirmation: UrpiConfirmationService,
        private _router: Router,
        private _stage: StageService,
        private _farm: FarmService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Open the drawer
        this.order.matDrawer.open();

        this.selected = this.order.selected;

        if( ['new','edit'].includes(this.order.action) )
            this.toggleEditMode(true);
        else
            this.toggleEditMode(false);

        if( ['edit'].includes(this.order.action) ) {
            this.selected.farmId = this.order.selected.farm.id;
            this.selected.stageId = this.order.selected.stage.id;
            this.selected.date = new Date(this.order.selected.date);
        }

        this._stage.getStages().subscribe((data)=>{
            this.stages = data.stages;
        });

        this._farm.get().subscribe((data)=>{
            this.farms = data.farms;
        });

        // Create the farm form
        this.orderForm = this._form.group({
            id: [''],
            farmId: ['',[Validators.required]],
            stageId: ['',[Validators.required]],
            date: ['',[Validators.required]],
            quantity: ['',[Validators.required]],
        });

        this.orderForm.patchValue(this.order.selected);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();

        // Dispose the overlays if they are still on the DOM
        if (this._tagsPanelOverlayRef) {
            this._tagsPanelOverlayRef.dispose();
        }
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Close the drawer
     */
    closeDrawer(): Promise<MatDrawerToggleResult> {
        return this.order.matDrawer.close();
    }

    /**
     * Toggle edit mode
     *
     * @param editMode
     */
    toggleEditMode(editMode: boolean | null = null): void {
        if (editMode === null) {
            this.editMode = !this.editMode;
        } else {
            this.editMode = editMode;
        }

        // Mark for check
        this._change.markForCheck();
    }


    save(): void{
        if( this.order.action === 'new'){
            const order = this.orderForm.getRawValue();
            Object.keys(order).forEach(key => {
                /*if(key == 'farm')
                    order[key] = {id: order[key]};

                if(key == 'stage')
                    order[key] = {id: order[key]};*/

                if( key == 'id' && this.order.action === 'new' )
                    delete order[key];
            });

            this._order.post(order).subscribe((resp: any) => {
                Swal.fire({
                    title: "Registro guardado exitosamente !!!",
                    icon: "success"
                });
                this.order.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });
        }else{

            const order = this.orderForm.getRawValue();
            this._order.update(order.id, order).subscribe((resp: any) => {
                Swal.fire({
                    title: "Registro actualizado exitosamente !!!",
                    icon: "success"
                });
                this.order.reload();
                this.closeDrawer();
                this._router.navigate(['../'], { relativeTo: this._activated });
            });

        }
    }

    displayFarm(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }

    displayStage(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }
}
