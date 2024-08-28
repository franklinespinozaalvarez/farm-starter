import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { UrpiFullscreenComponent } from '@urpi/components/fullscreen';
import { UrpiLoadingBarComponent } from '@urpi/components/loading-bar';
import {
    UrpiHorizontalNavigationComponent,
    UrpiNavigationService,
    UrpiVerticalNavigationComponent,
} from '@urpi/components/navigation';
import { UrpiMediaWatcherService } from '@urpi/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'material-layout',
    templateUrl: './material.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        UrpiLoadingBarComponent,
        UrpiVerticalNavigationComponent,
        MatButtonModule,
        MatIconModule,
        LanguagesComponent,
        UrpiFullscreenComponent,
        SearchComponent,
        ShortcutsComponent,
        MessagesComponent,
        NotificationsComponent,
        UserComponent,
        UrpiHorizontalNavigationComponent,
        RouterOutlet,
    ],
})
export class MaterialLayoutComponent implements OnInit, OnDestroy {
    isScreenSmall: boolean;
    navigation: Navigation;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _urpiMediaWatcherService: UrpiMediaWatcherService,
        private _urpiNavigationService: UrpiNavigationService
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to navigation data
        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) => {
                this.navigation = navigation;
            });

        // Subscribe to media changes
        this._urpiMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void {
        // Get the navigation
        const navigation =
            this._urpiNavigationService.getComponent<UrpiVerticalNavigationComponent>(
                name
            );

        if (navigation) {
            // Toggle the opened status
            navigation.toggle();
        }
    }
}
