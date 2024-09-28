import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
/*import { initFlowbite } from 'flowbite';*/

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
    /**
     * Constructor
     */
    constructor() {}

    ngOnInit(): void {
        /*initFlowbite();*/
    }
}
