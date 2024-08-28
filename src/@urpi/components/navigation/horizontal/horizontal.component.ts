import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    SimpleChanges,
    ViewEncapsulation,
    inject,
} from '@angular/core';
import { urpiAnimations } from '@urpi/animations';
import { UrpiNavigationService } from '@urpi/components/navigation/navigation.service';
import { UrpiNavigationItem } from '@urpi/components/navigation/navigation.types';
import { UrpiUtilsService } from '@urpi/services/utils/utils.service';
import { ReplaySubject, Subject } from 'rxjs';
import { UrpiHorizontalNavigationBasicItemComponent } from './components/basic/basic.component';
import { UrpiHorizontalNavigationBranchItemComponent } from './components/branch/branch.component';
import { UrpiHorizontalNavigationSpacerItemComponent } from './components/spacer/spacer.component';

@Component({
    selector: 'urpi-horizontal-navigation',
    templateUrl: './horizontal.component.html',
    styleUrls: ['./horizontal.component.scss'],
    animations: urpiAnimations,
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'urpiHorizontalNavigation',
    standalone: true,
    imports: [
        UrpiHorizontalNavigationBasicItemComponent,
        UrpiHorizontalNavigationBranchItemComponent,
        UrpiHorizontalNavigationSpacerItemComponent,
    ],
})
export class UrpiHorizontalNavigationComponent
    implements OnChanges, OnInit, OnDestroy
{
    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _urpiNavigationService = inject(UrpiNavigationService);
    private _urpiUtilsService = inject(UrpiUtilsService);

    @Input() name: string = this._urpiUtilsService.randomId();
    @Input() navigation: UrpiNavigationItem[];

    onRefreshed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On changes
     *
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        // Navigation
        if ('navigation' in changes) {
            // Mark for check
            this._changeDetectorRef.markForCheck();
        }
    }

    /**
     * On init
     */
    ngOnInit(): void {
        // Make sure the name input is not an empty string
        if (this.name === '') {
            this.name = this._urpiUtilsService.randomId();
        }

        // Register the navigation component
        this._urpiNavigationService.registerComponent(this.name, this);
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Deregister the navigation component from the registry
        this._urpiNavigationService.deregisterComponent(this.name);

        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Refresh the component to apply the changes
     */
    refresh(): void {
        // Mark for check
        this._changeDetectorRef.markForCheck();

        // Execute the observable
        this.onRefreshed.next(true);
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
