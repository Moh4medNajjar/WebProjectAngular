import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AsideComponent } from '../../layout/aside/aside.component';
import { HeaderComponent } from '../../layout/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { WebRequestService } from '../../web-request.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule ,AsideComponent, HeaderComponent, RouterOutlet, MatSidenavModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  providers: [WebRequestService]
})
export class ProjectsComponent implements OnInit{
  project:any;
  status: any;
  deadlineDate: any;
  title: any;
  description: any;
  category: any;
  launchDate: any; 
  constructor(private fb: FormBuilder, private webRequestService: WebRequestService) {}
  ngOnInit(){
    this.getProjects()
  }

  projectCards = [
    {
      title: 'Medical app development',
      status: 'New',
      isCompleted: false,
      description: 'Some descriptions about the project',
      images: [
        '../../../assets/image.png',
        '../../../assets/image.png',
        '../../../assets/image.png',
        '../../../assets/image.png'
      ],
      launchDate: 'January 10, 2024',
      commentsCount: 65
    },

  ];

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
  /*******************************************************/
  getProjects(){
    this.webRequestService.findProjects().subscribe(
      (project) => {
        this.projectCards.push(project)
      },
      (error) =>{
        console.log("error finding projects from database")
        console.log(error)
      }

    )
  }
  /***********************************************************/
  createProject() {
    const projectData = {
      title: this.title,
      description: this.description,
      deadlineDate: this.deadlineDate,
      category: this.category,
      status: this.status,
      launchDate: Date.now()
    };
      this.webRequestService.addProject(projectData).subscribe(
        (response: any) => {
          console.log('Project created successfully', response);
          //other treatments..
          this.projectCards.push(response)
        },
        (error: any) => {
          console.error('Error creating project', error);
        }
      );
    }
    deleteProject() {
      if (this.title) {
        this.webRequestService.deleteProjectByTitle(this.title).subscribe(
          (response:any) => {
            console.log('Project deleted successfully', response);
            this.projectCards = this.projectCards.filter(project => project.title !== this.title);
            // Optionally, clear the title after successful deletion
            this.title = '';
          },
          (error) => {
            console.error('Error deleting project', error);
            // Handle error, show a message, etc.
          }
        );
      } else {
        console.log('Please provide a project title.');
      }
    }
    
    
    

    
  
  }


