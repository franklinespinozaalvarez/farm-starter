import { ActivatedRouteSnapshot, RouterStateSnapshot, Routes } from '@angular/router';
import { FarmComponent } from './farm.component';
import { RawMaterialComponent } from './raw-material/raw-material.component';
import { InputsComponent } from './inputs/inputs.component';
import { AddComponent } from './raw-material/add/add.component';
import { EditComponent } from './raw-material/edit/edit.component';
import { ProviderComponent } from './provider/provider.component';
import { ProductComponent } from './product/product.component';
import { DetailsComponent } from './provider/details/details.component';
import { ProductDetailsComponent } from './product/product-details/product-details.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProductTypeDetailsComponent } from './product-type/product-type-details/product-type-details.component';

import { StageDetailsComponent } from './settings/stage/stage-details/stage-details.component';
import { StageComponent } from './settings/stage/stage.component';
import { FarmComponent as FarmsComponent } from './settings/farm/farm.component';
import { FarmDetailsComponent } from './settings/farm/farm-details/farm-details.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderComponent } from './order/order.component';
import { OrderDetailsComponent } from './order/order-details/order-details.component';
import { OrdersDetailsComponent } from './orders/orders-details/orders-details.component';
import { FormulaComponent } from './formula/formula.component';
import { DispatchComponent } from './dispatch/dispatch.component';
import { NewDispatchComponent } from './dispatch/new-dispatch/new-dispatch.component';
import { EditDispatchComponent } from './dispatch/edit-dispatch/edit-dispatch.component';
import { MillingComponent } from './milling/milling.component';
import { MillingDetailsComponent } from './milling/milling-details/milling-details.component';
import { ReportsComponent } from './reports/reports.component';
import { StockComponent } from './stock/stock.component';


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

/**
 * Can deactivate product type details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateProductTypeDetails = (
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
    if (!nextState.url.includes('/tipo-producto')) {
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
 * Can deactivate stage type details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateStageDetails = (
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
    if (!nextState.url.includes('/etapa')) {
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
 * Can deactivate farm type details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateFarmDetails = (
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
    if (!nextState.url.includes('/granja')) {
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
 * Can deactivate order type details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateOrderDetails = (
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
    if (!nextState.url.includes('/pedidos')) {
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
 * Can deactivate order type details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateOrdersDetails = (
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
    if (!nextState.url.includes('/ordenes')) {
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
 * Can deactivate milling details
 *
 * @param component
 * @param currentRoute
 * @param currentState
 * @param nextState
 */
const canDeactivateMillingDetails = (
    component: MillingDetailsComponent,
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
    if (!nextState.url.includes('/molienda')) {
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
            },
            {
                path: 'tipo-producto',
                component: ProductTypeComponent,
                children:[
                    {
                        path:':id',
                        component: ProductTypeDetailsComponent,
                        canDeactivate: [canDeactivateProductTypeDetails]
                    }
                ]
            },

            {
                path: 'etapa',
                component: StageComponent,
                children:[
                    {
                        path: ':id',
                        component: StageDetailsComponent,
                        canDeactivate: [canDeactivateStageDetails]
                    }
                ]
            },
            {
                path: 'granja',
                component: FarmsComponent,
                children:[
                    {
                        path: ':id',
                        component: FarmDetailsComponent,
                        canDeactivate: [canDeactivateFarmDetails]
                    }
                ]
            },
            {
                path: 'ordenes',
                component: OrdersComponent,
                children:[
                    {
                        path: ':id',
                        component: OrdersDetailsComponent,
                        canDeactivate: [canDeactivateOrdersDetails]
                    }
                ]
            },
            {
                path: 'formulas',
                component: FormulaComponent,
                /*children:[
                    {
                        path: ':id',
                        component: OrdersDetailsComponent,
                        canDeactivate: [canDeactivateOrdersDetails]
                    }
                ]*/
            },
            {
                path: 'despachos',
                component: DispatchComponent,
            },
            {
                path: 'despachos/nuevo',
                component: NewDispatchComponent
            },
            {
                path: 'despachos/editar',
                component: EditDispatchComponent
            },
            {
                path: 'molienda',
                component: MillingComponent,
                children:[
                    {
                        path: ':id',
                        component: MillingDetailsComponent,
                        canDeactivate: [canDeactivateMillingDetails]
                    }
                ]
            },
            {
                path: 'reportes',
                component: ReportsComponent
            },
            {
                path: 'inventario',
                component: StockComponent
            },
            /*,
            {
                path: 'pedidos',
                component: OrderComponent,
                children:[
                    {
                        path: ':id',
                        component: OrderDetailsComponent,
                        canDeactivate: [canDeactivateOrderDetails]
                    }
                ]
            }*/
            /*{
                path: 'setting',
                component: SettingsComponent,
                children:[
                    {
                        path: 'etapa',
                        component: StageComponent,
                        children:[
                            {
                                path: ':id',
                                component: StageDetailsComponent
                            }
                        ]
                    },
                    {
                        path: 'granja',
                        component: FarmComponent,
                        children:[
                            {
                                path: ':id',
                                component: FarmDetailsComponent
                            }
                        ]
                    }
                ]
            },*/

        ]
    }
] as Routes;
