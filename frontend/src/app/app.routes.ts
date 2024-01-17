import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { TaskComponent } from './pages/task/task.component';
import { Routes } from '@angular/router';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home/project/:id', component: ProjectComponent },
  { path: 'home/projects', component: ProjectsComponent },
  { path: '', redirectTo: '/home/projects', pathMatch: 'full' }, // Adjust the default route if needed
  { path: "task/:taskId", component: TaskComponent }

];


