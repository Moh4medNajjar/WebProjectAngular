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
import { Task } from '../../task.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { AsideComponent } from '../../layout/aside/aside.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HttpClientModule } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { UpdateTaskDialogComponent } from '../../update-task-dialog/update-task-dialog.component';
import { NewTaskDialogComponent } from '../../new-task-dialog/new-task-dialog.component';
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
  public AllTasks: Task[] = [];
  public AllOwnedTasks: Task[] = [];
  public newTaskData: Task = {
    _id: undefined,
    title: '',
    priority: '',
    description: '',
    due_date: new Date(),
    owner: '',
    assigned_to: '000000000000000000000000',
    status: '',
    category: '',
    participants: [],
    comments: [],
    attachments: []
  };

  public TaskData: Task = {
    _id: undefined,
    title: '',
    priority: '',
    description: '',
    due_date: new Date(),
    owner: '',
    assigned_to: '000000000000000000000000',
    status: '',
    category: '',
    participants: [],
    comments: [],
    attachments: []
  };

  todo: Task[] = [];

  inProgress: Task[] = [];

  done: Task[] = [];

  participating: Task[] = [];

  inReview : Task[] = [];


  projectId: any;
  projectName: any;
  projectDescription: any;
  projectTasks: any;

  constructor(public TaskService: TaskService, private router: Router, private dialog: MatDialog,
    private route: ActivatedRoute,
    public webRequestService: WebRequestService
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
          this.getTasks();
          this.getPartTasks();
          // for (let i = 0; i < this.projectTasks.length; i++) {
          //   console.log(this.projectTasks[i]);
          //   let taskId = this.projectTasks[i];
          //   this.webRequestService.getTaskById(taskId).subscribe(
          //     (task: any) => {
          //       console.log(task)
          //       this.taskName = task.title;
          //       this.taskDescription = task.description;
          //       this.taskPriority = task.priority;
          //       this.taskStatus = task.status;
          //       this.taskOwner = task.owner;

          //       console.log(this.taskStatus)

          //     if (this.taskStatus === "Todo")
          //       this.todo.push(task);

          //     else if (this.taskStatus === "In Progress")
          //       this.inProgress.push(this.projectTasks[i]);
          //     else if (this.taskStatus === "In Review")
          //       this.inReview.push(this.projectTasks[i]);
          //     else if (this.taskStatus === "Done")
          //       this.done.push(this.projectTasks[i]);

          //     },
          //     (error: any) => {
          //       console.log('Error fetching task details', error)
          //     },
          //     (() => {
          //       console.log(this.todo)
          //     })


          //   )


          // }



          


        },
        (error: any) => {
          console.error('Error fetching project details', error);
        }
      );
    });
  }


  public getTasks(): void {
    this.todo = [];
    this.inProgress = [];
    this.done = [];
    this.AllTasks = [];
    this.AllOwnedTasks = [];
    const ownerId = this.webRequestService.getUserDataFromToken()._id;

    this.TaskService.getAllTasks(ownerId).subscribe((data: Task[]) => {
      this.AllOwnedTasks = data;

      if (this.AllOwnedTasks && Array.isArray(this.AllOwnedTasks)) {
        this.AllOwnedTasks.forEach((task: Task) => {
          switch (task.status) {
            case 'Todo':
              this.todo.push(task);
              break;
            case 'In Progress':
              this.inProgress.push(task);
              break;
            case 'Done':
              this.done.push(task);
              break;
            case 'In Review' :
              this.inReview.push(task);
              break;
          }
        });
      }
    });
  }




  /*Task methods*/
  taskName: string = "";
  taskDescription: string = "";
  taskPriority: string = "";
  taskStatus: string = "";
  taskOwner: string = "";





  public getPartTasks() {
    this.participating = [];
    this.AllTasks = [];
    const ownerId = this.webRequestService.getUserDataFromToken()._id;
    this.TaskService.getAllTasks().subscribe((data: Task[]) => {
      this.AllTasks = data;
      if (this.AllTasks && Array.isArray(this.AllTasks)) {
        this.AllTasks.forEach((task: Task) => {
          task.participants?.forEach((participant_id: string) => {
            if (participant_id == ownerId) {
              this.participating.push(task);
            }
          })
        });
      }
    });
  }




  public newTask() {
    this.newTaskData.status = 'Todo';
    this.newTaskData.owner = this.webRequestService.getUserDataFromToken()._id;
    this.TaskService.createTask(this.newTaskData).subscribe(
      (response) => {
        console.log('New task created:', response);
      },
      (error) => {
        console.error('Error creating task:', error);
      }
    );
    this.AllTasks.push(this.newTaskData);
    this.getTasks();
  }




  drop(event: CdkDragDrop<Task[]>) {
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


  getPriorityColor(priority: string): string {
    switch (priority.toLowerCase()) {
      case 'high':
        return '#FF7575';
      case 'medium':
        return '#FFD166';
      case 'low':
        return '#A3D9A5';
      default:
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

  public unsubscribeTask(taskId: string): void {
    const userId = this.webRequestService.getUserDataFromToken()._id;
  
    this.TaskService.getTasksById(taskId).subscribe(
      (data: Task) => {
        this.TaskData = data;
  
        if (this.TaskData.participants) {
          const indexToRemove = this.TaskData.participants.findIndex((id) => id === userId);
          const indexToRemove1 = this.participating.findIndex((id) => id === userId);
          if (indexToRemove !== -1) {
            this.TaskData.participants.splice(indexToRemove, 1);
            this.participating.splice(indexToRemove1, 1);
          }
        }
  
        if (this.TaskData.assigned_to === userId) {
          this.TaskData.assigned_to = '000000000000000000000000';
        }
  
        this.updateTask(this.TaskData?._id, this.TaskData ?? {} as Task);
        this.getTasks();
      },
      (error) => {
        console.error('Error getting task by ID:', error);
      }
    );
  }
  


  public deleteTask(taskId: string): void {
    this.TaskService.getTasksById(taskId).subscribe((data) => {
    this.TaskData = data; 
    this.TaskService.deleteTask(taskId).subscribe(
      () => {
        console.log('Task deleted successfully');
        const indexToRemove = this.AllTasks.findIndex(task => task._id === this.TaskData._id);
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

  newTaskDialog() {

    const dialogRef = this.dialog.open(NewTaskDialogComponent, {
      width: '700px',
      data: { newTaskData: this.newTaskData },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newTask();
      }
    });
  }




  updateTaskDialog(task: Task) {
    let taskId = task._id;
    const dialogRef = this.dialog.open(UpdateTaskDialogComponent, {
      width: '700px',
      data: { task },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateTask(taskId, result);
      }
    });
  }

  updateTask(taskId: string, updatedTask: Task) {
    this.TaskService.updateTask(taskId, updatedTask).subscribe(
      (response) => {
        console.log('Task updated:', response);
        this.getTasks();
      },
      (error) => {
        console.error('Error updating task:', error);
        // Handle error, display an error message, etc.
      }
    );
  }

  openTask(taskId: string) {
    this.router.navigate(['task', taskId]);
  }
}






