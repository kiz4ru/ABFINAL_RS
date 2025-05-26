import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:3000/api/tasks'; // URL de tu backend de tareas

  constructor(private http: HttpClient) { }

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  addTask(title: string): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, { title });
  }

  updateTask(id: number, completed: boolean): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}`, { completed });
  }
}
