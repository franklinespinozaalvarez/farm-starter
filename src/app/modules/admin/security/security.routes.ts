import { Routes } from '@angular/router';
import { SecurityComponent } from './security.component';
import { UsersComponent } from './users/users.component';
import { RolesComponent } from './roles/roles.component';
import { inject } from '@angular/core';
import { UsersService } from './users/users.service';
import { RolesService } from './roles/roles.service';
import { MenusComponent } from './menus/menus.component';

export default [
    {
        path: '',
        component: SecurityComponent,
        children: [
            {
                path: 'usuarios',
                component: UsersComponent,
                /*resolve:{
                    users: () => inject(UsersService).getUsers()
                }*/
            },
            {
                path: 'roles',
                component: RolesComponent,
                /*resolve:{
                    roles: () => inject(RolesService).getRoles()
                }*/
            },
            {
                path: 'menus',
                component: MenusComponent,
            }
        ]

    }
] as Routes;
