import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
    APP_INITIALIZER,
    ENVIRONMENT_INITIALIZER,
    EnvironmentProviders,
    Provider,
    importProvidersFrom,
    inject,
} from '@angular/core';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import {
    URPI_MOCK_API_DEFAULT_DELAY,
    mockApiInterceptor,
} from '@urpi/lib/mock-api';
import { UrpiConfig } from '@urpi/services/config';
import { URPI_CONFIG } from '@urpi/services/config/config.constants';
import { UrpiConfirmationService } from '@urpi/services/confirmation';
import {
    UrpiLoadingService,
    urpiLoadingInterceptor,
} from '@urpi/services/loading';
import { UrpiMediaWatcherService } from '@urpi/services/media-watcher';
import { UrpiPlatformService } from '@urpi/services/platform';
import { UrpiSplashScreenService } from '@urpi/services/splash-screen';
import { UrpiUtilsService } from '@urpi/services/utils';

export type UrpiProviderConfig = {
    mockApi?: {
        delay?: number;
        services?: any[];
    };
    urpi?: UrpiConfig;
};

/**
 * Urpi provider
 */
export const provideUrpi = (
    config: UrpiProviderConfig
): Array<Provider | EnvironmentProviders> => {
    // Base providers
    const providers: Array<Provider | EnvironmentProviders> = [
        {
            // Disable 'theme' sanity check
            provide: MATERIAL_SANITY_CHECKS,
            useValue: {
                doctype: true,
                theme: false,
                version: true,
            },
        },
        {
            // Use the 'fill' appearance on Angular Material form fields by default
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: {
                appearance: 'fill',
            },
        },
        {
            provide: URPI_MOCK_API_DEFAULT_DELAY,
            useValue: config?.mockApi?.delay ?? 0,
        },
        {
            provide: URPI_CONFIG,
            useValue: config?.urpi ?? {},
        },

        importProvidersFrom(MatDialogModule),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(UrpiConfirmationService),
            multi: true,
        },

        provideHttpClient(withInterceptors([urpiLoadingInterceptor])),
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(UrpiLoadingService),
            multi: true,
        },

        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(UrpiMediaWatcherService),
            multi: true,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(UrpiPlatformService),
            multi: true,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(UrpiSplashScreenService),
            multi: true,
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useValue: () => inject(UrpiUtilsService),
            multi: true,
        },
    ];

    // Mock Api services
    if (config?.mockApi?.services) {
        providers.push(
            provideHttpClient(withInterceptors([mockApiInterceptor])),
            {
                provide: APP_INITIALIZER,
                deps: [...config.mockApi.services],
                useFactory: () => (): any => null,
                multi: true,
            }
        );
    }

    // Return the providers
    return providers;
};
