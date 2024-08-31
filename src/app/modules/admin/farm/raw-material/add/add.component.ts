import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import moment from "moment";
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ThemePalette } from '@angular/material/core';
import { NgxMatMomentModule } from '@angular-material-components/moment-adapter';
import { ProductService } from '../../product/product.service';
import { ProviderService } from '../../provider/provider.service';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-add',
  standalone: true,
  imports: [
      ReactiveFormsModule,FormsModule,MatFormFieldModule,MatInputModule,MatButtonModule,MatTooltipModule,MatIconModule,
      NgxMatTimepickerModule,NgxMatDatetimePickerModule,MatDatepickerModule,NgxMatMomentModule,MatSelectModule,RouterModule
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss'
})
export class AddComponent implements OnInit{

    public materialForm: UntypedFormGroup;

    /************** DATE TIME PICKER ******************/
    public date: moment.Moment;
    public disabled = false;
    public showSpinners = true;
    public showSeconds = true;
    public touchUi = false;
    public enableMeridian = false;
    public minDate: moment.Moment;
    public maxDate: moment.Moment;
    public stepHour = 1;
    public stepMinute = 1;
    public stepSecond = 1;
    public color: ThemePalette = 'primary';
    public defaultTime = [0,0,0];
    /************** DATE TIME PICKER ******************/

    params = {
        fecha_salida:'',
        fecha_recepcion:'',
    };
    public products: any=[];
    public providers: any=[];
    constructor(
        private _form: FormBuilder,
        private _product: ProductService,
        private _provider: ProviderService
    ) {}

    ngOnInit(): void {

        this.materialForm = this._form.group(
            {
                proveedor:['', [Validators.required]],
                producto:['', [Validators.required]],
                descripcion:[''],
                fecha_salida:['', [Validators.required]],
                peso_quintales:['', [Validators.required]],
                fecha_recepcion:['', [Validators.required]],
                peso_neto:['', [Validators.required]],
                origen:[''],
                destino:[''],
                chofer:[''],
                documento:[''],
                placa:[''],
                marca:[''],
                precio_unidad:[''],
                total:[''],
            }
        );

        this._product.getProduct().subscribe((data)=>{
            this.products = data.products;
        });

        this._provider.getProvider().subscribe((data)=>{
            this.providers = data.providers;
        });
    }

    save(){

    }

    displayProduct(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }


    displayProvider(attribute1,attribute2) {
        if (attribute1 == attribute2) {
            return attribute1;
        } else {
            return "";
        }
    }
}
