import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { FarmComponent } from './farm.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { InputsComponent } from './inputs/inputs.component';
import { AddComponent } from './raw-material/add/add.component';
import { EditComponent } from './raw-material/edit/edit.component';
import { ProviderComponent } from './provider/provider.component';
import { ProductComponent } from './product/product.component';
import { DetailsComponent } from './provider/details/details.component';
import { inject } from '@angular/core';
import { ProviderService } from './provider/provider.service';
import { ProductDetailsComponent } from './product/product-details/product-details.component';


/**
 * Can deactivate providers details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateProviderDetails = (
    component: DetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/proveedor')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

/**
 * Can deactivate products details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateProductDetails = (
    component: DetailsComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
) => {
    // Get the next route
    let nextRoute: ActivatedRouteSnapshot = nextState.root;
    while (nextRoute.firstChild) {
        nextRoute = nextRoute.firstChild;
    }

    // If the next state doesn't contain '/contacts'
    // it means we are navigating away from the
    // contacts app
    if (!nextState.url.includes('/producto')) {
        // Let it navigate
        return true;
    }

    // If we are navigating to another contact...
    if (nextRoute.paramMap.get('id')) {
        // Just navigate
        return true;
    }

    // Otherwise, close the drawer first, and then navigate
    return component.closeDrawer().then(() => true);
};

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
            },
            {
                path: 'proveedor',
                component: ProviderComponent,
                children:[
                    {
                        path:':id',
                        component: DetailsComponent,
                        canDeactivate: [canDeactivateProviderDetails]
                    }
                ]
            },
            {
                path: 'producto',
                component: ProductComponent,
                children:[
                    {
                        path:':id',
                        component: ProductDetailsComponent,
                        canDeactivate: [canDeactivateProductDetails]
                    }
                ]
            }
        ]
    }
] as Routes;
