import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class WebRequestService {


  constructor(private http: HttpClient) { }

  registerUser(data: any):Observable<any>{
    return this.http.post('http://127.0.0.1:3000/user/register', data)
  }

  loginUser(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/user/login', data)
  }

  getProjects(): Observable<any>{
    return this.http.get(`http://127.0.0.1:3000/project`)
  }

  getProjectById(id: string): Observable<any> {
    const url = `http://127.0.0.1:3000/project/${id}`;
    return this.http.get(url);
  }

  getTaskById(taskId: string): Observable<any> {
    const url = `http://127.0.0.1:3000/task/${taskId}`;
    return this.http.get(url);
  }

  getUserDetails(userId: string): Observable<any> {
    const url = `http://127.0.0.1:3000/user/getById/${userId}`;
    return this.http.get(url);
  }

  
  getUser(id: String): Observable<any> {
    return this.http.get(`http://127.0.0.1:3000/user/getbyid/${id}`)
  }

  getUserId(username: String): Observable<any> {
    return this.http.get(`http://127.0.0.1:3000/user/getbyname/${username}`)
  }

  addProject(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:3000/project', data)
  }
  private apiUrl = 'http://127.0.0.1:3000/project';
  deleteProjectByTitle(title: string): Observable<any> {
    const url = `${this.apiUrl}/delete/${title}`;
    console.log('Delete URL:', url);
    return this.http.delete(url);
  }


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://127.0.0.1:3000/user/all`);
  }



  getUserDataFromToken(){
    const token = localStorage.getItem('token')
    if (!token) {
      console.log("Token not found")
    } else {
      try{
        let data = JSON.parse(window.atob(token.split('.')[1]))
        return data
      } catch (error) {
        console.error('Error parsing token:', error);
     }
    }
  }


}
