import { Routes } from '@angular/router';
import { FarmComponent } from './farm.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { InputsComponent } from './inputs/inputs.component';
import { AddComponent } from './raw-material/add/add.component';
import { EditComponent } from './raw-material/edit/edit.component';

export default [
    {
        path: '',
        component: FarmComponent,
        children: [
            {
                path: 'materia-prima',
                component: RawMaterialComponent
            },
            {
                path: 'materia-prima/nuevo',
                component: AddComponent
            },
            {
                path: 'materia-prima/editar',
                component: EditComponent
            },
            {
                path: 'insumos',
                component: InputsComponent
            }
        ]
    }
] as Routes;
