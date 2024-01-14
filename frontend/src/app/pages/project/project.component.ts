import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from '../../layout/aside/aside.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag,FormsModule,AsideComponent, HeaderComponent, RouterOutlet, MatSidenavModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  searchedEmail: string = ""
  collaborators = [
  { username: 'MohamedNajjar', email: 'najjarmohamed443@gmail.com', image: '../../../assets/images/image.png' },
  { username: 'MohamedNajjar', email: 'najjarmohamed443@gmail.com', image: '../../../assets/images/image.png' },
  { username: 'MohamedNajjar', email: 'najjarmohamed443@gmail.com', image: '../../../assets/images/image.png' },
  { username: 'MohamedNajjar', email: 'najjarmohamed443@gmail.com', image: '../../../assets/images/image.png' },

];
todo = [
  { title: 'Get to work', priority: 'medium' },
  { title: 'Pick up groceries', priority: 'low' },
  { title: 'Go home', priority: 'high' },
  { title: 'Fall asleep', priority: 'low' },
];

inProgress = [
  { title: 'Get up', priority: 'medium' },
  { title: 'Brush teeth', priority: 'low' },
  { title: 'Take a shower', priority: 'high' },
  { title: 'Check e-mail', priority: 'medium' },
  { title: 'Walk dog', priority: 'high' },
];
inReview = [
  { title: 'Get up', priority: 'medium' },
  { title: 'Brush teeth', priority: 'low' },
  { title: 'Take a shower', priority: 'high' },
  { title: 'Check e-mail', priority: 'medium' },
  { title: 'Walk dog', priority: 'high' },
];

done = [
  { title: 'Get up', priority: 'low' },
  { title: 'Brush teeth', priority: 'medium' },
  { title: 'Take a shower', priority: 'high' },
  { title: 'Check e-mail', priority: 'medium' },
  { title: 'Walk dog', priority: 'low' },
];


  drop(event: CdkDragDrop<{ title: string; priority: string; }[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }


  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#f92d7454';
      case 'medium':
        return '#7637f545';
      case 'low':
        return 'rgba(249, 188, 35, 0.311)';
      default:
        return '#CCCCCC';
    }
  }
  getPriorityTextColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#F92D73';
      case 'medium':
        return '#7637F5';
      case 'low':
        return 'goldenrod';
      default:
        return '#CCCCCC';
    }
  }


}
