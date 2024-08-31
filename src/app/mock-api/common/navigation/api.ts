import { inject, Injectable } from '@angular/core';
import { UrpiNavigationItem } from '@urpi/components/navigation';
import { UrpiMockApiService } from '@urpi/lib/mock-api';
import {
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { cloneDeep,remove } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: UrpiNavigationItem[] =
        compactNavigation;
    private readonly _defaultNavigation: UrpiNavigationItem[] =
        defaultNavigation;
    private readonly _futuristicNavigation: UrpiNavigationItem[] =
        futuristicNavigation;
    private readonly _horizontalNavigation: UrpiNavigationItem[] =
        horizontalNavigation;

    /**
     * Constructor
     */
    constructor(private _urpiMockApiService: UrpiMockApiService) {
        // Register Mock API handlers
        this.registerHandlers();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register Mock API handlers
     */
    registerHandlers(): void {
        // -----------------------------------------------------------------------------------------------------
        // @ Navigation - GET
        // -----------------------------------------------------------------------------------------------------
        this._urpiMockApiService.onGet('api/common/navigation').reply(() => {

            // Fill compact navigation children using the default navigation
            this._compactNavigation.forEach((compactNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === compactNavItem.id) {
                        compactNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            // Fill futuristic navigation children using the default navigation
            this._futuristicNavigation.forEach((futuristicNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === futuristicNavItem.id) {
                        futuristicNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            // Fill horizontal navigation children using the default navigation
            this._horizontalNavigation.forEach((horizontalNavItem) => {
                this._defaultNavigation.forEach((defaultNavItem) => {
                    if (defaultNavItem.id === horizontalNavItem.id) {
                        horizontalNavItem.children = cloneDeep(defaultNavItem.children);
                    }
                });
            });

            let _compact = cloneDeep(this._compactNavigation);
            let _default = cloneDeep(this._defaultNavigation);
            let _futuristic = cloneDeep(this._futuristicNavigation);
            let _horizontal = cloneDeep(this._horizontalNavigation);

            let role = JSON.parse(localStorage.getItem('account'))??{};

            remove(_compact[0].children, function(currentObject) {
                return currentObject.role !== role.role.code;
            });

            remove(_default[0].children, function(currentObject) {
                return currentObject.role !== role.role.code;
            });

            remove(_futuristic[0].children, function(currentObject) {
                return currentObject.role !== role.role.code;
            });

            remove(_horizontal[0].children, function(currentObject) {
                return currentObject.role !== role.role.code;
            });

            // Return the response
            return [
                200,
                {
                    compact: _compact,
                    default: _default,
                    futuristic: _futuristic,
                    horizontal: _horizontal,
                },
            ];
        });
    }
}
