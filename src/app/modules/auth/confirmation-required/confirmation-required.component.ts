import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { urpiAnimations } from '@urpi/animations';

@Component({
    selector: 'auth-confirmation-required',
    templateUrl: './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: urpiAnimations,
    standalone: true,
    imports: [RouterLink],
})
export class AuthConfirmationRequiredComponent {
    /**
     * Constructor
     */
    constructor() {}
}
