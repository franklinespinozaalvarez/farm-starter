import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Navigation } from 'app/core/navigation/navigation.types';
import { Observable, ReplaySubject, tap,of } from 'rxjs';
import { UserService } from '../user/user.service';
import { UrpiNavigationItem } from '../../../@urpi/components/navigation/navigation.types';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private _httpClient = inject(HttpClient);
    private _user = inject(UserService);
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private code: any;
    public navigationMenu: Navigation;
    private navigationItem: UrpiNavigationItem[] = [];
    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation> {
        return this._navigation.asObservable();
    }

    set navigation(value) {
        this._navigation.next(value);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation> {

        /*inject(UserService).user$.subscribe( (data:any) => {
            this.code = data.role.code;
            console.warn('GET MENU',this.code);
        });*/

        if ( !localStorage.getItem('user') ) { console.warn('IF',localStorage.getItem('user'));

            this._user.user$.subscribe((data) => { console.warn('USER',data);
                this.navigationItem = [];
                if (data?.roleList && this.navigationItem.length === 0) {
                    let menus: UrpiNavigationItem = {
                        id: 'modulos',
                        title: 'MODULOS',
                        subtitle: 'Modulos Granja Avicola',
                        type: 'group',
                        icon: 'heroicons_outline:home',
                        children: []
                    };

                    let parent = [];
                    data?.roleList?.forEach(menu => {
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
                    this.navigationMenu = {
                        compact: this.navigationItem,
                        default: this.navigationItem,
                        futuristic: this.navigationItem,
                        horizontal: this.navigationItem,
                    };
                    this._navigation.next(this.navigationMenu);
                }
            });
        }else{ console.warn('ELSE',localStorage.getItem('user'));

            const data = JSON.parse(localStorage.getItem('user'));

            if ( this.navigationItem.length === 0 ) {
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
                this.navigationMenu = {
                    compact: this.navigationItem,
                    default: this.navigationItem,
                    futuristic: this.navigationItem,
                    horizontal: this.navigationItem,
                };
                this._navigation.next(this.navigationMenu);
            }

        }
        return of (this.navigationMenu)
        /*return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                this._navigation.next(this.navigation);
            })
        );*/
    }
}
