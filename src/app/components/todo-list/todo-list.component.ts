import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para ngModel
import { Task, TaskService } from '../../services/task.service';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [
    CommonModule, // Para *ngFor, *ngIf, etc.
    FormsModule   // Para [(ngModel)]
  ],
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (data) => this.tasks = data,
      error: (err) => console.error('Error al cargar tareas', err)
    });
  }

  addTask(): void {
    if (!this.newTaskTitle.trim()) return; // No añadir tareas vacías

    this.taskService.addTask(this.newTaskTitle).subscribe({
      next: (task) => {
        this.tasks.push(task);
        this.newTaskTitle = ''; // Limpiar el campo
      },
      error: (err) => console.error('Error al añadir tarea', err)
    });
  }

  toggleTaskCompletion(task: Task): void {
    this.taskService.updateTask(task.id, !task.completed).subscribe({
      next: (updatedTask) => {
        // Actualizar la tarea en la lista local
        const index = this.tasks.findIndex(t => t.id === updatedTask.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
      },
      error: (err) => console.error('Error al actualizar tarea', err)
    });
  }
}
