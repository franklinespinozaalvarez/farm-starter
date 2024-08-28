import { Injectable } from '@angular/core';
import { UrpiDrawerComponent } from '@urpi/components/drawer/drawer.component';

@Injectable({ providedIn: 'root' })
export class UrpiDrawerService {
    private _componentRegistry: Map<string, UrpiDrawerComponent> = new Map<
        string,
        UrpiDrawerComponent
    >();

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register drawer component
     *
     * @param name
     * @param component
     */
    registerComponent(name: string, component: UrpiDrawerComponent): void {
        this._componentRegistry.set(name, component);
    }

    /**
     * Deregister drawer component
     *
     * @param name
     */
    deregisterComponent(name: string): void {
        this._componentRegistry.delete(name);
    }

    /**
     * Get drawer component from the registry
     *
     * @param name
     */
    getComponent(name: string): UrpiDrawerComponent | undefined {
        return this._componentRegistry.get(name);
    }
}
