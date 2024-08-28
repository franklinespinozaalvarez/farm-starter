import { BooleanInput } from '@angular/cdk/coercion';
import { NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    forwardRef,
    inject,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UrpiNavigationService } from '@urpi/components/navigation/navigation.service';
import { UrpiNavigationItem } from '@urpi/components/navigation/navigation.types';
import { UrpiVerticalNavigationBasicItemComponent } from '@urpi/components/navigation/vertical/components/basic/basic.component';
import { UrpiVerticalNavigationCollapsableItemComponent } from '@urpi/components/navigation/vertical/components/collapsable/collapsable.component';
import { UrpiVerticalNavigationDividerItemComponent } from '@urpi/components/navigation/vertical/components/divider/divider.component';
import { UrpiVerticalNavigationSpacerItemComponent } from '@urpi/components/navigation/vertical/components/spacer/spacer.component';
import { UrpiVerticalNavigationComponent } from '@urpi/components/navigation/vertical/vertical.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'urpi-vertical-navigation-group-item',
    templateUrl: './group.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        NgClass,
        MatIconModule,
        UrpiVerticalNavigationBasicItemComponent,
        UrpiVerticalNavigationCollapsableItemComponent,
        UrpiVerticalNavigationDividerItemComponent,
        forwardRef(() => UrpiVerticalNavigationGroupItemComponent),
        UrpiVerticalNavigationSpacerItemComponent,
    ],
})
export class UrpiVerticalNavigationGroupItemComponent
    implements OnInit, OnDestroy
{
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_autoCollapse: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    private _changeDetectorRef = inject(ChangeDetectorRef);
    private _urpiNavigationService = inject(UrpiNavigationService);

    @Input() autoCollapse: boolean;
    @Input() item: UrpiNavigationItem;
    @Input() name: string;

    private _urpiVerticalNavigationComponent: UrpiVerticalNavigationComponent;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the parent navigation component
        this._urpiVerticalNavigationComponent =
            this._urpiNavigationService.getComponent(this.name);

        // Subscribe to onRefreshed on the navigation component
        this._urpiVerticalNavigationComponent.onRefreshed
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                // Mark for check
                this._changeDetectorRef.markForCheck();
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
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
