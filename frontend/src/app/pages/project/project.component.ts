import { WebRequestService } from './../../web-request.service';
import { Component } from '@angular/core';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
  CdkDrag,
  CdkDropList,
} from '@angular/cdk/drag-drop';
import { TaskService } from '../../task.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsideComponent } from '../../layout/aside/aside.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-project',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag,FormsModule,AsideComponent, HeaderComponent, RouterOutlet, MatSidenavModule, HttpClientModule],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  providers: [TaskService, WebRequestService]
})
export class ProjectComponent {
updateTaskDialog(_t40: any) {
throw new Error('Method not implemented.');
}
  taskParticipantsUsernames: string[] = [];
  TaskData: any;
  AllTasks: any;

  constructor(public TaskService: TaskService, private router: Router, private dialog: MatDialog,
    private route: ActivatedRoute,
    public webRequestService: WebRequestService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.fetchProjectDetails();
    });
  }

  private fetchProjectDetails(): void {
    this.webRequestService.getProjectById(this.projectId).subscribe(
      (project: any) => {
        this.projectName = project.title;
        this.projectDescription = project.description;
        this.projectTasks = project.tasks;

        this.processProjectTasks();
      },
      (error: any) => {
        console.error('Error fetching project details', error);
      }
    );
  }

  private processProjectTasks(): void {
    for (let i = 0; i < this.projectTasks.length; i++) {
      const element = this.projectTasks[i];
      this.fetchTaskDetails(element);
    }

    console.log('Tasks in Todo:', this.todo);
    console.log('Tasks in In Progress:', this.inProgress);
    console.log('Tasks in In Review:', this.inReview);
    console.log('Tasks in Done:', this.done);
  }

  private fetchTaskDetails(taskId: string): void {
    this.webRequestService.getTaskById(taskId).subscribe(
      (task) => {
        this.updateTaskLists(task);
        this.fetchTaskParticipants(task.participants);
      },
      (error) => {
        this.handleTaskFetchError(error);
      }
    );
  }

  private updateTaskLists(task: any): void {
    switch (task.status) {
      case 'Todo':
        this.todo.push(task);
        break;
      case 'In Progress':
        this.inProgress.push(task);
        break;
      case 'In Review':
        this.inReview.push(task);
        break;
      case 'Done':
        this.done.push(task);
        break;
      default:
        break;
    }
  }

  private fetchTaskParticipants(participantIds: string[]): void {
    for (const participantId of participantIds) {
      this.webRequestService.getUserDetails(participantId).subscribe(
        user => {
          const username = user.username;
          this.taskParticipantsUsernames.push(username);
        },
        error => {
          console.error(`Error fetching user details for participant ID ${participantId}:`, error);
        }
      );
    }
  }

  private handleTaskFetchError(error: any): void {
    console.error('Error fetching task details', error);
    if (error.status === 404) {
      console.log('Task not found. ID:', Element);
      // Handle non-existent task (e.g., display a message)
    } else {
      console.log('Unexpected error while fetching task details:', error);
      // Handle other errors
    }
  }



  tasksParticipants:any = []
  formatDate(inputDate: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedDate = new Date(inputDate).toLocaleDateString('en-GB', options);
    return formattedDate;
  }

  todo: any[] = [];

  inProgress: any[] = [];

  inReview : any[] = [];

  done: any[] = [];

  participating: any[] = [];



  projectId: any;
  projectName: any;
  projectDescription: any;
  projectTasks: any;




  /*Task methods*/
  title: any;
  description: any;
  priority: any;
  taskStatus: any;
  taskOwner: any;
  due_date: any;


  saveNewTask(): void {
    const userId = this.webRequestService.getUserDataFromToken()._id;


    const taskData = {
      title: this.title,
      description: this.description,
      due_date: this.due_date,
      priority: this.priority,
      owner: userId,
      projectId: this.projectId,
    };

    this.TaskService.createTask(taskData).subscribe(
      (createdTask) => {
        console.log('Task created successfully:', createdTask);
        this.todo.push(createdTask);
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
  }












  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      const status = ['Todo', 'In Progress', 'In Review', 'Done'];
      const str = event.container.id;
      const match = str.match(/\d+/);
      if (match) {
        const numberAsStr = match[0];
        const numberAsInt = parseInt(numberAsStr, 10);


        let updatedTask = event.container.data[event.currentIndex];
        updatedTask.status = status[numberAsInt]

        console.log("new status :", updatedTask.status);
        this.updateTask(updatedTask._id, updatedTask);
      }
    }
  }



  getPriorityColor(priority: string | undefined): string {
    if (priority) {
      switch (priority.toLowerCase()) {
        case 'high':
          return '#FF5959';
        case 'medium':
          return '#FFCA5A';
        case 'low':
          return '#85C1E9';
        default:
          return '#CCCCCC';
      }
    } else {
      return '#CCCCCC';
    }
  }

  getPriorityTextColor(priority: string | undefined): string {
    if (priority) {
      switch (priority.toLowerCase()) {
        case 'high':
        case 'medium':
          return '#FFFFFF';
        case 'low':
          return '#FFFFFF';
        default:
          return '#CCCCCC';
      }
    } else {
      return '#CCCCCC';
    }
  }


  unsubscribeTask(taskId: string): void {
    const userId = this.webRequestService.getUserDataFromToken()._id;

    this.TaskService.getTasksById(taskId).subscribe(
      (data: any) => {
        this.TaskData = data;

        if (this.TaskData.participants) {
          const indexToRemove = this.TaskData.participants.findIndex((id: any) => id === userId);
          const indexToRemove1 = this.participating.findIndex((id) => id === userId);
          if (indexToRemove !== -1) {
            this.TaskData.participants.splice(indexToRemove, 1);
            this.participating.splice(indexToRemove1, 1);
          }
        }

        if (this.TaskData.assigned_to === userId) {
          this.TaskData.assigned_to = '000000000000000000000000';
        }

        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as any);
        this.getTasks();
      },
      (error) => {
        console.error('Error getting task by ID:', error);
      }
    );
  }
  getTasks() {
    throw new Error('Method not implemented.');
  }



  public deleteTask(taskId: string): void {
    this.TaskService.getTasksById(taskId).subscribe((data) => {
    this.TaskData = data;
    this.TaskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Task deleted successfully');
        const indexToRemove = this.AllTasks.findIndex((task: { _id: any; }) => task._id === this.TaskData._id);
        if (indexToRemove !== -1) {
          this.AllTasks.splice(indexToRemove, 1);
        }
        this.getPartTasks();
      },
      (error) => {
        console.error('Error deleting task:', error);
      }
    );})
  }
  getPartTasks() {
    throw new Error('Method not implemented.');
  }







  updateTask(taskId: string, updatedTask: any) {
    this.TaskService.updateTask(taskId, updatedTask).subscribe(
      (response) => {
        console.log('Task updated:', response);
        this.getTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  openTask(taskId: string) {
    this.router.navigate(['task', taskId]);
  }


  editTask(taskId: string, data: any):any{

  }
}

