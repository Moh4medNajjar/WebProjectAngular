import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { AsideComponent } from '../../layout/aside/aside.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { WebRequestService } from '../../web-request.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RouterModule ,CommonModule,HttpClientModule,FormsModule ,AsideComponent, HeaderComponent, RouterOutlet, MatSidenavModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  providers: [WebRequestService, DatePipe]
})
export class ProjectsComponent {
  id: any;
  status: any;
  deadlineDate: any;
  title: any;
  description: any;
  category: any;
  launchDate: any;
  timeLeftPercentage: any

  constructor(private router: Router, private fb: FormBuilder, private webRequestService: WebRequestService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.fetchProjects();
  }


  fetchProjects() {
    this.webRequestService.getProjects().subscribe(
      (projects: any[]) => {

        this.projectCards = projects;
        console.log(projects)
      },
      (error: any) => {
        console.error('Error fetching projects', error);
      }
    );
  }

onProjectClick(projectId: string): void {
  this.router.navigate(['/home/project', projectId]);
}


  projectCards = [
    {
      title: 'Medical app development',
      status: 'New',
      isCompleted: true,
      description: 'Some descriptions about the project',
      images: [
        '../../../assets/image.png',
        '../../../assets/image.png',
        '../../../assets/image.png',
        '../../../assets/image.png'
      ],
      launchDate: 'January 10, 2024',
      deadlineDate: 'January 10, 2024',
      _id:"cgfgxdf",
      commentsCount: 65,
      timeLeftPercentage: 40,
    },

  ];

  calculateTimeLeftPercentage(launchDate: any, deadline: any): number {
    const now = new Date();
    const totalDuration = deadline.getTime() - launchDate.getTime();
    const elapsedTime = now.getTime() - launchDate.getTime();
    return Math.min((elapsedTime / totalDuration) * 100, 100);
  }

getProgressBarColor(percentage: number): string {
    if (percentage < 30) {
      return `linear-gradient(to right, #FF6B6B, #FF3838)`;
    } else if (percentage >= 30 && percentage <= 60) {
      return `linear-gradient(to right, #FFD166, #FFAB00)`;
    } else {
      const greenIntensity = 100 - (percentage - 60) * 2;
      return `linear-gradient(to right, #7CE995, #4CAF50 ${greenIntensity}%)`;
    }
  }
  getStatusColor(status: string): string {
    switch (status) {
      case 'New':
        return 'rgba(76, 175, 80, 0.5)';
      case 'In Progress':
        return 'rgba(255, 215, 0, 0.3)';
      case 'Deadline':
        return 'rgba(255, 99, 71, 0.5)';
      default:
        return '';
    }
  }



  getStatusTextColor(status: string): string {
    switch (status) {
      case 'New':
        return '#088408';
      case 'In Progress':
        return '#FFC20A';
      case 'Deadline':
        return '#FF0000';
      default:
        return '';
    }
  }
  createProject() {
    const projectData = {
      title: this.title,
      description: this.description,
      deadlineDate: this.deadlineDate,
      category: this.category,
      status: this.status,
      launchDate: Date.now(),
    };

    this.webRequestService.addProject(projectData).subscribe(
      (response: any) => {
        console.log('Project created successfully', response);
        //other treatments..
        this.projectCards.push(response);
      },
      (error: any) => {
        console.error('Error creating project', error);
      }
    );
}



  }


