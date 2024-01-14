import { Component, ViewChild } from '@angular/core';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-aside',
  standalone: true,
  imports: [MatSidenavModule, MatButtonModule],
  templateUrl: './aside.component.html',
  styleUrl: './aside.component.scss'
})
export class AsideComponent {
  showFiller = false;

}
