import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UrpiConfirmationConfig } from '@urpi/services/confirmation/confirmation.types';
import { UrpiConfirmationDialogComponent } from '@urpi/services/confirmation/dialog/dialog.component';
import { merge } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class UrpiConfirmationService {
    private _matDialog: MatDialog = inject(MatDialog);
    private _defaultConfig: UrpiConfirmationConfig = {
        title: 'Confirm action',
        message: 'Are you sure you want to confirm this action?',
        icon: {
            show: true,
            name: 'heroicons_outline:exclamation-triangle',
            color: 'warn',
        },
        actions: {
            confirm: {
                show: true,
                label: 'Confirm',
                color: 'warn',
            },
            cancel: {
                show: true,
                label: 'Cancel',
            },
        },
        dismissible: false,
    };

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    open(
        config: UrpiConfirmationConfig = {}
    ): MatDialogRef<UrpiConfirmationDialogComponent> {
        // Merge the user config with the default config
        const userConfig = merge({}, this._defaultConfig, config);

        // Open the dialog
        return this._matDialog.open(UrpiConfirmationDialogComponent, {
            autoFocus: false,
            disableClose: !userConfig.dismissible,
            data: userConfig,
            panelClass: 'urpi-confirmation-dialog-panel',
        });
    }
}
