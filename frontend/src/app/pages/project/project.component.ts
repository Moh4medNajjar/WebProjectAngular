import { WebRequestService } from './../../web-request.service';
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
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsideComponent } from '../../layout/aside/aside.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag,FormsModule,AsideComponent, HeaderComponent, RouterOutlet, MatSidenavModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  providers: [ WebRequestService]
})
export class ProjectComponent {

  projectId: any;
  projectName: any;
  projectDescription: any;
  projectTasks: any;

  constructor(
    private route: ActivatedRoute,
    private webRequestService: WebRequestService
  ) {}



  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      console.log(this.projectId);

      this.webRequestService.getProjectById(this.projectId).subscribe(
        (project: any) => {
          this.projectName = project.title;
          this.projectDescription = project.description;
          this.projectTasks = project.tasks;
          console.log(this.projectTasks);


          for (let i = 0; i < this.projectTasks.length; i++) {
            console.log(this.projectTasks[i]);
            let taskId = this.projectTasks[i];
            this.webRequestService.getTaskById(taskId).subscribe(
              (task: any) => {
                console.log(task)
                this.taskName = task.title;
                this.taskDescription = task.description;
                this.taskPriority = task.priority;
                this.taskStatus = task.status;
                this.taskOwner = task.owner;

                console.log(this.taskStatus)

              if (this.taskStatus === "Todo")
                this.todo.push(task);

              else if (this.taskStatus === "In Progress")
                this.inProgress.push(this.projectTasks[i]);
              else if (this.taskStatus === "In Review")
                this.inReview.push(this.projectTasks[i]);
              else if (this.taskStatus === "Done")
                this.done.push(this.projectTasks[i]);

              },
              (error: any) => {
                console.log('Error fetching task details', error)
              },
              (() => {
                console.log(this.todo)
              })


            )


          }


        },
        (error: any) => {
          console.error('Error fetching project details', error);
        }
      );
    });
  }




  /*Task methods*/
  taskName: string = "";
  taskDescription: string = "";
  taskPriority: string = "";
  taskStatus: string = "";
  taskOwner: string = "";


  fetchTaskDetails(taskId: string): any {

  }




  todo : any[]=[]
  inProgress : any[]=[]
  inReview : any[]=[]
  done : any[]=[]







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
    // Check if priority is not undefined before accessing toLowerCase()
    if (priority) {
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
    } else {
      return '#CCCCCC';
    }
  }

  getPriorityTextColor(priority: string): string {
    // Check if priority is not undefined before accessing toLowerCase()
    if (priority) {
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
    } else {
      return '#CCCCCC';
    }
  }



}
