import { Component } from '@angular/core';
import { StageComponent } from './stage/stage.component';
import { FarmComponent } from './farm/farm.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgClass, NgIf } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
      NgClass,NgIf,
      StageComponent, FarmComponent,MatSidenavModule,MatRippleModule,MatIconModule,
  ],
  templateUrl: './settings.component.html'
})
export class SettingsComponent {

    public inbox: string = '';
    public drawerMode: 'over' | 'side' = 'side';
    public drawerOpened: boolean = true;
    constructor() {}

    //-------------------------------------------------------------------------
    // public methods
    //-------------------------------------------------------------------------
    /**
     * Filter by inbox
     */
    filterByInbox(type: string): void
    {
        this.inbox = type;
    }
}
