import { Component } from '@angular/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import { WebRequestService } from '../../web-request.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatBadgeModule, MatIconModule, HttpClientModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers:[WebRequestService]
})
export class HeaderComponent {
  constructor(public WebRequestService: WebRequestService){}
}
