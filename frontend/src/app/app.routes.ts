import { Routes } from '@angular/router';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectComponent } from './pages/project/project.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';



export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'home/projects', component: ProjectsComponent },
  { path: 'home/project', component: ProjectComponent },

];

