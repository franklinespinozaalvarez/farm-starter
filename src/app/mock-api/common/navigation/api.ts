import { inject, Injectable } from '@angular/core';
import { UrpiNavigationItem } from '@urpi/components/navigation';
import { UrpiMockApiService } from '@urpi/lib/mock-api';
import {
    compactNavigation,
    defaultNavigation,
    futuristicNavigation,
    horizontalNavigation,
} from 'app/mock-api/common/navigation/data';
import { cloneDeep, map, remove } from 'lodash-es';
import { RolesService } from '../../../modules/admin/security/roles/roles.service';
import { UserService } from '../../../core/user/user.service';

@Injectable({ providedIn: 'root' })
export class NavigationMockApi {
    private readonly _compactNavigation: UrpiNavigationItem[] = compactNavigation;
    private readonly _defaultNavigation: UrpiNavigationItem[] = defaultNavigation;
    private readonly _futuristicNavigation: UrpiNavigationItem[] = futuristicNavigation;
    private readonly _horizontalNavigation: UrpiNavigationItem[] = horizontalNavigation;

    private account = JSON.parse(localStorage.getItem('account'));
    private menu:any;

    private navigationItem: UrpiNavigationItem[] = [];

    /**
     * Constructor
     */
    constructor(
        private _urpiMockApiService: UrpiMockApiService,
        private _roles: RolesService,
        private _user: UserService
    ) {

        /*this._user.user$.subscribe((data)=>{
            let menus: UrpiNavigationItem = {
                id: 'modulos',
                title: 'MODULOS',
                subtitle: 'Modulos Granja Avicola',
                type: 'group',
                icon: 'heroicons_outline:home',
                children: []
            };

            let parent = [];
            data.roleList.forEach(menu => {
                let header = {
                    id: menu.name,
                    title: menu.name,
                    type: 'collapsable',
                    icon: 'heroicons_outline:cog-8-tooth',
                    children: []
                };

                let children = [];
                menu.menuResponseList.forEach(item => {
                    delete item['roleList'];
                    item.id = item.code;
                    delete item['code'];
                    children.push(item);
                });
                header.children = children;
                parent.push(header)
            });

            menus.children = parent;

            this.navigationItem.push(menus);
            console.warn('this.navigationItem',this.navigationItem);
        });*/

        /*this._roles.getRoles().subscribe((data)=>{
            this.menu = data.roles.find(item => +item.id == +this.account.role.id).menuResponseList;

            console.warn('this.menu',this.menu)

        });*/
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
                //return currentObject.role !== role.role.code;
                return map(role.roleList,'name').includes(currentObject.role) ;
            });

            remove(_default[0].children, function(currentObject) {
                //return currentObject.role !== role.role.code;
                return map(role.roleList,'name').includes(currentObject.role) ;
            });

            remove(_futuristic[0].children, function(currentObject) {
                //return currentObject.role !== role.role.code;
                return map(role.roleList,'name').includes(currentObject.role) ;
            });

            remove(_horizontal[0].children, function(currentObject) {
                //return currentObject.role !== role.role.code;
                return map(role.roleList,'name').includes(currentObject.role) ;
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
